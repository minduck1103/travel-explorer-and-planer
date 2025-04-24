import { type NextRequest, NextResponse } from "next/server"
import openai, { isOpenAIAvailable } from "@/lib/openai"
import { attractions } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { preferences, currentAttractionId, provinceId } = await request.json()

    // Lọc các địa điểm trong cùng tỉnh (nếu có)
    let availableAttractions = attractions
    if (provinceId) {
      availableAttractions = attractions.filter((a) => a.provinceId === provinceId)
    }

    // Loại bỏ địa điểm hiện tại (nếu có)
    if (currentAttractionId) {
      availableAttractions = availableAttractions.filter((a) => a.id !== currentAttractionId)
    }

    if (availableAttractions.length === 0) {
      return NextResponse.json({ recommendations: [] })
    }

    // Kiểm tra OpenAI client
    if (!isOpenAIAvailable()) {
      console.log("OpenAI không khả dụng, sử dụng đề xuất ngẫu nhiên")
      // Trả về các địa điểm ngẫu nhiên nếu không có AI
      const randomAttractions = [...availableAttractions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((attraction) => ({
          ...attraction,
          recommendationReason: preferences
            ? `Địa điểm phù hợp với sở thích: ${preferences}`
            : "Địa điểm du lịch phổ biến",
        }))

      return NextResponse.json({ recommendations: randomAttractions })
    }

    // Chuẩn bị dữ liệu cho AI
    const attractionsData = availableAttractions.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      rating: a.rating,
    }))

    const prompt = `
    Dựa trên sở thích của người dùng: "${preferences || "Các địa điểm du lịch nổi tiếng và đẹp"}", 
    hãy đề xuất 3 địa điểm du lịch phù hợp nhất từ danh sách sau:
    
    ${JSON.stringify(attractionsData)}
    
    Trả về kết quả dưới dạng mảng JSON với định dạng:
    {
      "recommendations": [
        {
          "id": [id của địa điểm],
          "reason": [lý do ngắn gọn tại sao địa điểm này phù hợp với sở thích của người dùng]
        }
      ]
    }
    `

    try {
      if (!openai) {
        throw new Error("OpenAI client không khởi tạo được")
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Bạn là một hệ thống đề xuất du lịch thông minh. Bạn trả về kết quả chính xác theo định dạng JSON được yêu cầu.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      })

      const content = response.choices[0].message.content
      const parsedContent = JSON.parse(content || '{"recommendations": []}')

      // Lấy thông tin đầy đủ của các địa điểm được đề xuất
      const recommendedAttractions = parsedContent.recommendations
        .map((rec: any) => {
          const attraction = attractions.find((a) => a.id === rec.id)
          return attraction
            ? {
                ...attraction,
                recommendationReason: rec.reason,
              }
            : null
        })
        .filter(Boolean)

      return NextResponse.json({ recommendations: recommendedAttractions })
    } catch (apiError) {
      console.error("Lỗi OpenAI API:", apiError)
      // Trả về các địa điểm ngẫu nhiên nếu có lỗi
      const randomAttractions = [...availableAttractions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((attraction) => ({
          ...attraction,
          recommendationReason: preferences
            ? `Địa điểm phù hợp với sở thích: ${preferences}`
            : "Địa điểm du lịch phổ biến",
        }))

      return NextResponse.json({ recommendations: randomAttractions })
    }
  } catch (error) {
    console.error("Lỗi khi đề xuất địa điểm:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi đề xuất địa điểm" }, { status: 500 })
  }
}

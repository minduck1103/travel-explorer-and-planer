import { NextResponse } from "next/server"
import genAI, { isGeminiAvailable } from "@/lib/gemini"
import { attractions } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const { preferences } = await req.json()

    if (!preferences) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp sở thích du lịch" },
        { status: 400 }
      )
    }

    // Kiểm tra Gemini client
    if (!isGeminiAvailable()) {
      console.log("Gemini không khả dụng, sử dụng đề xuất ngẫu nhiên")
      
      // Lấy ngẫu nhiên 3 địa điểm
      const randomAttractions = [...attractions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      return NextResponse.json({
        attractions: randomAttractions,
        isAIRecommendation: false
      })
    }

    // Chuẩn bị dữ liệu cho Gemini
    const attractionsData = attractions.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      rating: a.rating,
      categories: a.categories
    }))

    const prompt = `
    Bạn là một trợ lý du lịch thông minh. Hãy giúp tôi đề xuất các địa điểm du lịch phù hợp với sở thích sau:

    ${JSON.stringify(preferences, null, 2)}

    Dưới đây là danh sách các địa điểm du lịch có sẵn:
    ${JSON.stringify(attractionsData, null, 2)}

    Hãy phân tích sở thích và trả về một danh sách các địa điểm phù hợp nhất.
    Chỉ trả về ID của các địa điểm được đề xuất, tối đa 3 địa điểm.
    Format JSON: { "recommendedIds": ["id1", "id2", "id3"] }
    `

    if (!genAI) {
      throw new Error("Gemini client không khởi tạo được")
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const data = JSON.parse(text)
      const recommendedAttractions = attractions.filter(a => 
        data.recommendedIds.includes(a.id)
      )

      return NextResponse.json({
        attractions: recommendedAttractions,
        isAIRecommendation: true
      })
    } catch (error) {
      console.error("Lỗi parse kết quả từ AI:", error)
      
      // Fallback: Lấy ngẫu nhiên 3 địa điểm
      const randomAttractions = [...attractions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      return NextResponse.json({
        attractions: randomAttractions,
        isAIRecommendation: false
      })
    }

  } catch (error) {
    console.error("Lỗi API:", error)
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    )
  }
}

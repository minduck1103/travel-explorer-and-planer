import { NextResponse } from "next/server"
import genAI from "@/lib/gemini"
import { attractions } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: "Vui lòng nhập từ khóa tìm kiếm" },
        { status: 400 }
      )
    }

    // Kiểm tra Gemini client
    if (!genAI) {
      console.error("Gemini client không khởi tạo được")
      return NextResponse.json(
        { error: "Lỗi kết nối AI service" },
        { status: 500 }
      )
    }

    // Chuẩn bị dữ liệu cho Gemini
    const attractionsData = attractions.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      rating: a.rating
    }))

    const prompt = `
    Bạn là một trợ lý du lịch thông minh. Hãy giúp tôi tìm kiếm các địa điểm du lịch phù hợp với yêu cầu sau:

    "${query}"

    Dưới đây là danh sách các địa điểm du lịch có sẵn:
    ${JSON.stringify(attractionsData, null, 2)}

    Hãy phân tích yêu cầu và trả về một danh sách các địa điểm phù hợp nhất.
    Chỉ trả về ID của các địa điểm được đề xuất, tối đa 5 địa điểm.
    Format JSON: { "recommendedIds": ["id1", "id2", ...] }
    `

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
        attractions: recommendedAttractions
      })
    } catch (error) {
      console.error("Lỗi parse kết quả từ AI:", error)
      return NextResponse.json(
        { error: "Lỗi xử lý kết quả tìm kiếm" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Lỗi API:", error)
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    )
  }
}

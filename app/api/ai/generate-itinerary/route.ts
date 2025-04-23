import { NextResponse } from "next/server"
import genAI from "@/lib/gemini"
import { attractions } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const { selectedAttractions, days } = await req.json()

    if (!selectedAttractions || !days) {
      return NextResponse.json(
        { error: "Vui lòng chọn địa điểm và số ngày" },
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

    // Lấy thông tin chi tiết của các địa điểm được chọn
    const attractionsData = selectedAttractions.map((id: string) => {
      const attraction = attractions.find(a => a.id === id)
      if (!attraction) return null
      return {
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        categories: attraction.categories,
        rating: attraction.rating
      }
    }).filter(Boolean)

    const prompt = `
    Bạn là một chuyên gia lập lịch trình du lịch. Hãy giúp tôi lập lịch trình ${days} ngày cho các địa điểm sau:

    ${JSON.stringify(attractionsData, null, 2)}

    Yêu cầu:
    1. Sắp xếp các địa điểm hợp lý theo ngày
    2. Mỗi ngày nên có 2-3 địa điểm
    3. Tính toán thời gian di chuyển và tham quan hợp lý
    4. Đề xuất các hoạt động cụ thể tại mỗi điểm

    Trả về kết quả theo format JSON:
    {
      "itinerary": [
        {
          "day": 1,
          "activities": [
            {
              "time": "8:00",
              "attractionId": "id1",
              "duration": "2 giờ",
              "description": "Mô tả hoạt động"
            }
          ]
        }
      ]
    }
    `

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const data = JSON.parse(text)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Lỗi parse kết quả từ AI:", error)
      return NextResponse.json(
        { error: "Lỗi xử lý kết quả" },
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

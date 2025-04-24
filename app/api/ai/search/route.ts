import { type NextRequest, NextResponse } from "next/server"
import openai from "@/lib/openai"
import { attractions, provinces } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Thiếu từ khóa tìm kiếm" }, { status: 400 })
    }

    // Kiểm tra OpenAI client
    if (!openai) {
      console.error("OpenAI client không khởi tạo được")

      // Tìm kiếm cơ bản nếu không có AI
      const basicResults = [...provinces, ...attractions]
        .filter((item) => {
          const name = "name" in item ? item.name.toLowerCase() : ""
          const description = "description" in item ? item.description.toLowerCase() : ""
          const searchQuery = query.toLowerCase()
          return name.includes(searchQuery) || description.includes(searchQuery)
        })
        .slice(0, 5)
        .map((item) => {
          if ("provinceId" in item) {
            // Là attraction
            const province = provinces.find((p) => p.id === item.provinceId)
            return {
              ...item,
              type: "attraction",
              provinceName: province?.name,
              relevance: 80,
              matchReason: `Kết quả tìm kiếm cho "${query}"`,
            }
          } else {
            // Là province
            return {
              ...item,
              type: "province",
              relevance: 80,
              matchReason: `Kết quả tìm kiếm cho "${query}"`,
            }
          }
        })

      return NextResponse.json({ results: basicResults })
    }

    // Chuẩn bị dữ liệu cho AI
    const provincesData = provinces.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      type: "province",
    }))

    const attractionsData = attractions.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      description: a.description.substring(0, 100) + "...",
      provinceId: a.provinceId,
      type: "attraction",
    }))

    const allData = [...provincesData, ...attractionsData]

    const prompt = `
    Người dùng đang tìm kiếm: "${query}"
    
    Dựa trên từ khóa tìm kiếm, hãy tìm các địa điểm hoặc tỉnh thành phù hợp nhất từ danh sách sau:
    
    ${JSON.stringify(allData)}
    
    Trả về kết quả dưới dạng mảng JSON với định dạng:
    {
      "results": [
        {
          "id": [id của địa điểm/tỉnh],
          "type": [loại: "province" hoặc "attraction"],
          "relevance": [điểm liên quan từ 0-100, cao hơn = liên quan hơn],
          "matchReason": [lý do ngắn gọn tại sao kết quả này phù hợp với tìm kiếm]
        }
      ]
    }
    
    Chỉ trả về tối đa 5 kết quả liên quan nhất.
    `

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Bạn là một công cụ tìm kiếm du lịch thông minh. Bạn trả về kết quả chính xác theo định dạng JSON được yêu cầu.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      })

      const content = response.choices[0].message.content
      const parsedContent = JSON.parse(content || '{"results": []}')

      // Lấy thông tin đầy đủ của các kết quả tìm kiếm
      const searchResults = parsedContent.results
        .map((result: any) => {
          if (result.type === "province") {
            const province = provinces.find((p) => p.id === result.id)
            return province
              ? {
                  ...province,
                  type: "province",
                  relevance: result.relevance,
                  matchReason: result.matchReason,
                }
              : null
          } else {
            const attraction = attractions.find((a) => a.id === result.id)
            if (!attraction) return null
            const province = provinces.find((p) => p.id === attraction.provinceId)
            return {
              ...attraction,
              provinceName: province?.name,
              type: "attraction",
              relevance: result.relevance,
              matchReason: result.matchReason,
            }
          }
        })
        .filter(Boolean)

      return NextResponse.json({ results: searchResults })
    } catch (apiError) {
      console.error("Lỗi OpenAI API:", apiError)

      // Tìm kiếm cơ bản nếu có lỗi
      const basicResults = [...provinces, ...attractions]
        .filter((item) => {
          const name = "name" in item ? item.name.toLowerCase() : ""
          const description = "description" in item ? item.description.toLowerCase() : ""
          const searchQuery = query.toLowerCase()
          return name.includes(searchQuery) || description.includes(searchQuery)
        })
        .slice(0, 5)
        .map((item) => {
          if ("provinceId" in item) {
            // Là attraction
            const province = provinces.find((p) => p.id === item.provinceId)
            return {
              ...item,
              type: "attraction",
              provinceName: province?.name,
              relevance: 80,
              matchReason: `Kết quả tìm kiếm cho "${query}"`,
            }
          } else {
            // Là province
            return {
              ...item,
              type: "province",
              relevance: 80,
              matchReason: `Kết quả tìm kiếm cho "${query}"`,
            }
          }
        })

      return NextResponse.json({ results: basicResults })
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tìm kiếm" }, { status: 500 })
  }
}

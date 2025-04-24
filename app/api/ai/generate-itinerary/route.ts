import { type NextRequest, NextResponse } from "next/server"
import openai from "@/lib/openai"
import { attractions, provinces } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { provinceId, days, preferences, travelStyle } = await request.json()

    if (!provinceId || !days) {
      return NextResponse.json({ error: "Thiếu thông tin cần thiết" }, { status: 400 })
    }

    // Lấy thông tin tỉnh
    const province = provinces.find((p) => p.id === provinceId)
    if (!province) {
      return NextResponse.json({ error: "Không tìm thấy tỉnh" }, { status: 404 })
    }

    // Lấy các địa điểm trong tỉnh
    const provinceAttractions = attractions.filter((a) => a.provinceId === provinceId)

    // Kiểm tra OpenAI client
    if (!openai) {
      console.error("OpenAI client không khởi tạo được")

      // Tạo lịch trình cơ bản nếu không có AI
      const basicItinerary = {
        title: `Lịch trình ${days} ngày tại ${province.name}`,
        overview: `Khám phá những địa điểm nổi bật nhất tại ${province.name} trong ${days} ngày.`,
        days: Array.from({ length: days }, (_, i) => {
          const dayAttractions = provinceAttractions.sort(() => 0.5 - Math.random()).slice(0, 2)

          return {
            day: i + 1,
            title: `Ngày ${i + 1}: Khám phá ${province.name}`,
            activities: [
              {
                time: "Buổi sáng",
                description: `Tham quan ${dayAttractions[0]?.name || "các địa điểm du lịch"}`,
                attractions: dayAttractions[0] ? [{ id: dayAttractions[0].id, name: dayAttractions[0].name }] : [],
              },
              {
                time: "Buổi trưa",
                description: "Nghỉ ngơi và thưởng thức ẩm thực địa phương",
                attractions: [],
              },
              {
                time: "Buổi chiều",
                description: `Tham quan ${dayAttractions[1]?.name || "các địa điểm du lịch"}`,
                attractions: dayAttractions[1] ? [{ id: dayAttractions[1].id, name: dayAttractions[1].name }] : [],
              },
              {
                time: "Buổi tối",
                description: "Khám phá ẩm thực và đời sống về đêm",
                attractions: [],
              },
            ],
          }
        }),
        tips: [
          "Nên mang theo nước uống khi đi tham quan",
          "Kiểm tra thời tiết trước khi đi",
          "Mang theo tiền mặt để mua sắm tại các chợ địa phương",
        ],
      }

      return NextResponse.json({ itinerary: basicItinerary })
    }

    // Chuẩn bị dữ liệu cho AI
    const attractionsData = provinceAttractions.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      address: a.address,
      openingHours: a.openingHours,
      ticketPrice: a.ticketPrice,
      rating: a.rating,
    }))

    const prompt = `
    Hãy tạo một lịch trình du lịch ${days} ngày tại ${province.name} cho một du khách với sở thích: "${preferences || "Khám phá văn hóa và thiên nhiên"}" 
    và phong cách du lịch: "${travelStyle || "Cân bằng giữa tham quan và nghỉ ngơi"}".
    
    Sử dụng các địa điểm du lịch sau:
    ${JSON.stringify(attractionsData)}
    
    Lịch trình nên bao gồm:
    1. Kế hoạch chi tiết cho mỗi ngày (buổi sáng, trưa, chiều, tối)
    2. Các địa điểm tham quan từ danh sách trên
    3. Đề xuất về ăn uống, di chuyển
    4. Lời khuyên hữu ích cho du khách
    
    Trả về kết quả dưới dạng JSON với định dạng:
    {
      "title": "Tiêu đề lịch trình",
      "overview": "Tổng quan ngắn gọn về lịch trình",
      "days": [
        {
          "day": 1,
          "title": "Tiêu đề ngày 1",
          "activities": [
            {
              "time": "Buổi sáng",
              "description": "Mô tả hoạt động buổi sáng",
              "attractions": [{"id": 1, "name": "Tên địa điểm"}]
            },
            {
              "time": "Buổi trưa",
              "description": "Mô tả hoạt động buổi trưa",
              "attractions": []
            },
            {
              "time": "Buổi chiều",
              "description": "Mô tả hoạt động buổi chiều",
              "attractions": [{"id": 2, "name": "Tên địa điểm"}]
            },
            {
              "time": "Buổi tối",
              "description": "Mô tả hoạt động buổi tối",
              "attractions": []
            }
          ]
        }
      ],
      "tips": ["Lời khuyên 1", "Lời khuyên 2"]
    }
    `

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Bạn là một chuyên gia lập kế hoạch du lịch Việt Nam. Bạn tạo ra các lịch trình du lịch chi tiết, thực tế và hấp dẫn.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      })

      const content = response.choices[0].message.content
      const itinerary = JSON.parse(content || "{}")

      return NextResponse.json({ itinerary })
    } catch (apiError) {
      console.error("Lỗi OpenAI API:", apiError)

      // Tạo lịch trình cơ bản nếu có lỗi
      const basicItinerary = {
        title: `Lịch trình ${days} ngày tại ${province.name}`,
        overview: `Khám phá những địa điểm nổi bật nhất tại ${province.name} trong ${days} ngày.`,
        days: Array.from({ length: days }, (_, i) => {
          const dayAttractions = provinceAttractions.sort(() => 0.5 - Math.random()).slice(0, 2)

          return {
            day: i + 1,
            title: `Ngày ${i + 1}: Khám phá ${province.name}`,
            activities: [
              {
                time: "Buổi sáng",
                description: `Tham quan ${dayAttractions[0]?.name || "các địa điểm du lịch"}`,
                attractions: dayAttractions[0] ? [{ id: dayAttractions[0].id, name: dayAttractions[0].name }] : [],
              },
              {
                time: "Buổi trưa",
                description: "Nghỉ ngơi và thưởng thức ẩm thực địa phương",
                attractions: [],
              },
              {
                time: "Buổi chiều",
                description: `Tham quan ${dayAttractions[1]?.name || "các địa điểm du lịch"}`,
                attractions: dayAttractions[1] ? [{ id: dayAttractions[1].id, name: dayAttractions[1].name }] : [],
              },
              {
                time: "Buổi tối",
                description: "Khám phá ẩm thực và đời sống về đêm",
                attractions: [],
              },
            ],
          }
        }),
        tips: [
          "Nên mang theo nước uống khi đi tham quan",
          "Kiểm tra thời tiết trước khi đi",
          "Mang theo tiền mặt để mua sắm tại các chợ địa phương",
        ],
      }

      return NextResponse.json({ itinerary: basicItinerary })
    }
  } catch (error) {
    console.error("Lỗi khi tạo lịch trình:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tạo lịch trình" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import openai, { generateFallbackDescription, isOpenAIAvailable } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { attractionName, baseDescription, province } = await request.json()

    if (!attractionName || !baseDescription) {
      return NextResponse.json({ error: "Thiếu thông tin cần thiết" }, { status: 400 })
    }

    // Kiểm tra API key và OpenAI client
    if (!isOpenAIAvailable()) {
      console.log("OpenAI không khả dụng, sử dụng mô tả dự phòng")
      const fallbackDescription = generateFallbackDescription(attractionName, baseDescription, province)
      return NextResponse.json({ description: fallbackDescription })
    }

    const prompt = `
    Bạn là một chuyên gia du lịch Việt Nam với kiến thức sâu rộng về lịch sử, văn hóa và địa lý.
    Hãy viết một bài mô tả chi tiết, hấp dẫn và thông tin về địa điểm du lịch "${attractionName}" ở ${province || "Việt Nam"}.
    
    Thông tin cơ bản: ${baseDescription}
    
    Mô tả chi tiết nên bao gồm:
    1. Lịch sử và ý nghĩa văn hóa của địa điểm
    2. Đặc điểm nổi bật và lý do nên ghé thăm
    3. Trải nghiệm du khách có thể mong đợi
    4. Thời điểm lý tưởng để tham quan
    5. Lời khuyên cho du khách
    
    Viết bằng tiếng Việt, giọng điệu thân thiện, chuyên nghiệp và hấp dẫn. Chia thành các đoạn văn rõ ràng.
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
            content: "Bạn là một chuyên gia du lịch Việt Nam với kiến thức sâu rộng về các địa điểm du lịch.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const generatedDescription = response.choices[0].message.content

      return NextResponse.json({ description: generatedDescription })
    } catch (apiError: any) {
      console.error("Lỗi OpenAI API:", apiError.message, apiError.stack)

      // Sử dụng mô tả dự phòng nếu có lỗi
      const fallbackDescription = generateFallbackDescription(attractionName, baseDescription, province)
      return NextResponse.json({ description: fallbackDescription })
    }
  } catch (error: any) {
    console.error("Lỗi khi tạo mô tả:", error.message, error.stack)

    // Trả về lỗi nếu không thể xử lý request
    return NextResponse.json(
      { error: `Đã xảy ra lỗi khi tạo mô tả: ${error.message || "Không xác định"}` },
      { status: 500 },
    )
  }
}

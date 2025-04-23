import { NextResponse } from "next/server"
import genAI, { generateFallbackDescription, isGeminiAvailable } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { name, categories, features } = await req.json()

    // Kiểm tra API key và Gemini client
    if (!isGeminiAvailable()) {
      console.log("Gemini không khả dụng, sử dụng mô tả dự phòng")
      return NextResponse.json({
        description: generateFallbackDescription(),
        isAIGenerated: false
      })
    }

    const prompt = `
    Bạn là một chuyên gia du lịch Việt Nam. Hãy viết một đoạn mô tả hấp dẫn về địa điểm du lịch sau:

    Tên địa điểm: ${name}
    Loại hình: ${categories?.join(", ") || "Chưa phân loại"}
    Đặc điểm: ${features?.join(", ") || "Chưa có thông tin"}

    Yêu cầu:
    1. Độ dài khoảng 2-3 câu
    2. Nhấn mạnh những điểm đặc sắc
    3. Sử dụng ngôn ngữ hấp dẫn, sinh động
    4. Tránh các từ ngữ klise hoặc quá chung chung
    5. Viết bằng tiếng Việt

    Chỉ trả về đoạn mô tả, không cần thêm bất kỳ thông tin nào khác.
    `

    if (!genAI) {
      throw new Error("Gemini client không khởi tạo được")
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const description = response.text().trim()

    return NextResponse.json({
      description,
      isAIGenerated: true
    })

  } catch (error) {
    console.error("Lỗi API:", error)
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    )
  }
}

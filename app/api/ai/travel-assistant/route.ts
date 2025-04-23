import { type NextRequest, NextResponse } from "next/server"
import gemini, { getChatModel } from "@/lib/gemini"
import { attractions, provinces } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    console.log("Đang xử lý yêu cầu mới...")
    const { message, chatHistory } = await request.json()
    console.log("Tin nhắn nhận được:", message)

    if (!message) {
      console.log("Lỗi: Thiếu nội dung tin nhắn")
      return NextResponse.json({ error: "Thiếu nội dung tin nhắn" }, { status: 400 })
    }

    // Kiểm tra Gemini client
    if (!gemini) {
      console.error("Gemini client không khởi tạo được - Kiểm tra API key")
      return NextResponse.json({
        error: "Gemini client không khởi tạo được",
        reply: "Xin lỗi, dịch vụ trợ lý AI hiện không khả dụng. Vui lòng kiểm tra API key và thử lại sau.",
      })
    }

    const model = getChatModel()
    if (!model) {
      console.error("Không thể tạo chat model")
      return NextResponse.json({
        error: "Không thể tạo chat model",
        reply: "Xin lỗi, dịch vụ trợ lý AI hiện không khả dụng. Vui lòng thử lại sau.",
      })
    }

    console.log("Gemini client đã sẵn sàng, đang chuẩn bị dữ liệu...")

    // Chuẩn bị dữ liệu cho AI
    const provincesData = provinces.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
    }))

    const attractionsData = attractions.map((a) => ({
      id: a.id,
      name: a.name,
      provinceId: a.provinceId,
      description: a.description.substring(0, 100) + "...",
    }))

    // Chuẩn bị prompt cho AI
    const systemPrompt = `Bạn là trợ lý du lịch thông minh cho Việt Nam. Bạn có kiến thức về các tỉnh thành và địa điểm du lịch sau:
    
    Tỉnh thành: ${JSON.stringify(provincesData)}
    
    Địa điểm du lịch: ${JSON.stringify(attractionsData)}
    
    Hãy trả lời các câu hỏi về du lịch Việt Nam một cách thân thiện, hữu ích và chính xác. 
    Nếu được hỏi về địa điểm không có trong dữ liệu, hãy đề xuất các địa điểm tương tự từ dữ liệu có sẵn.
    Trả lời bằng tiếng Việt, ngắn gọn và hữu ích.`

    console.log("Đang gửi yêu cầu đến Gemini API...")

    try {
      // Khởi tạo chat mới với system prompt
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hãy xác nhận vai trò của bạn" }],
          },
          {
            role: "model",
            parts: [{ text: systemPrompt }],
          },
          ...(chatHistory?.map((msg: any) => ({
            role: msg.isUser ? "user" : "model",
            parts: [{ text: msg.content }],
          })) || []),
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      })

      const result = await chat.sendMessage([{ text: message }])
      const response = await result.response
      
      console.log("Nhận được phản hồi từ Gemini")
      const reply = response.text()

      if (!reply) {
        throw new Error("Không nhận được phản hồi từ AI")
      }

      return NextResponse.json({ reply })
    } catch (apiError: any) {
      console.error("Lỗi Gemini API:", apiError)
      console.error("Chi tiết lỗi:", {
        message: apiError.message,
        name: apiError.name,
      })
      
      return NextResponse.json({
        error: apiError.message || "Lỗi khi giao tiếp với AI",
        reply: "Xin lỗi, tôi đang gặp khó khăn trong việc xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
      })
    }
  } catch (error: any) {
    console.error("Lỗi khi xử lý tin nhắn:", error)
    console.error("Stack trace:", error.stack)
    return NextResponse.json({ 
      error: error.message || "Đã xảy ra lỗi khi xử lý tin nhắn",
      stack: error.stack
    }, { status: 500 })
  }
}

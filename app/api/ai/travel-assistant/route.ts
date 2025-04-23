import { type NextRequest, NextResponse } from "next/server"
import openai from "@/lib/openai"
import { attractions, provinces } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Thiếu nội dung tin nhắn" }, { status: 400 })
    }

    // Kiểm tra OpenAI client
    if (!openai) {
      console.error("OpenAI client không khởi tạo được")
      return NextResponse.json({
        reply:
          "Xin lỗi, dịch vụ trợ lý AI hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ với quản trị viên để được hỗ trợ.",
      })
    }

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

    // Chuẩn bị tin nhắn cho AI
    const systemMessage = {
      role: "system",
      content: `Bạn là trợ lý du lịch thông minh cho Việt Nam. Bạn có kiến thức về các tỉnh thành và địa điểm du lịch sau:
      
      Tỉnh thành: ${JSON.stringify(provincesData)}
      
      Địa điểm du lịch: ${JSON.stringify(attractionsData)}
      
      Hãy trả lời các câu hỏi về du lịch Việt Nam một cách thân thiện, hữu ích và chính xác. 
      Nếu được hỏi về địa điểm không có trong dữ liệu, hãy đề xuất các địa điểm tương tự từ dữ liệu có sẵn.
      Trả lời bằng tiếng Việt, ngắn gọn và hữu ích.`,
    }

    // Chuẩn bị lịch sử trò chuyện
    const formattedChatHistory =
      chatHistory?.map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      })) || []

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemMessage, ...formattedChatHistory, { role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 500,
      })

      const reply = response.choices[0].message.content

      return NextResponse.json({ reply })
    } catch (apiError) {
      console.error("Lỗi OpenAI API:", apiError)
      return NextResponse.json({
        reply: "Xin lỗi, tôi đang gặp khó khăn trong việc xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
      })
    }
  } catch (error) {
    console.error("Lỗi khi xử lý tin nhắn:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi xử lý tin nhắn" }, { status: 500 })
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai"

// Khởi tạo Gemini client
let gemini: GoogleGenerativeAI | null = null

// Kiểm tra xem đang chạy ở phía server hay không
const isServer = typeof window === "undefined"

if (isServer) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error("GEMINI_API_KEY không được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env")
      throw new Error("GEMINI_API_KEY không được cấu hình")
    }

    gemini = new GoogleGenerativeAI(apiKey)
    console.log("Gemini client đã được khởi tạo thành công.")
  } catch (error) {
    console.error("Lỗi khi khởi tạo Gemini client:", error)
    throw error
  }
}

export default gemini

// Hàm kiểm tra xem Gemini client có sẵn sàng không
export function isGeminiAvailable(): boolean {
  return !!gemini
}

// Hàm tạo chat model
export function getChatModel() {
  if (!gemini) return null
  return gemini.getGenerativeModel({ model: "gemini-pro" })
} 
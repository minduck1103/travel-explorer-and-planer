import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "sonner"

// Khởi tạo Gemini client
let genAI: GoogleGenerativeAI | null = null

// Kiểm tra xem đang chạy ở phía server hay không
const isServer = typeof window === "undefined"

if (isServer) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      const error = "Chưa cấu hình GEMINI_API_KEY. Vui lòng kiểm tra file .env"
      console.error("❌", error)
      throw new Error(error)
    }

    genAI = new GoogleGenerativeAI(apiKey)
    console.log("✅ Đã khởi tạo Gemini client thành công")
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("❌ Lỗi khởi tạo Gemini client:", errorMessage)

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        toast.error("API key không hợp lệ hoặc hết hạn")
      } else {
        toast.error(`Lỗi Gemini: ${error.message}`)
      }
    } else {
      toast.error("Lỗi không xác định khi khởi tạo Gemini")
    }
  }
}

export default genAI

// Hàm kiểm tra xem Gemini client có sẵn sàng không
export function isGeminiAvailable(): boolean {
  return !!genAI
}

// Hàm tạo chat model
export function getChatModel() {
  if (!genAI) return null
  return genAI.getGenerativeModel({ model: "gemini-pro" })
}

// Hàm tạo mô tả dự phòng khi API không khả dụng
export function generateFallbackDescription(): string {
  return "Đây là một địa điểm du lịch tuyệt vời ở Việt Nam. Hãy đến và khám phá!"
} 
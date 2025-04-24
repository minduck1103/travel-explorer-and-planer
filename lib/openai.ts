import OpenAI from "openai"
import { toast } from "sonner"

// Khởi tạo OpenAI client
let openai: OpenAI | null = null

// Kiểm tra xem đang chạy ở phía server hay không
const isServer = typeof window === "undefined"

if (isServer) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      const error = "Chưa cấu hình OPENAI_API_KEY. Vui lòng kiểm tra file .env"
      console.error(error)
      throw new Error(error)
    }

      openai = new OpenAI({
        apiKey: apiKey,
      timeout: 15000, // Giảm timeout xuống 15 giây
      maxRetries: 3, // Tăng số lần thử lại
      defaultHeaders: {
        "User-Agent": "TravelApp/1.0.0"
      },
      defaultQuery: {
        "api-version": "2024-02"
      }
      })

    console.log("✅ Đã khởi tạo OpenAI client thành công")
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định"
    console.error("❌ Lỗi khởi tạo OpenAI client:", errorMessage)
    
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          toast.error("API key không hợp lệ. Vui lòng kiểm tra lại")
          break
        case 429:
          toast.error("Đã vượt quá giới hạn request. Vui lòng thử lại sau")
          break
        case 500:
          toast.error("Lỗi server OpenAI. Vui lòng thử lại sau")
          break
        default:
          toast.error(`Lỗi OpenAI: ${error.message}`)
      }
    }
    
    throw error
  }
}

export default openai

// Hàm kiểm tra xem OpenAI client có sẵn sàng không
export function isOpenAIAvailable(): boolean {
  return !!openai
}

// Hàm tạo mô tả dự phòng
export function generateFallbackDescription(
  attractionName: string,
  baseDescription: string,
  provinceName?: string,
): string {
  return `${attractionName} là một địa điểm du lịch nổi tiếng tại ${provinceName || "Việt Nam"}. 

${baseDescription}

Địa điểm này thu hút nhiều du khách bởi vẻ đẹp độc đáo và giá trị văn hóa lịch sử. Khi đến thăm ${attractionName}, du khách sẽ được trải nghiệm không gian tuyệt vời và tìm hiểu thêm về văn hóa địa phương.

Thời điểm lý tưởng để tham quan là vào mùa xuân và mùa thu khi thời tiết mát mẻ, dễ chịu. Du khách nên dành ít nhất 2-3 giờ để khám phá đầy đủ địa điểm này.

Lưu ý: Đây là mô tả dự phòng do không thể kết nối với dịch vụ AI. Vui lòng thử lại sau để xem mô tả chi tiết hơn.`
}

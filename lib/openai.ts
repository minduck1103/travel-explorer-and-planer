import OpenAI from "openai"

// Khởi tạo OpenAI client
let openai: OpenAI | null = null

// Kiểm tra xem đang chạy ở phía server hay không
const isServer = typeof window === "undefined"

if (isServer) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.warn("OPENAI_API_KEY không được cấu hình. Một số tính năng AI sẽ không hoạt động.")
    } else {
      openai = new OpenAI({
        apiKey: apiKey,
        timeout: 30000, // Tăng timeout lên 30 giây
        maxRetries: 2, // Thử lại tối đa 2 lần
      })
      console.log("OpenAI client đã được khởi tạo thành công.")
    }
  } catch (error) {
    console.error("Lỗi khi khởi tạo OpenAI client:", error)
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

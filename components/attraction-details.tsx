"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Attraction {
  id: number
  name: string
  description: string
  provinceId: number
  // Các thuộc tính khác
}

interface AttractionDetailsProps {
  attraction: Attraction
  provinceName?: string
}

export function AttractionDetails({ attraction, provinceName }: AttractionDetailsProps) {
  const [aiDescription, setAiDescription] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const generateAIDescription = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attractionName: attraction.name,
          baseDescription: attraction.description,
          province: provinceName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Lỗi HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (!data.description) {
        throw new Error("Không nhận được mô tả từ API")
      }

      setAiDescription(data.description)
    } catch (err: any) {
      console.error("Lỗi khi tạo mô tả AI:", err)
      setError(err.message || "Đã xảy ra lỗi khi tạo mô tả. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Tạo mô tả dự phòng khi không thể kết nối với API
  const generateFallbackDescription = (attraction: Attraction, provinceName?: string): string => {
    return `${attraction.name} là một địa điểm du lịch nổi tiếng tại ${provinceName || "Việt Nam"}. 

${attraction.description}

Địa điểm này thu hút nhiều du khách bởi vẻ đẹp độc đáo và giá trị văn hóa lịch sử. Khi đến thăm ${attraction.name}, du khách sẽ được trải nghiệm không gian tuyệt vời và tìm hiểu thêm về văn hóa địa phương.

Thời điểm lý tưởng để tham quan là vào mùa xuân và mùa thu khi thời tiết mát mẻ, dễ chịu. Du khách nên dành ít nhất 2-3 giờ để khám phá đầy đủ địa điểm này.

Lưu ý: Đây là mô tả dự phòng do không thể kết nối với dịch vụ AI. Vui lòng thử lại sau để xem mô tả chi tiết hơn.`
  }

  // Tự động tạo mô tả khi component được tải
  useEffect(() => {
    generateAIDescription()
  }, [attraction.id, retryCount])

  // Hàm thử lại với độ trễ
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  return (
    <Tabs defaultValue="ai-description">
      <TabsList className="mb-4">
        <TabsTrigger value="ai-description">Mô tả chi tiết (AI)</TabsTrigger>
        <TabsTrigger value="description">Mô tả cơ bản</TabsTrigger>
        <TabsTrigger value="history">Lịch sử</TabsTrigger>
      </TabsList>

      <TabsContent value="ai-description" className="min-h-[200px]">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="prose dark:prose-invert max-w-none">
              <p>Đang hiển thị mô tả dự phòng:</p>
              {generateFallbackDescription(attraction, provinceName)
                .split("\n")
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              <div className="text-right mt-4">
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại với AI
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {aiDescription?.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="text-right mt-4">
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tạo mô tả mới
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="description" className="min-h-[200px]">
        <div className="prose dark:prose-invert max-w-none">
          <p>{attraction.description}</p>
        </div>
      </TabsContent>

      <TabsContent value="history" className="min-h-[200px]">
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Thông tin lịch sử về {attraction.name} sẽ được hiển thị ở đây. Trong phiên bản hoàn chỉnh, nội dung này sẽ
            được lấy từ cơ sở dữ liệu hoặc API.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Attraction {
  id: number
  name: string
  slug: string
  imageUrl: string
  description: string
  recommendationReason?: string
}

interface AIRecommendedAttractionsProps {
  currentAttractionId?: number
  provinceId?: number
}

export function AIRecommendedAttractions({ currentAttractionId, provinceId }: AIRecommendedAttractionsProps) {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [preferences, setPreferences] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/recommend-attractions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences,
          currentAttractionId,
          provinceId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Lỗi HTTP: ${response.status}`)
      }

      const data = await response.json()
      setAttractions(data.recommendations || [])
    } catch (error: any) {
      console.error("Lỗi khi lấy đề xuất:", error)
      setError(error.message || "Đã xảy ra lỗi khi lấy đề xuất. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [currentAttractionId, provinceId, retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preferences">Sở thích của bạn (tùy chọn)</Label>
        <div className="flex gap-2">
          <Textarea
            id="preferences"
            placeholder="Ví dụ: Tôi thích thiên nhiên, lịch sử và ẩm thực địa phương..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={fetchRecommendations} variant="outline" className="self-end">
            <RefreshCw className="h-4 w-4 mr-2" />
            Cập nhật
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : attractions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Không tìm thấy đề xuất phù hợp.</p>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="overflow-hidden h-full">
              <div className="aspect-video relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${attraction.imageUrl})` }}
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{attraction.name}</h3>
                {attraction.recommendationReason && (
                  <p className="text-sm text-muted-foreground mb-4 italic">"{attraction.recommendationReason}"</p>
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{attraction.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/attractions/${attraction.slug}`}>Xem chi tiết</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

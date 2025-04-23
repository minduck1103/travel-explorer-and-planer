"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Calendar, Clock } from "lucide-react"
import { provinces } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

interface ItineraryActivity {
  time: string
  description: string
  attractions: { id: number; name: string }[]
}

interface ItineraryDay {
  day: number
  title: string
  activities: ItineraryActivity[]
}

interface Itinerary {
  title: string
  overview: string
  days: ItineraryDay[]
  tips: string[]
}

export function AIItineraryGenerator() {
  const [provinceId, setProvinceId] = useState<string>("")
  const [days, setDays] = useState<string>("3")
  const [preferences, setPreferences] = useState<string>("")
  const [travelStyle, setTravelStyle] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)

  const handleGenerate = async () => {
    if (!provinceId || !days) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provinceId: Number.parseInt(provinceId),
          days: Number.parseInt(days),
          preferences,
          travelStyle,
        }),
      })

      if (!response.ok) {
        throw new Error("Không thể tạo lịch trình")
      }

      const data = await response.json()
      setItinerary(data.itinerary)
    } catch (error) {
      console.error("Lỗi khi tạo lịch trình:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tạo lịch trình du lịch với AI</CardTitle>
          <CardDescription>Nhập thông tin để AI tạo lịch trình du lịch phù hợp với nhu cầu của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Tỉnh/Thành phố</Label>
              <Select value={provinceId} onValueChange={setProvinceId}>
                <SelectTrigger id="province">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id.toString()}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Số ngày</Label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger id="days">
                  <SelectValue placeholder="Chọn số ngày" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 7, 10].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day} ngày
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences">Sở thích (tùy chọn)</Label>
            <Input
              id="preferences"
              placeholder="Ví dụ: Ẩm thực, lịch sử, thiên nhiên, mua sắm..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelStyle">Phong cách du lịch (tùy chọn)</Label>
            <Textarea
              id="travelStyle"
              placeholder="Ví dụ: Du lịch tiết kiệm, du lịch sang trọng, du lịch gia đình, du lịch mạo hiểm..."
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading || !provinceId || !days}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo lịch trình...
              </>
            ) : (
              "Tạo lịch trình"
            )}
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              {Array.from({ length: Number.parseInt(days) }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && itinerary && (
        <Card>
          <CardHeader>
            <CardTitle>{itinerary.title}</CardTitle>
            <CardDescription>{itinerary.overview}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {itinerary.days.map((day) => (
                <AccordionItem key={day.day} value={`day-${day.day}`}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Ngày {day.day}: {day.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-2">
                          <div className="flex items-center text-primary font-medium mb-2">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{activity.time}</span>
                          </div>
                          <p className="text-sm mb-2">{activity.description}</p>
                          {activity.attractions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.attractions.map((attraction) => (
                                <span
                                  key={attraction.id}
                                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                                >
                                  {attraction.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Lời khuyên cho chuyến đi</h3>
              <ul className="list-disc list-inside space-y-1">
                {itinerary.tips.map((tip, index) => (
                  <li key={index} className="text-sm">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

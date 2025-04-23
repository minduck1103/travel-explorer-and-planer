"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { attractions } from "@/lib/data"

interface SavedAttractionsProps {
  savedAttractionIds: number[]
}

export function SavedAttractions({ savedAttractionIds }: SavedAttractionsProps) {
  const { toast } = useToast()
  const [savedIds, setSavedIds] = useState<number[]>(savedAttractionIds)

  const savedAttractions = attractions.filter((attraction) => savedIds.includes(attraction.id))

  const handleRemove = (id: number) => {
    setSavedIds(savedIds.filter((savedId) => savedId !== id))

    toast({
      title: "Đã xóa khỏi danh sách",
      description: "Địa điểm đã được xóa khỏi danh sách yêu thích của bạn.",
    })
  }

  if (savedAttractions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Bạn chưa lưu địa điểm du lịch nào.</p>
            <Button asChild>
              <Link href="/provinces">Khám phá địa điểm du lịch</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {savedAttractions.map((attraction) => (
        <Card key={attraction.id} className="overflow-hidden">
          <div className="flex h-full">
            <div className="w-1/3 bg-cover bg-center" style={{ backgroundImage: `url(${attraction.imageUrl})` }} />
            <CardContent className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">{attraction.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{attraction.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/attractions/${attraction.slug}`}>Xem chi tiết</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => handleRemove(attraction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}

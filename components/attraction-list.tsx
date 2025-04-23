"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"

interface Attraction {
  id: number
  provinceId: number
  name: string
  slug: string
  imageUrl: string
  description: string
  address: string
  openingHours: string
  ticketPrice: string
  rating: number
  coordinates: { lat: number; lng: number }
}

interface AttractionListProps {
  attractions: Attraction[]
}

export function AttractionList({ attractions }: AttractionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")

  const filteredAttractions = attractions.filter((attraction) =>
    attraction.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sắp xếp địa điểm
  if (sortBy === "name-asc") {
    filteredAttractions.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === "name-desc") {
    filteredAttractions.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortBy === "rating-asc") {
    filteredAttractions.sort((a, b) => a.rating - b.rating)
  } else if (sortBy === "rating-desc") {
    filteredAttractions.sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Tìm kiếm địa điểm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Tên (A-Z)</SelectItem>
              <SelectItem value="name-desc">Tên (Z-A)</SelectItem>
              <SelectItem value="rating-asc">Đánh giá (Thấp đến cao)</SelectItem>
              <SelectItem value="rating-desc">Đánh giá (Cao đến thấp)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAttractions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Không tìm thấy địa điểm du lịch nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction) => (
            <Card key={attraction.id} className="overflow-hidden h-full flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${attraction.imageUrl})` }}
                />
              </div>
              <CardContent className="p-6 flex-grow">
                <h3 className="font-semibold text-xl mb-2">{attraction.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{attraction.description}</p>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{attraction.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{attraction.address}</span>
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/attractions/${attraction.slug}`}>Xem chi tiết</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

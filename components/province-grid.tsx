"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { provinces, attractions } from "@/lib/data"

export function ProvinceGrid() {
  const [searchQuery, setSearchQuery] = useState("")

  // Tính toán số lượng địa điểm thực tế cho mỗi tỉnh
  const provincesWithActualCount = provinces.map(province => {
    const actualCount = attractions.filter(attraction => attraction.provinceId === province.id).length
    return { ...province, attractionCount: actualCount }
  })

  const filteredProvinces = provincesWithActualCount.filter((province) =>
    province.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <Input
          placeholder="Tìm kiếm tỉnh thành..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProvinces.map((province) => (
          <Link href={`/provinces/${province.slug}`} key={province.id}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
              <div className="aspect-video relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${province.imageUrl})` }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{province.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{province.attractionCount} địa điểm du lịch</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

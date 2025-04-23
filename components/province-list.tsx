"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { provinces, attractions } from "@/lib/data"

export function ProvinceList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")

  // Tính toán số lượng địa điểm thực tế cho mỗi tỉnh
  const provincesWithActualCount = provinces.map(province => {
    const actualCount = attractions.filter(attraction => attraction.provinceId === province.id).length
    return { ...province, attractionCount: actualCount }
  })

  const filteredProvinces = provincesWithActualCount.filter((province) =>
    province.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sắp xếp tỉnh thành
  if (sortBy === "name-asc") {
    filteredProvinces.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === "name-desc") {
    filteredProvinces.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortBy === "attractions-asc") {
    filteredProvinces.sort((a, b) => a.attractionCount - b.attractionCount)
  } else if (sortBy === "attractions-desc") {
    filteredProvinces.sort((a, b) => b.attractionCount - a.attractionCount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Tìm kiếm tỉnh thành..."
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
              <SelectItem value="attractions-asc">Số địa điểm (Tăng dần)</SelectItem>
              <SelectItem value="attractions-desc">Số địa điểm (Giảm dần)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProvinces.map((province) => (
          <Link href={`/provinces/${province.slug}`} key={province.id}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
              <div className="aspect-video relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${province.imageUrl})` }}
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">{province.name}</h3>
                <p className="text-muted-foreground mb-4">{province.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{province.attractionCount} địa điểm du lịch</span>
                  <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-300">
                    Khám phá
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

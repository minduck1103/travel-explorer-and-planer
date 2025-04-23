import { attractions, provinces } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Star } from "lucide-react"

export default function PopularAttractionsPage() {
  // Lấy 10 địa điểm có rating cao nhất
  const topAttractions = [...attractions]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map(attraction => ({
      ...attraction,
      province: provinces.find(p => p.id === attraction.provinceId)
    }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">10 Địa Điểm Du Lịch Nổi Bật Nhất</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topAttractions.map((attraction, index) => (
          <Link href={`/attractions/${attraction.slug}`} key={attraction.id}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
              <div className="aspect-video relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${attraction.imageUrl})` }}
                />
                <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-md">
                  #{index + 1}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">{attraction.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {attraction.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{attraction.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {attraction.province?.name}
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
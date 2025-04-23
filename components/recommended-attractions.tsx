import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Attraction {
  id: number
  name: string
  slug: string
  imageUrl: string
  description: string
}

interface RecommendedAttractionsProps {
  attractions: Attraction[]
}

export function RecommendedAttractions({ attractions }: RecommendedAttractionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-muted-foreground mb-4 line-clamp-2">{attraction.description}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/attractions/${attraction.slug}`}>Xem chi tiết</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

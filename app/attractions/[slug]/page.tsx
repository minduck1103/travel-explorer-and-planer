import { notFound } from "next/navigation"
import Link from "next/link"
import { attractions, provinces } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { SaveAttractionButton } from "@/components/save-attraction-button"
import { AttractionDetails } from "@/components/attraction-details"
import { AIRecommendedAttractions } from "@/components/ai-recommended-attractions"
import { AttractionMap } from "@/components/attraction-map"
import { ArrowLeft } from "lucide-react"

interface AttractionPageProps {
  params: {
    slug: string
  }
}

export default function AttractionPage({ params }: AttractionPageProps) {
  const attraction = attractions.find((a) => a.slug === params.slug)

  if (!attraction) {
    notFound()
  }

  const province = provinces.find((p) => p.id === attraction.provinceId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/provinces/${province?.slug}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại {province?.name}</span>
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{attraction.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link href={`/provinces/${province?.slug}`} className="hover:underline">
                {province?.name}
              </Link>
            </div>
          </div>
          <SaveAttractionButton attractionId={attraction.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div
            className="w-full aspect-video bg-cover bg-center rounded-lg mb-8"
            style={{ backgroundImage: `url(${attraction.imageUrl})` }}
          />
          <AttractionDetails attraction={attraction} provinceName={province?.name} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Thông tin</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{attraction.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giờ mở cửa</p>
                  <p className="font-medium">{attraction.openingHours}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá vé</p>
                  <p className="font-medium">{attraction.ticketPrice}</p>
                </div>
              </div>
            </div>

            <AttractionMap
              name={attraction.name}
              latitude={attraction.coordinates.lat}
              longitude={attraction.coordinates.lng}
              address={attraction.address}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Địa điểm đề xuất dành cho bạn</h2>
        <AIRecommendedAttractions currentAttractionId={attraction.id} provinceId={attraction.provinceId} />
      </div>
    </div>
  )
}

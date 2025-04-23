import { notFound } from "next/navigation"
import { provinces, attractions } from "@/lib/data"
import { AttractionList } from "@/components/attraction-list"

interface ProvincePageProps {
  params: {
    slug: string
  }
}

export default function ProvincePage({ params }: ProvincePageProps) {
  const province = provinces.find((p) => p.slug === params.slug)

  if (!province) {
    notFound()
  }

  const provinceAttractions = attractions.filter((attraction) => attraction.provinceId === province.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{province.name}</h1>
        <p className="text-lg text-muted-foreground mb-6">{province.description}</p>
        <div
          className="w-full h-64 bg-cover bg-center rounded-lg mb-8"
          style={{ backgroundImage: `url(${province.imageUrl})` }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Địa điểm du lịch tại {province.name}</h2>
        <AttractionList attractions={provinceAttractions} />
      </div>
    </div>
  )
}

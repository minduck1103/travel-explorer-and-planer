"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const images = [
  {
    src: "/images/nature-1.jpg",
    alt: "Vịnh Hạ Long",
    description: "Vịnh Hạ Long - Di sản thiên nhiên thế giới"
  },
  {
    src: "/images/nature-2.jpg",
    alt: "Ruộng bậc thang Mù Cang Chải",
    description: "Ruộng bậc thang Mù Cang Chải - Kiệt tác của thiên nhiên"
  },
  {
    src: "/images/nature-3.jpg",
    alt: "Đảo Phú Quốc",
    description: "Đảo Phú Quốc - Thiên đường biển đảo"
  },
  {
    src: "/images/nature-4.jpg",
    alt: "Sa Pa",
    description: "Sa Pa - Thành phố trong sương"
  }
]

export function NatureGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Thiên nhiên Việt Nam</h2>
        <div className="relative">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-4">{images[currentIndex].alt}</h3>
                <p className="text-lg">{images[currentIndex].description}</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
} 
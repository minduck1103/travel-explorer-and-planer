"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

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

  // Tự động chuyển ảnh mỗi 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // Hàm chuyển đến ảnh trước
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  // Hàm chuyển đến ảnh tiếp theo
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Khám Phá Thiên Nhiên Việt Nam</h2>
        <div className="relative max-w-4xl mx-auto">
          {/* Ảnh hiện tại */}
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg shadow-xl">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover transition-transform duration-500"
              priority
            />
            {/* Overlay với text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif mb-2 tracking-wide">
                  {images[currentIndex].alt}
                </h3>
                <p className="text-lg font-light italic">
                  {images[currentIndex].description}
                </p>
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-rose-500 w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 
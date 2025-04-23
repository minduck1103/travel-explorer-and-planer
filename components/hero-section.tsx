import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          filter: "brightness(0.7)",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Khám phá vẻ đẹp Việt Nam</h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
          Hành trình khám phá những địa điểm du lịch tuyệt vời nhất tại Việt Nam
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
            <Link href="/provinces">Khám phá ngay</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
            <Link href="/about">Tìm hiểu thêm</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

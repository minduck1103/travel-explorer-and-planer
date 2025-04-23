import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
      {/* Banner Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/banner-landing.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.8)"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white font-serif drop-shadow-lg">
              Khám phá vẻ đẹp Việt Nam
            </h1>
            <p className="mx-auto max-w-[700px] text-white md:text-xl italic drop-shadow-md">
              Hành trình khám phá những địa điểm du lịch tuyệt vời nhất tại Việt Nam
            </p>
          </div>
          <div className="w-full max-w-sm pt-4">
            <Link href="/provinces">
              <Button 
                className="w-full bg-rose/80 hover:bg-[#FFB347] text-primary-foreground text-lg font-semibold 
                          transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg
                          border border-white/20"
              >
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

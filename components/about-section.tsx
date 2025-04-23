import Image from "next/image"

export function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/about-us.jpg"
              alt="Về chúng tôi"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Về chúng tôi</h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi là đội ngũ đam mê du lịch và khám phá vẻ đẹp của Việt Nam. 
              Với nhiều năm kinh nghiệm trong lĩnh vực du lịch, chúng tôi mong muốn 
              mang đến cho bạn những trải nghiệm tuyệt vời nhất khi khám phá đất nước 
              hình chữ S xinh đẹp.
            </p>
            <p className="text-gray-600">
              Từ những bãi biển tuyệt đẹp, những ngọn núi hùng vĩ, đến những di sản 
              văn hóa độc đáo, chúng tôi sẽ giúp bạn khám phá và trải nghiệm Việt Nam 
              một cách trọn vẹn nhất.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 
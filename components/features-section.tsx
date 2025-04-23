import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Compass, Calendar, Users } from "lucide-react"

const features = [
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Địa điểm đa dạng",
    description: "Khám phá hàng ngàn địa điểm du lịch từ Bắc vào Nam"
  },
  {
    icon: <Compass className="h-8 w-8" />,
    title: "Hướng dẫn chi tiết",
    description: "Thông tin chi tiết về các điểm đến và kinh nghiệm du lịch"
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Lịch trình tối ưu",
    description: "Gợi ý lịch trình phù hợp với thời gian và sở thích của bạn"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Cộng đồng du lịch",
    description: "Kết nối với những người yêu du lịch và chia sẻ kinh nghiệm"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-rose-600 mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 
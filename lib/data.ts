// Dữ liệu mẫu cho các tỉnh thành
export const provinces = [
  {
    id: 1,
    name: "Hà Nội",
    slug: "ha-noi",
    imageUrl: "/images/provinces/ha-noi.jpg",
    attractionCount: 15,
    description: "Thủ đô ngàn năm văn hiến với nhiều di tích lịch sử và văn hóa đặc sắc.",
  },
  {
    id: 2,
    name: "Hồ Chí Minh",
    slug: "ho-chi-minh",
    imageUrl: "/images/provinces/ho-chi-minh.jpg",
    attractionCount: 12,
    description: "Thành phố năng động và hiện đại nhất Việt Nam với nhiều điểm tham quan hấp dẫn.",
  },
  {
    id: 3,
    name: "Đà Nẵng",
    slug: "da-nang",
    imageUrl: "/images/provinces/da-nang.jpg",
    attractionCount: 8,
    description: "Thành phố đáng sống với những bãi biển đẹp và nhiều điểm du lịch hấp dẫn.",
  },
  {
    id: 4,
    name: "Huế",
    slug: "hue",
    imageUrl: "/images/provinces/hue.jpg",
    attractionCount: 10,
    description: "Cố đô với nhiều di tích lịch sử và văn hóa đặc sắc.",
  },
  {
    id: 5,
    name: "Hội An",
    slug: "hoi-an",
    imageUrl: "/images/provinces/hoi-an.jpg",
    attractionCount: 6,
    description: "Phố cổ đẹp như tranh vẽ với kiến trúc cổ kính và văn hóa đặc trưng.",
  },
  {
    id: 6,
    name: "Nha Trang",
    slug: "nha-trang",
    imageUrl: "/images/provinces/nha-trang.jpg",
    attractionCount: 7,
    description: "Thành phố biển xinh đẹp với nhiều bãi biển và điểm du lịch hấp dẫn.",
  },
  {
    id: 7,
    name: "Đà Lạt",
    slug: "da-lat",
    imageUrl: "/images/provinces/da-lat.jpg",
    attractionCount: 9,
    description: "Thành phố ngàn hoa với khí hậu mát mẻ và cảnh quan thiên nhiên tuyệt đẹp.",
  },
  {
    id: 8,
    name: "Hạ Long",
    slug: "ha-long",
    imageUrl: "/images/provinces/ha-long.jpg",
    attractionCount: 10,
    description: "Nổi tiếng với vịnh Hạ Long - một trong những kỳ quan thiên nhiên của thế giới.",
  },
]

// Dữ liệu mẫu cho các địa điểm du lịch
export const attractions = [
  // Hà Nội
  {
    id: 1,
    provinceId: 1,
    name: "Hồ Hoàn Kiếm",
    slug: "ho-hoan-kiem",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description:
      "Hồ Hoàn Kiếm, còn được gọi là Hồ Gươm, là một hồ nước ngọt tự nhiên nằm ở trung tâm thành phố Hà Nội.",
    address: "Quận Hoàn Kiếm, Hà Nội",
    openingHours: "Mở cửa 24/7",
    ticketPrice: "Miễn phí",
    rating: 4.7,
    coordinates: { lat: 21.0285, lng: 105.8542 },
  },
  {
    id: 2,
    provinceId: 1,
    name: "Văn Miếu - Quốc Tử Giám",
    slug: "van-mieu-quoc-tu-giam",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description:
      "Văn Miếu - Quốc Tử Giám là quần thể di tích đa dạng gồm Văn Miếu, nơi thờ Khổng Tử và Quốc Tử Giám, trường đại học đầu tiên của Việt Nam.",
    address: "58 Quốc Tử Giám, Đống Đa, Hà Nội",
    openingHours: "8:00 - 18:00",
    ticketPrice: "30.000 VNĐ",
    rating: 4.6,
    coordinates: { lat: 21.0293, lng: 105.8354 },
  },
  {
    id: 3,
    provinceId: 1,
    name: "Hoàng Thành Thăng Long",
    slug: "hoang-thanh-thang-long",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description:
      "Hoàng thành Thăng Long là quần thể di tích gắn liền với lịch sử Thăng Long - Hà Nội, được UNESCO công nhận là Di sản văn hóa thế giới.",
    address: "19C Hoàng Diệu, Ba Đình, Hà Nội",
    openingHours: "8:00 - 17:00",
    ticketPrice: "40.000 VNĐ",
    rating: 4.5,
    coordinates: { lat: 21.0379, lng: 105.8414 },
  },

  // Hồ Chí Minh
  {
    id: 4,
    provinceId: 2,
    name: "Nhà thờ Đức Bà",
    slug: "nha-tho-duc-ba",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description: "Nhà thờ Đức Bà là một công trình kiến trúc Gothic nổi tiếng tại trung tâm Thành phố Hồ Chí Minh.",
    address: "Công xã Paris, Bến Nghé, Quận 1, TP.HCM",
    openingHours: "8:00 - 17:00",
    ticketPrice: "Miễn phí",
    rating: 4.6,
    coordinates: { lat: 10.7798, lng: 106.699 },
  },
  {
    id: 5,
    provinceId: 2,
    name: "Bảo tàng Chứng tích Chiến tranh",
    slug: "bao-tang-chung-tich-chien-tranh",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description:
      "Bảo tàng Chứng tích Chiến tranh là một bảo tàng về lịch sử chiến tranh Việt Nam tại Thành phố Hồ Chí Minh.",
    address: "28 Võ Văn Tần, Phường 6, Quận 3, TP.HCM",
    openingHours: "7:30 - 18:00",
    ticketPrice: "40.000 VNĐ",
    rating: 4.7,
    coordinates: { lat: 10.7798, lng: 106.6921 },
  },

  // Đà Nẵng
  {
    id: 6,
    provinceId: 3,
    name: "Bà Nà Hills",
    slug: "ba-na-hills",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description: "Bà Nà Hills là khu du lịch nghỉ dưỡng nổi tiếng với Cầu Vàng và nhiều công trình kiến trúc độc đáo.",
    address: "Hoà Ninh, Hoà Vang, Đà Nẵng",
    openingHours: "7:00 - 22:00",
    ticketPrice: "750.000 VNĐ",
    rating: 4.8,
    coordinates: { lat: 15.9977, lng: 107.9886 },
  },
  {
    id: 7,
    provinceId: 3,
    name: "Bãi biển Mỹ Khê",
    slug: "bai-bien-my-khe",
    imageUrl: "/placeholder.svg?height=400&width=600",
    description: "Bãi biển Mỹ Khê được tạp chí Forbes bình chọn là một trong những bãi biển quyến rũ nhất hành tinh.",
    address: "Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng",
    openingHours: "Mở cửa 24/7",
    ticketPrice: "Miễn phí",
    rating: 4.7,
    coordinates: { lat: 16.0544, lng: 108.2478 },
  },
]

// Dữ liệu mẫu cho người dùng
export const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    password: "password123", // Trong thực tế, mật khẩu phải được mã hóa
    savedAttractions: [1, 3, 6],
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    password: "password456",
    savedAttractions: [2, 4, 7],
  },
]

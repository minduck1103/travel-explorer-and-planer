import { NextResponse } from "next/server"

export async function GET() {
  // Lấy API key từ biến môi trường server-side
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key không được cấu hình" }, { status: 500 })
  }

  // Tạo URL với API key
  const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`

  // Trả về URL
  return NextResponse.json({ url: mapsUrl })
}

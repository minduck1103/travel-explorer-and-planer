"use client"

import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface GoogleMapProps {
  latitude: number
  longitude: number
  name: string
  zoom?: number
  height?: string
}

export function GoogleMap({ latitude, longitude, name, zoom = 15, height = "300px" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Hàm khởi tạo Google Maps
    const initializeMap = () => {
      if (!mapRef.current) return

      try {
        // @ts-ignore - Google Maps API được tải bên ngoài TypeScript
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        })

        // Thêm marker cho địa điểm
        // @ts-ignore
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title: name,
          animation: window.google.maps.Animation.DROP,
        })

        setIsLoaded(true)
      } catch (err) {
        console.error("Lỗi khi khởi tạo Google Maps:", err)
        setError("Không thể tải bản đồ. Vui lòng thử lại sau.")
      }
    }

    // Kiểm tra xem Google Maps API đã được tải chưa
    if (window.google && window.google.maps) {
      initializeMap()
    } else {
      // Nếu chưa tải, đăng ký callback khi API được tải
      window.initMap = initializeMap
      setIsLoaded(false)
    }
  }, [latitude, longitude, zoom, name])

  return (
    <div className="w-full rounded-md overflow-hidden">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !isLoaded ? (
        <Skeleton className="w-full" style={{ height }} />
      ) : (
        <div ref={mapRef} className="w-full" style={{ height }} />
      )}
    </div>
  )
}

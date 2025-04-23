"use client"

import { useEffect, useState } from "react"
import { GoogleMap } from "@/components/google-map"
import { loadGoogleMapsAPI } from "@/lib/google-maps"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, MapPin, RefreshCw } from "lucide-react"

interface AttractionMapProps {
  name: string
  latitude: number
  longitude: number
  address: string
}

export function AttractionMap({ name, latitude, longitude, address }: AttractionMapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (!showMap) return

    const loadMap = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await loadGoogleMapsAPI()
        setIsMapLoaded(true)
      } catch (err: any) {
        console.error("Lỗi khi tải Google Maps API:", err)
        setError(err.message || "Không thể tải Google Maps. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    loadMap()
  }, [showMap])

  const handleLoadMap = () => {
    setShowMap(true)
  }

  const handleRetry = () => {
    setIsMapLoaded(false)
    setShowMap(false)
    setTimeout(() => {
      setShowMap(true)
    }, 100)
  }

  if (!showMap) {
    return (
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Bản đồ</h3>
        <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center p-4 text-center">
          <MapPin className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">Xem vị trí của {name} trên bản đồ</p>
          <Button onClick={handleLoadMap}>Tải bản đồ</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Vị trí: {latitude}, {longitude}
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/50">
      <h3 className="font-medium mb-2">Bản đồ</h3>

      {isLoading ? (
        <Skeleton className="aspect-square w-full rounded-md" />
      ) : error ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi khi tải bản đồ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      ) : isMapLoaded ? (
        <div className="space-y-2">
          <GoogleMap latitude={latitude} longitude={longitude} name={name} height="250px" />
          <div className="flex items-start gap-2 mt-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{address}</p>
          </div>
        </div>
      ) : (
        <Skeleton className="aspect-square w-full rounded-md" />
      )}
    </div>
  )
}

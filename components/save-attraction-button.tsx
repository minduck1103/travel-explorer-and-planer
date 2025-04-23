"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface SaveAttractionButtonProps {
  attractionId: number
}

export function SaveAttractionButton({ attractionId }: SaveAttractionButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(user?.savedAttractions?.includes(attractionId) || false)

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để lưu địa điểm này.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Trong thực tế, đây sẽ là một API call để lưu/bỏ lưu địa điểm
    setIsSaved(!isSaved)

    toast({
      title: isSaved ? "Đã bỏ lưu địa điểm" : "Đã lưu địa điểm",
      description: isSaved
        ? "Địa điểm đã được xóa khỏi danh sách yêu thích của bạn."
        : "Địa điểm đã được thêm vào danh sách yêu thích của bạn.",
    })
  }

  return (
    <Button
      onClick={handleSave}
      variant={isSaved ? "default" : "outline"}
      className={isSaved ? "bg-rose-600 hover:bg-rose-700" : ""}
    >
      <Bookmark className={`h-5 w-5 mr-2 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Đã lưu" : "Lưu địa điểm"}
    </Button>
  )
}

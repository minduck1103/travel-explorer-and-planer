"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Đã xảy ra lỗi</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        Rất tiếc, đã xảy ra lỗi khi tải trang này. Vui lòng thử lại sau.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Thử lại
        </Button>
        <Button asChild>
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}

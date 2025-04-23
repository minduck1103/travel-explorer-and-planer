import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Trang chủ
      </Link>
      <Link
        href="/provinces"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Địa điểm
      </Link>
      <Link
        href="/popular"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Nổi bật
      </Link>
      <Link
        href="/attractions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Du lịch
      </Link>
      <Link
        href="/ai-assistant"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Trợ lý AI
      </Link>
    </nav>
  )
} 
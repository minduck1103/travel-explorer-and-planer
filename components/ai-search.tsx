"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: number
  name: string
  slug: string
  description?: string
  type: "province" | "attraction"
  relevance: number
  matchReason: string
  provinceName?: string
}

export function AISearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")
  const router = useRouter()

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm")
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const filteredResults = activeTab === "all" ? results : results.filter((result) => result.type === activeTab)

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Tìm kiếm địa điểm, tỉnh thành..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          {!isLoading && "Tìm kiếm"}
        </Button>
      </div>

      {results.length > 0 && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả ({results.length})</TabsTrigger>
            <TabsTrigger value="province">
              Tỉnh thành ({results.filter((r) => r.type === "province").length})
            </TabsTrigger>
            <TabsTrigger value="attraction">
              Địa điểm ({results.filter((r) => r.type === "attraction").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {filteredResults.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Không tìm thấy kết quả phù hợp</p>
              ) : (
                filteredResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.type === "province" ? `/provinces/${result.slug}` : `/attractions/${result.slug}`}
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{result.name}</h3>
                            {result.type === "attraction" && result.provinceName && (
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{result.provinceName}</span>
                              </div>
                            )}
                            <p className="text-sm mt-2">{result.matchReason}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {result.type === "province" ? "Tỉnh thành" : "Địa điểm"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

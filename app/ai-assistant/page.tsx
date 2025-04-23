import { AITravelAssistant } from "@/components/ai-travel-assistant"
import { AISearch } from "@/components/ai-search"
import { AIItineraryGenerator } from "@/components/ai-itinerary-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Trợ lý Du lịch AI</h1>
      <p className="text-muted-foreground mb-8">
        Sử dụng sức mạnh của AI để lên kế hoạch và khám phá các địa điểm du lịch tại Việt Nam
      </p>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="chat">Trò chuyện với AI</TabsTrigger>
          <TabsTrigger value="search">Tìm kiếm thông minh</TabsTrigger>
          <TabsTrigger value="itinerary">Tạo lịch trình</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-0">
          <div className="max-w-3xl mx-auto">
            <AITravelAssistant />
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <div className="max-w-3xl mx-auto">
            <AISearch />
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="mt-0">
          <div className="max-w-3xl mx-auto">
            <AIItineraryGenerator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  isUser: boolean
}

export function AITravelAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Xin chào! Tôi là trợ lý du lịch AI. Tôi có thể giúp bạn tìm kiếm thông tin về các địa điểm du lịch, đề xuất lịch trình, hoặc trả lời các câu hỏi về du lịch Việt Nam. Bạn cần giúp đỡ gì?",
      isUser: false,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleSend = async (message: string) => {
    if (!message.trim()) return

    const userMessageId = generateMessageId()
    const aiMessageId = generateMessageId()

    try {
      setMessages((prev) => [...prev, { id: userMessageId, content: message, isUser: true }])
    setInput("")
    setIsLoading(true)

      const response = await fetch("/api/ai/travel-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          chatHistory: messages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Không thể kết nối với trợ lý AI")
      }

      if (!data.reply) {
        throw new Error("Không nhận được phản hồi từ AI")
      }

      setMessages((prev) => [...prev, { id: aiMessageId, content: data.reply, isUser: false }])
    } catch (error: any) {
      console.error("Lỗi khi gửi tin nhắn:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể kết nối với trợ lý AI",
        variant: "destructive",
      })
      // Remove the user message if there was an error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessageId))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          Trợ lý Du lịch AI
        </CardTitle>
        <CardDescription>Hỏi đáp và tư vấn về du lịch Việt Nam</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start max-w-[80%]">
                {!message.isUser && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.isUser && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

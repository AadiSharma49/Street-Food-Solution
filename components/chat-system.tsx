"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Send, Phone, Video, MoreVertical } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  message_type: "text" | "image" | "file"
  is_read: boolean
  created_at: string
  sender_name: string
  sender_type: "vendor" | "supplier"
}

interface ChatUser {
  id: string
  name: string
  type: "vendor" | "supplier"
  last_message?: string
  last_message_time?: string
  unread_count: number
  is_online: boolean
}

interface ChatSystemProps {
  currentUserId: string
  currentUserType: "vendor" | "supplier"
}

export function ChatSystem({ currentUserId, currentUserType }: ChatSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentUserId) {
      fetchChatUsers()
      subscribeToMessages()
    }
  }, [currentUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          sender_id,
          receiver_id,
          message,
          created_at,
          is_read,
          sender_name,
          sender_type
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Group messages by conversation partner
      const userMap = new Map<string, ChatUser>()
      let totalUnread = 0

      data?.forEach((msg) => {
        const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
        const partnerName = msg.sender_id === currentUserId ? "You" : msg.sender_name
        const partnerType = msg.sender_id === currentUserId ? currentUserType : msg.sender_type

        if (!userMap.has(partnerId)) {
          userMap.set(partnerId, {
            id: partnerId,
            name: partnerName === "You" ? `${msg.sender_type} User` : partnerName,
            type: partnerType as "vendor" | "supplier",
            last_message: msg.message,
            last_message_time: msg.created_at,
            unread_count: 0,
            is_online: Math.random() > 0.5, // Mock online status
          })
        }

        if (msg.receiver_id === currentUserId && !msg.is_read) {
          const user = userMap.get(partnerId)!
          user.unread_count++
          totalUnread++
        }
      })

      setChatUsers(Array.from(userMap.values()))
      setUnreadCount(totalUnread)
    } catch (error) {
      console.error("Error fetching chat users:", error)
    }
  }

  const fetchMessages = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: currentUserId,
        receiver_id: selectedChat.id,
        message: newMessage,
        sender_name: "Current User", // This should be the actual user name
        sender_type: currentUserType,
      })

      if (error) throw error

      setNewMessage("")
      fetchMessages(selectedChat.id)
      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          if (selectedChat && newMessage.sender_id === selectedChat.id) {
            setMessages((prev) => [...prev, newMessage])
          }
          fetchChatUsers() // Refresh chat list
          toast({
            title: "New message",
            description: `You have a new message from ${newMessage.sender_name}`,
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const selectChat = (user: ChatUser) => {
    setSelectedChat(user)
    fetchMessages(user.id)
    setIsMinimized(false)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-orange-500 hover:bg-orange-600 shadow-lg relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[600px] p-0">
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-1/3 border-r bg-gray-50">
              <DialogHeader className="p-4 border-b">
                <DialogTitle>Messages</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(600px-80px)]">
                <div className="p-2">
                  {chatUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => selectChat(user)}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-white transition-colors ${
                        selectedChat?.id === user.id ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.is_online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            {user.last_message_time && (
                              <span className="text-xs text-gray-500">{formatTime(user.last_message_time)}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{user.last_message}</p>
                            {user.unread_count > 0 && (
                              <Badge className="bg-orange-500 text-white text-xs">{user.unread_count}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {selectedChat.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedChat.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {selectedChat.is_online ? "Online" : "Offline"} • {selectedChat.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender_id === currentUserId
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_id === currentUserId ? "text-orange-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} className="bg-orange-500 hover:bg-orange-600">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

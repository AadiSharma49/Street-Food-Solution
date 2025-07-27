"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, Share2, MapPin, Timer, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface GroupOrder {
  id: string
  product_id: string
  product_name: string
  product_image?: string
  category: string
  unit: string
  target_quantity: number
  current_quantity: number
  regular_price: number
  group_price: number
  savings_per_unit: number
  end_date: string
  status: "active" | "completed" | "cancelled"
  participants_count: number
  created_by: string
  supplier_id: string
  supplier_name: string
  supplier_location: string
  description?: string
  participants: Array<{
    vendor_id: string
    vendor_name: string
    quantity: number
    joined_at: string
  }>
}

interface CreateGroupOrderData {
  product_id: string
  target_quantity: number
  group_price: number
  end_date: string
  description: string
}

export function GroupBuyingSystem() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<GroupOrder | null>(null)
  const [joinQuantity, setJoinQuantity] = useState(1)

  useEffect(() => {
    fetchGroupOrders()
  }, [])

  const fetchGroupOrders = async () => {
    try {
      // In a real app, this would fetch from the database
      // For now, using sample data
      const sampleOrders: GroupOrder[] = [
        {
          id: "1",
          product_id: "prod1",
          product_name: "Premium Basmati Rice",
          product_image: "/placeholder.svg?height=200&width=200&text=Basmati+Rice",
          category: "Grains & Cereals",
          unit: "kg",
          target_quantity: 500,
          current_quantity: 320,
          regular_price: 120,
          group_price: 95,
          savings_per_unit: 25,
          end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          participants_count: 12,
          created_by: "vendor1",
          supplier_id: "sup1",
          supplier_name: "Delhi Grain House",
          supplier_location: "Delhi, NCR",
          description:
            "Premium quality basmati rice perfect for biryanis and pulao. Join this group order to save ₹25 per kg!",
          participants: [
            { vendor_id: "v1", vendor_name: "Mumbai Street Foods", quantity: 50, joined_at: "2024-01-15T10:00:00Z" },
            { vendor_id: "v2", vendor_name: "Delhi Chaat Corner", quantity: 75, joined_at: "2024-01-15T11:30:00Z" },
            { vendor_id: "v3", vendor_name: "Bangalore Biryani Hub", quantity: 100, joined_at: "2024-01-15T14:20:00Z" },
          ],
        },
        {
          id: "2",
          product_id: "prod2",
          product_name: "Red Chili Powder",
          product_image: "/placeholder.svg?height=200&width=200&text=Chili+Powder",
          category: "Spices & Condiments",
          unit: "kg",
          target_quantity: 200,
          current_quantity: 145,
          regular_price: 180,
          group_price: 150,
          savings_per_unit: 30,
          end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          participants_count: 8,
          created_by: "vendor2",
          supplier_id: "sup2",
          supplier_name: "Rajasthan Spice Co.",
          supplier_location: "Jodhpur, Rajasthan",
          description: "Authentic Rajasthani red chili powder with perfect heat and color. Limited time group offer!",
          participants: [
            { vendor_id: "v4", vendor_name: "Spicy Street", quantity: 25, joined_at: "2024-01-16T09:00:00Z" },
            { vendor_id: "v5", vendor_name: "Masala Magic", quantity: 40, joined_at: "2024-01-16T12:15:00Z" },
          ],
        },
        {
          id: "3",
          product_id: "prod3",
          product_name: "Fresh Cooking Oil",
          product_image: "/placeholder.svg?height=200&width=200&text=Cooking+Oil",
          category: "Oils & Fats",
          unit: "liter",
          target_quantity: 1000,
          current_quantity: 850,
          regular_price: 140,
          group_price: 115,
          savings_per_unit: 25,
          end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          participants_count: 15,
          created_by: "vendor3",
          supplier_id: "sup3",
          supplier_name: "Gujarat Oil Mills",
          supplier_location: "Ahmedabad, Gujarat",
          description: "Premium refined cooking oil perfect for all frying needs. Almost reached target - join now!",
          participants: [],
        },
      ]

      setGroupOrders(sampleOrders)
    } catch (error) {
      console.error("Error fetching group orders:", error)
      toast({
        title: "Error",
        description: "Failed to load group orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const joinGroupOrder = async (orderId: string, quantity: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to join group orders.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would update the database
      const updatedOrders = groupOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            current_quantity: order.current_quantity + quantity,
            participants_count: order.participants_count + 1,
            participants: [
              ...order.participants,
              {
                vendor_id: user.id,
                vendor_name: "Your Business", // This would come from user profile
                quantity,
                joined_at: new Date().toISOString(),
              },
            ],
          }
        }
        return order
      })

      setGroupOrders(updatedOrders)
      setSelectedOrder(null)
      setJoinQuantity(1)

      toast({
        title: "Successfully Joined!",
        description: `You've joined the group order for ${quantity} units.`,
      })
    } catch (error) {
      console.error("Error joining group order:", error)
      toast({
        title: "Error",
        description: "Failed to join group order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const diff = end - now

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getTotalSavings = (order: GroupOrder, quantity: number) => {
    return order.savings_per_unit * quantity
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Buying</h2>
          <p className="text-gray-600">Join group orders to get wholesale prices and save money</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Group Order
        </Button>
      </div>

      {/* Active Group Orders */}
      <div className="grid gap-6">
        {groupOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Product Image */}
                <div className="lg:w-48 h-48 lg:h-auto">
                  <img
                    src={order.product_image || "/placeholder.svg"}
                    alt={order.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{order.category}</Badge>
                        <Badge
                          className={`${
                            order.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{order.product_name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{order.description}</p>

                      {/* Supplier Info */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="font-medium">{order.supplier_name}</span>
                        <span className="mx-2">•</span>
                        <span>{order.supplier_location}</span>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {order.current_quantity}/{order.target_quantity} {order.unit}
                          </span>
                        </div>
                        <Progress
                          value={getProgressPercentage(order.current_quantity, order.target_quantity)}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                          <span>
                            {getProgressPercentage(order.current_quantity, order.target_quantity).toFixed(0)}% complete
                          </span>
                          <span>{order.participants_count} participants</span>
                        </div>
                      </div>

                      {/* Participants Preview */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex -space-x-2">
                          {order.participants.slice(0, 3).map((participant, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
                                {participant.vendor_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {order.participants.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{order.participants.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">joined this order</span>
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="lg:w-64 lg:text-right">
                      <div className="bg-orange-50 rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-600 mb-1">Group Price</div>
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          ₹{order.group_price}
                          <span className="text-sm font-normal">/{order.unit}</span>
                        </div>
                        <div className="text-sm text-gray-500 line-through">₹{order.regular_price}</div>
                        <div className="text-sm font-medium text-green-600 mt-1">
                          Save ₹{order.savings_per_unit} per {order.unit}
                        </div>
                      </div>

                      <div className="flex items-center justify-center lg:justify-end text-sm text-gray-600 mb-4">
                        <Timer className="w-4 h-4 mr-1" />
                        {getTimeRemaining(order.end_date)}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="bg-orange-500 hover:bg-orange-600"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Join Group Order
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Join Group Order</DialogTitle>
                              <DialogDescription>
                                How many {order.unit}s of {order.product_name} would you like to order?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="quantity">Quantity ({order.unit})</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={joinQuantity}
                                  onChange={(e) => setJoinQuantity(Number.parseInt(e.target.value) || 1)}
                                  className="mt-1"
                                />
                              </div>

                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Unit Price:</span>
                                  <span>₹{order.group_price}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Quantity:</span>
                                  <span>
                                    {joinQuantity} {order.unit}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Total:</span>
                                  <span>₹{order.group_price * joinQuantity}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600 mt-1">
                                  <span>You Save:</span>
                                  <span>₹{getTotalSavings(order, joinQuantity)}</span>
                                </div>
                              </div>

                              <Button
                                onClick={() => joinGroupOrder(order.id, joinQuantity)}
                                className="w-full bg-orange-500 hover:bg-orange-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm & Join
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {groupOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Group Orders</h3>
            <p className="text-gray-600 mb-4">Be the first to create a group order and save money!</p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Group Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle, IndianRupee, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useVendor } from "@/hooks/useVendor"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GroupBuyingSystem } from "@/components/group-buying-system"
import { InventoryManagement } from "@/components/inventory-management"
import { PriceIntelligence } from "@/components/price-intelligence"
import { ChatSystem } from "@/components/chat-system"
import { NotificationSystem } from "@/components/notification-system"

export default function VendorDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { vendor, loading: vendorLoading } = useVendor()
  const [activeTab, setActiveTab] = useState("overview")

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (vendorLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !vendor) {
    router.push("/vendor/login")
    return null
  }

  const stats = [
    {
      title: "Total Orders",
      value: "24",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Monthly Savings",
      value: "₹8,450",
      change: "+23%",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Suppliers",
      value: "12",
      change: "+3",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Inventory Items",
      value: "48",
      change: "+8",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentOrders = [
    {
      id: "1",
      supplier: "Delhi Grain House",
      product: "Basmati Rice",
      quantity: "50 kg",
      amount: "₹4,750",
      status: "delivered",
      date: "2024-01-14",
    },
    {
      id: "2",
      supplier: "Mumbai Fresh Mart",
      product: "Fresh Tomatoes",
      quantity: "30 kg",
      amount: "₹1,350",
      status: "processing",
      date: "2024-01-15",
    },
    {
      id: "3",
      supplier: "Rajasthan Spice Co.",
      product: "Red Chili Powder",
      quantity: "15 kg",
      amount: "₹2,700",
      status: "shipped",
      date: "2024-01-15",
    },
  ]

  const lowStockItems = [
    { name: "Red Chili Powder", current: "8 kg", threshold: "10 kg", urgency: "high" },
    { name: "Fresh Paneer", current: "12 kg", threshold: "15 kg", urgency: "medium" },
    { name: "Cooking Oil", current: "25 L", threshold: "30 L", urgency: "low" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VendorConnect</span>
              <Badge className="bg-blue-100 text-blue-800 ml-2">Vendor</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/vendor/products">
                <Button variant="ghost" size="sm">
                  Products
                </Button>
              </Link>
              <Link href="/vendor/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <NotificationSystem currentUserId={user.id} />
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {vendor.business_name || vendor.owner_name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your business today.</p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="group-buying">Group Buying</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="price-intelligence">Price Intelligence</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchase orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{order.product}</h4>
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.supplier}</p>
                          <p className="text-xs text-gray-500">
                            {order.quantity} • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/vendor/orders">
                      <Button variant="outline" className="w-full bg-transparent">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>Items that need restocking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Current: {item.current} | Min: {item.threshold}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getUrgencyColor(item.urgency)}`}>
                            {item.urgency.toUpperCase()}
                          </p>
                          <Button size="sm" className="mt-1 bg-orange-500 hover:bg-orange-600">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setActiveTab("inventory")}
                    >
                      Manage Inventory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to help you manage your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="h-20 flex-col bg-blue-500 hover:bg-blue-600"
                    onClick={() => setActiveTab("group-buying")}
                  >
                    <Users className="w-6 h-6 mb-2" />
                    Join Group Orders
                  </Button>
                  <Link href="/vendor/products">
                    <Button className="h-20 flex-col w-full bg-green-500 hover:bg-green-600">
                      <ShoppingCart className="w-6 h-6 mb-2" />
                      Browse Products
                    </Button>
                  </Link>
                  <Button
                    className="h-20 flex-col bg-purple-500 hover:bg-purple-600"
                    onClick={() => setActiveTab("price-intelligence")}
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    Check Prices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group-buying">
            <GroupBuyingSystem />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="price-intelligence">
            <PriceIntelligence />
          </TabsContent>
        </Tabs>
      </div>

      <ChatSystem currentUserId={user.id} currentUserType="vendor" />
    </div>
  )
}

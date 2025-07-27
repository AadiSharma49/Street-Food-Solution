"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Eye,
  Bell,
  User,
  LogOut,
  Star,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function SupplierDashboard() {
  // Mock data
  const stats = [
    { icon: ShoppingCart, label: "Pending Orders", value: "23", color: "text-orange-500" },
    { icon: Package, label: "Total Orders", value: "1,247", color: "text-green-500" },
    { icon: TrendingUp, label: "Monthly Revenue", value: "₹2,45,000", color: "text-blue-500" },
    { icon: Users, label: "Active Vendors", value: "156", color: "text-purple-500" },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      vendor: "Raj's Chaat Corner",
      items: "Onions (25kg), Tomatoes (20kg)",
      amount: "₹1,250",
      status: "Processing",
      date: "2025-01-27",
      location: "Connaught Place, Delhi",
    },
    {
      id: "ORD-002",
      vendor: "Mumbai Dosa Stall",
      items: "Rice (50kg), Urad Dal (10kg)",
      amount: "₹3,200",
      status: "Shipped",
      date: "2025-01-26",
      location: "Dadar, Mumbai",
    },
    {
      id: "ORD-003",
      vendor: "Spice Junction",
      items: "Red Chili Powder (15kg)",
      amount: "₹2,100",
      status: "Delivered",
      date: "2025-01-25",
      location: "Karol Bagh, Delhi",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Fresh Red Onions",
      category: "Vegetables",
      price: "₹25/kg",
      stock: "500kg",
      status: "Active",
      orders: 45,
    },
    {
      id: 2,
      name: "Premium Basmati Rice",
      category: "Grains",
      price: "₹85/kg",
      stock: "200kg",
      status: "Low Stock",
      orders: 23,
    },
    {
      id: 3,
      name: "Sunflower Oil",
      category: "Oils",
      price: "₹140/L",
      stock: "150L",
      status: "Active",
      orders: 67,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Active":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <Badge className="bg-blue-100 text-blue-800 ml-2">Supplier</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Fresh Vegetables Co.!</h1>
          <p className="text-gray-600">Manage your orders and grow your business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage incoming orders from vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{order.vendor}</p>
                        <p className="text-sm text-gray-500 mb-1">{order.items}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{order.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                        <Button size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Product Catalog</CardTitle>
                      <CardDescription>Manage your product listings</CardDescription>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <Badge variant="outline">{product.category}</Badge>
                            <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Price: {product.price}</span>
                            <span>Stock: {product.stock}</span>
                            <span>Orders: {product.orders}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Connected Vendors</CardTitle>
                <CardDescription>Vendors who regularly order from you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-orange-600">RC</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Raj's Chaat Corner</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>4.8</span>
                          </div>
                          <span>45 orders</span>
                          <span>₹25,600 total</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">View Profile</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-blue-600">MD</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Mumbai Dosa Stall</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>4.9</span>
                          </div>
                          <span>32 orders</span>
                          <span>₹18,900 total</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">View Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Analytics</CardTitle>
                  <CardDescription>Track your performance and growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard Coming Soon</h3>
                    <p className="text-gray-600 mb-4">
                      We're building comprehensive analytics to help you track sales, vendor relationships, and business
                      growth.
                    </p>
                    <Button variant="outline">Get Notified</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

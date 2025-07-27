"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Plus,
  Bell,
  User,
  LogOut,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useVendor } from "@/hooks/useVendor"
import { supabase, type Supplier, type Order, type GroupOrder } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function VendorDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { vendor, loading: vendorLoading } = useVendor()
  const [searchQuery, setSearchQuery] = useState("")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && vendor) {
      fetchData()
    }
  }, [user, vendor])

  const fetchData = async () => {
    try {
      // Fetch suppliers
      const { data: suppliersData } = await supabase
        .from("suppliers")
        .select("*")
        .eq("verified", true)
        .order("rating", { ascending: false })

      // Fetch vendor's orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          suppliers (company_name)
        `)
        .eq("vendor_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10)

      // Fetch active group orders
      const { data: groupOrdersData } = await supabase
        .from("group_orders")
        .select(`
          *,
          products (name, unit)
        `)
        .eq("status", "active")
        .order("end_date", { ascending: true })

      setSuppliers(suppliersData || [])
      setOrders(ordersData || [])
      setGroupOrders(groupOrdersData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (vendorLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user || !vendor) {
    router.push("/vendor/login")
    return null
  }

  const stats = [
    {
      icon: ShoppingCart,
      label: "Active Orders",
      value: orders
        .filter((o) => ["pending", "confirmed", "processing", "shipped"].includes(o.status))
        .length.toString(),
      color: "text-blue-500",
    },
    { icon: Package, label: "Total Orders", value: orders.length.toString(), color: "text-green-500" },
    { icon: TrendingUp, label: "Monthly Savings", value: "₹8,450", color: "text-orange-500" },
    { icon: Users, label: "Trusted Suppliers", value: suppliers.length.toString(), color: "text-purple-500" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {vendor.business_name}!</h1>
          <p className="text-gray-600">Manage your orders and discover new suppliers</p>
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
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="suppliers">Find Suppliers</TabsTrigger>
            <TabsTrigger value="group-orders">Group Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Track your recent purchases and deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet. Start by browsing suppliers!</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{order.id.slice(0, 8)}</span>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{(order as any).suppliers?.company_name}</p>
                          <p className="text-sm text-gray-500">{order.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total_amount}</p>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search suppliers, products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Suppliers List */}
              <div className="grid gap-6">
                {filteredSuppliers.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No suppliers found. Try adjusting your search.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <Card key={supplier.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{supplier.company_name}</h3>
                              {supplier.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{supplier.rating || "New"}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {supplier.city}, {supplier.state}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{supplier.delivery_radius}km radius</span>
                              </div>
                            </div>
                          </div>
                          <Button className="bg-orange-500 hover:bg-orange-600">View Products</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Categories:</span>
                            <span className="ml-2 font-medium">{supplier.categories.slice(0, 2).join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Min Order:</span>
                            <span className="ml-2 font-medium">₹{supplier.min_order_value}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Group Orders Tab */}
          <TabsContent value="group-orders">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Group Orders</CardTitle>
                  <CardDescription>Join group orders to get better prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {groupOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No active group orders at the moment.</p>
                      </div>
                    ) : (
                      groupOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{(order as any).products?.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{order.participants.length} vendors joined</span>
                                <span>Ends: {new Date(order.end_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Save ₹{order.normal_price - order.price_per_unit}/{(order as any).products?.unit}
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>
                                Progress: {order.current_quantity} / {order.target_quantity}
                              </span>
                              <span>{Math.round((order.current_quantity / order.target_quantity) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min((order.current_quantity / order.target_quantity) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-gray-600">Group Price: </span>
                              <span className="font-semibold text-green-600">₹{order.price_per_unit}</span>
                              <span className="text-gray-500 line-through ml-2">₹{order.normal_price}</span>
                            </div>
                            <Button className="bg-orange-500 hover:bg-orange-600">
                              <Plus className="w-4 h-4 mr-2" />
                              Join Order
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Track your stock levels and get reorder alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory Tracking Coming Soon</h3>
                  <p className="text-gray-600 mb-4">
                    We're building smart inventory management to help you track stock levels and automate reorders.
                  </p>
                  <Button variant="outline">Get Notified</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

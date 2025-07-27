"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, Plus, Edit, BarChart3, Bell, ShoppingCart, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: string
  product_name: string
  category: string
  current_stock: number
  unit: string
  min_threshold: number
  max_capacity: number
  cost_per_unit: number
  total_value: number
  last_restocked: string
  supplier_name: string
  supplier_id: string
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstocked"
  usage_rate: number // units per day
  estimated_days_left: number
  reorder_point: number
  image_url?: string
}

interface StockAlert {
  id: string
  item_id: string
  item_name: string
  alert_type: "low_stock" | "out_of_stock" | "reorder_due" | "expiry_warning"
  message: string
  severity: "low" | "medium" | "high" | "critical"
  created_at: string
}

export function InventoryManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const categories = [
    "Vegetables",
    "Spices & Condiments",
    "Grains & Cereals",
    "Dairy Products",
    "Oils & Fats",
    "Meat & Poultry",
    "Fruits",
  ]

  const statusOptions = [
    { value: "all", label: "All Items" },
    { value: "in_stock", label: "In Stock", color: "bg-green-100 text-green-800" },
    { value: "low_stock", label: "Low Stock", color: "bg-yellow-100 text-yellow-800" },
    { value: "out_of_stock", label: "Out of Stock", color: "bg-red-100 text-red-800" },
    { value: "overstocked", label: "Overstocked", color: "bg-blue-100 text-blue-800" },
  ]

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      // Sample inventory data
      const sampleInventory: InventoryItem[] = [
        {
          id: "1",
          product_name: "Basmati Rice",
          category: "Grains & Cereals",
          current_stock: 45,
          unit: "kg",
          min_threshold: 20,
          max_capacity: 200,
          cost_per_unit: 95,
          total_value: 4275,
          last_restocked: "2024-01-10T00:00:00Z",
          supplier_name: "Delhi Grain House",
          supplier_id: "sup1",
          status: "in_stock",
          usage_rate: 8,
          estimated_days_left: 6,
          reorder_point: 25,
          image_url: "/placeholder.svg?height=100&width=100&text=Rice",
        },
        {
          id: "2",
          product_name: "Red Chili Powder",
          category: "Spices & Condiments",
          current_stock: 8,
          unit: "kg",
          min_threshold: 10,
          max_capacity: 50,
          cost_per_unit: 150,
          total_value: 1200,
          last_restocked: "2024-01-05T00:00:00Z",
          supplier_name: "Rajasthan Spice Co.",
          supplier_id: "sup2",
          status: "low_stock",
          usage_rate: 2,
          estimated_days_left: 4,
          reorder_point: 12,
          image_url: "/placeholder.svg?height=100&width=100&text=Chili",
        },
        {
          id: "3",
          product_name: "Fresh Tomatoes",
          category: "Vegetables",
          current_stock: 0,
          unit: "kg",
          min_threshold: 15,
          max_capacity: 100,
          cost_per_unit: 45,
          total_value: 0,
          last_restocked: "2024-01-08T00:00:00Z",
          supplier_name: "Mumbai Fresh Mart",
          supplier_id: "sup3",
          status: "out_of_stock",
          usage_rate: 12,
          estimated_days_left: 0,
          reorder_point: 20,
          image_url: "/placeholder.svg?height=100&width=100&text=Tomatoes",
        },
        {
          id: "4",
          product_name: "Cooking Oil",
          category: "Oils & Fats",
          current_stock: 85,
          unit: "liter",
          min_threshold: 25,
          max_capacity: 80,
          cost_per_unit: 115,
          total_value: 9775,
          last_restocked: "2024-01-12T00:00:00Z",
          supplier_name: "Gujarat Oil Mills",
          supplier_id: "sup4",
          status: "overstocked",
          usage_rate: 5,
          estimated_days_left: 17,
          reorder_point: 30,
          image_url: "/placeholder.svg?height=100&width=100&text=Oil",
        },
        {
          id: "5",
          product_name: "Fresh Paneer",
          category: "Dairy Products",
          current_stock: 12,
          unit: "kg",
          min_threshold: 8,
          max_capacity: 40,
          cost_per_unit: 280,
          total_value: 3360,
          last_restocked: "2024-01-14T00:00:00Z",
          supplier_name: "Punjab Dairy Farm",
          supplier_id: "sup5",
          status: "in_stock",
          usage_rate: 3,
          estimated_days_left: 4,
          reorder_point: 10,
          image_url: "/placeholder.svg?height=100&width=100&text=Paneer",
        },
      ]

      const sampleAlerts: StockAlert[] = [
        {
          id: "1",
          item_id: "3",
          item_name: "Fresh Tomatoes",
          alert_type: "out_of_stock",
          message: "Fresh Tomatoes are completely out of stock. Reorder immediately!",
          severity: "critical",
          created_at: "2024-01-15T08:00:00Z",
        },
        {
          id: "2",
          item_id: "2",
          item_name: "Red Chili Powder",
          alert_type: "low_stock",
          message: "Red Chili Powder is running low. Only 8 kg remaining.",
          severity: "high",
          created_at: "2024-01-15T09:30:00Z",
        },
        {
          id: "3",
          item_id: "5",
          item_name: "Fresh Paneer",
          alert_type: "reorder_due",
          message: "Fresh Paneer will run out in 4 days. Consider reordering soon.",
          severity: "medium",
          created_at: "2024-01-15T10:15:00Z",
        },
      ]

      setInventory(sampleInventory)
      setAlerts(sampleAlerts)
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast({
        title: "Error",
        description: "Failed to load inventory data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status)
    return option?.color || "bg-gray-100 text-gray-800"
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => total + item.total_value, 0)
  }

  const getCriticalItems = () => {
    return inventory.filter((item) => item.status === "out_of_stock" || item.status === "low_stock").length
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Track your stock levels and manage reorders efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInventoryData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Items</p>
                <p className="text-2xl font-bold text-red-600">{getCriticalItems()}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">₹{getTotalInventoryValue().toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{alerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Items that need your immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.alert_type.replace("_", " ").toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{alert.item_name}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{item.product_name}</h3>
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge className={getStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Supplier: {item.supplier_name}</p>
                    <p className="text-sm text-gray-500">
                      Last restocked: {new Date(item.last_restocked).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stock Level */}
                <div className="lg:w-48">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Stock Level</span>
                    <span className="font-medium">
                      {item.current_stock}/{item.max_capacity} {item.unit}
                    </span>
                  </div>
                  <Progress value={getStockPercentage(item.current_stock, item.max_capacity)} className="h-2 mb-1" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {item.min_threshold}</span>
                    <span>{getStockPercentage(item.current_stock, item.max_capacity).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Usage & Value */}
                <div className="lg:w-40 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Usage Rate:</span>
                    <span>
                      {item.usage_rate} {item.unit}/day
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Days Left:</span>
                    <span className={item.estimated_days_left <= 3 ? "text-red-600 font-medium" : ""}>
                      {item.estimated_days_left} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">₹{item.total_value.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={item.status === "overstocked"}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Reorder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600 mb-4">
              {inventory.length === 0
                ? "Start by adding your first inventory item."
                : "Try adjusting your filters to see more items."}
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Inventory Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

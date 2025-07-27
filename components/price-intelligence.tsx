"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  MapPin,
  Star,
  Filter,
  RefreshCw,
  Bell,
  Target,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PriceData {
  id: string
  product_name: string
  category: string
  unit: string
  current_price: number
  previous_price: number
  price_change: number
  price_change_percentage: number
  trend: "up" | "down" | "stable"
  suppliers: Array<{
    id: string
    name: string
    location: string
    price: number
    rating: number
    verified: boolean
    delivery_time: string
    min_order: number
  }>
  price_history: Array<{
    date: string
    price: number
    supplier_count: number
  }>
  market_insights: {
    seasonal_trend: "peak" | "off_peak" | "normal"
    demand_level: "high" | "medium" | "low"
    supply_status: "abundant" | "normal" | "scarce"
    price_forecast: "increase" | "decrease" | "stable"
    best_time_to_buy: string
  }
}

interface MarketAlert {
  id: string
  product_name: string
  alert_type: "price_drop" | "price_spike" | "seasonal_low" | "supply_shortage"
  message: string
  severity: "low" | "medium" | "high"
  created_at: string
  action_recommended: string
}

export function PriceIntelligence() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<PriceData | null>(null)

  const categories = [
    "Vegetables",
    "Spices & Condiments",
    "Grains & Cereals",
    "Dairy Products",
    "Oils & Fats",
    "Meat & Poultry",
    "Fruits",
  ]

  useEffect(() => {
    fetchPriceData()
  }, [])

  const fetchPriceData = async () => {
    try {
      // Sample price intelligence data
      const sampleData: PriceData[] = [
        {
          id: "1",
          product_name: "Basmati Rice",
          category: "Grains & Cereals",
          unit: "kg",
          current_price: 95,
          previous_price: 105,
          price_change: -10,
          price_change_percentage: -9.5,
          trend: "down",
          suppliers: [
            {
              id: "s1",
              name: "Delhi Grain House",
              location: "Delhi",
              price: 95,
              rating: 4.7,
              verified: true,
              delivery_time: "2-3 days",
              min_order: 50,
            },
            {
              id: "s2",
              name: "Punjab Rice Mills",
              location: "Punjab",
              price: 98,
              rating: 4.5,
              verified: true,
              delivery_time: "3-4 days",
              min_order: 100,
            },
            {
              id: "s3",
              name: "Haryana Grains",
              location: "Haryana",
              price: 102,
              rating: 4.3,
              verified: false,
              delivery_time: "4-5 days",
              min_order: 25,
            },
          ],
          price_history: [
            { date: "2024-01-01", price: 110, supplier_count: 8 },
            { date: "2024-01-05", price: 108, supplier_count: 9 },
            { date: "2024-01-10", price: 105, supplier_count: 10 },
            { date: "2024-01-15", price: 95, supplier_count: 12 },
          ],
          market_insights: {
            seasonal_trend: "off_peak",
            demand_level: "medium",
            supply_status: "abundant",
            price_forecast: "stable",
            best_time_to_buy: "Now - prices are at seasonal low",
          },
        },
        {
          id: "2",
          product_name: "Red Chili Powder",
          category: "Spices & Condiments",
          unit: "kg",
          current_price: 180,
          previous_price: 165,
          price_change: 15,
          price_change_percentage: 9.1,
          trend: "up",
          suppliers: [
            {
              id: "s4",
              name: "Rajasthan Spice Co.",
              location: "Rajasthan",
              price: 180,
              rating: 4.9,
              verified: true,
              delivery_time: "2-3 days",
              min_order: 20,
            },
            {
              id: "s5",
              name: "Andhra Spices",
              location: "Andhra Pradesh",
              price: 175,
              rating: 4.6,
              verified: true,
              delivery_time: "3-4 days",
              min_order: 15,
            },
            {
              id: "s6",
              name: "Karnataka Masala",
              location: "Karnataka",
              price: 185,
              rating: 4.4,
              verified: true,
              delivery_time: "4-5 days",
              min_order: 10,
            },
          ],
          price_history: [
            { date: "2024-01-01", price: 160, supplier_count: 6 },
            { date: "2024-01-05", price: 162, supplier_count: 6 },
            { date: "2024-01-10", price: 165, supplier_count: 7 },
            { date: "2024-01-15", price: 180, supplier_count: 8 },
          ],
          market_insights: {
            seasonal_trend: "peak",
            demand_level: "high",
            supply_status: "normal",
            price_forecast: "increase",
            best_time_to_buy: "Wait 2-3 weeks - prices may stabilize",
          },
        },
        {
          id: "3",
          product_name: "Fresh Tomatoes",
          category: "Vegetables",
          unit: "kg",
          current_price: 45,
          previous_price: 45,
          price_change: 0,
          price_change_percentage: 0,
          trend: "stable",
          suppliers: [
            {
              id: "s7",
              name: "Mumbai Fresh Mart",
              location: "Mumbai",
              price: 45,
              rating: 4.8,
              verified: true,
              delivery_time: "1-2 days",
              min_order: 30,
            },
            {
              id: "s8",
              name: "Pune Vegetables",
              location: "Pune",
              price: 42,
              rating: 4.5,
              verified: true,
              delivery_time: "2-3 days",
              min_order: 50,
            },
            {
              id: "s9",
              name: "Nashik Farms",
              location: "Nashik",
              price: 48,
              rating: 4.7,
              verified: true,
              delivery_time: "2-3 days",
              min_order: 25,
            },
          ],
          price_history: [
            { date: "2024-01-01", price: 50, supplier_count: 12 },
            { date: "2024-01-05", price: 48, supplier_count: 14 },
            { date: "2024-01-10", price: 46, supplier_count: 15 },
            { date: "2024-01-15", price: 45, supplier_count: 16 },
          ],
          market_insights: {
            seasonal_trend: "normal",
            demand_level: "high",
            supply_status: "abundant",
            price_forecast: "stable",
            best_time_to_buy: "Anytime - stable pricing expected",
          },
        },
      ]

      const sampleAlerts: MarketAlert[] = [
        {
          id: "1",
          product_name: "Basmati Rice",
          alert_type: "price_drop",
          message: "Basmati Rice prices dropped by 9.5% - great time to stock up!",
          severity: "medium",
          created_at: "2024-01-15T10:00:00Z",
          action_recommended: "Consider bulk purchase to lock in low prices",
        },
        {
          id: "2",
          product_name: "Red Chili Powder",
          alert_type: "price_spike",
          message: "Red Chili Powder prices increased by 9.1% due to seasonal demand",
          severity: "high",
          created_at: "2024-01-15T11:30:00Z",
          action_recommended: "Wait 2-3 weeks for prices to stabilize or find alternative suppliers",
        },
      ]

      setPriceData(sampleData)
      setMarketAlerts(sampleAlerts)
    } catch (error) {
      console.error("Error fetching price data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-green-500" />
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-red-600"
    if (trend === "down") return "text-green-600"
    return "text-gray-600"
  }

  const getInsightColor = (insight: string) => {
    switch (insight) {
      case "peak":
      case "high":
      case "scarce":
      case "increase":
        return "text-red-600"
      case "off_peak":
      case "low":
      case "abundant":
      case "decrease":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredData = priceData.filter((item) => selectedCategory === "all" || item.category === selectedCategory)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <h2 className="text-2xl font-bold text-gray-900">Price Intelligence</h2>
          <p className="text-gray-600">Track market prices and get smart buying recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPriceData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Bell className="w-4 h-4 mr-2" />
            Set Price Alerts
          </Button>
        </div>
      </div>

      {/* Market Alerts */}
      {marketAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              Market Alerts
            </CardTitle>
            <CardDescription>Important price movements and market opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.alert_type.replace("_", " ").toUpperCase()}
                        </Badge>
                        <span className="font-medium">{alert.product_name}</span>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <p className="text-xs text-gray-600">
                        <strong>Recommended Action:</strong> {alert.action_recommended}
                      </p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Target className="w-4 h-4 mr-1" />
                      Act Now
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
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedProduct(item)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.product_name}</CardTitle>
                {getTrendIcon(item.trend, item.price_change)}
              </div>
              <Badge variant="outline" className="w-fit">
                {item.category}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">₹{item.current_price}</span>
                  <span className="text-sm text-gray-500">per {item.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                    {item.price_change > 0 ? "+" : ""}
                    {item.price_change_percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Suppliers:</span>
                    <span className="ml-1 font-medium">{item.suppliers.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Best Price:</span>
                    <span className="ml-1 font-medium">₹{Math.min(...item.suppliers.map((s) => s.price))}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Market Status:</span>
                    <span className={`font-medium ${getInsightColor(item.market_insights.supply_status)}`}>
                      {item.market_insights.supply_status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.market_insights.best_time_to_buy}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedProduct && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{selectedProduct.product_name} - Detailed Analysis</CardTitle>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="price-history" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="price-history">Price History</TabsTrigger>
                <TabsTrigger value="suppliers">Supplier Comparison</TabsTrigger>
                <TabsTrigger value="insights">Market Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="price-history" className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedProduct.price_history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="suppliers" className="space-y-4">
                <div className="grid gap-4">
                  {selectedProduct.suppliers.map((supplier) => (
                    <Card key={supplier.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-medium">{supplier.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{supplier.location}</span>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="ml-1">{supplier.rating}</span>
                                </div>
                                {supplier.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₹{supplier.price}</div>
                            <div className="text-sm text-gray-500">per {selectedProduct.unit}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Min order: {supplier.min_order} {selectedProduct.unit}
                            </div>
                            <div className="text-xs text-gray-500">Delivery: {supplier.delivery_time}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Market Conditions</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seasonal Trend:</span>
                          <span
                            className={`font-medium ${getInsightColor(selectedProduct.market_insights.seasonal_trend)}`}
                          >
                            {selectedProduct.market_insights.seasonal_trend.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Demand Level:</span>
                          <span
                            className={`font-medium ${getInsightColor(selectedProduct.market_insights.demand_level)}`}
                          >
                            {selectedProduct.market_insights.demand_level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supply Status:</span>
                          <span
                            className={`font-medium ${getInsightColor(selectedProduct.market_insights.supply_status)}`}
                          >
                            {selectedProduct.market_insights.supply_status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Price Forecast</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Trend:</span>
                          <span
                            className={`font-medium ${getInsightColor(selectedProduct.market_insights.price_forecast)}`}
                          >
                            {selectedProduct.market_insights.price_forecast}
                          </span>
                        </div>
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                          <div className="text-sm font-medium text-orange-800 mb-1">Buying Recommendation</div>
                          <div className="text-sm text-orange-700">
                            {selectedProduct.market_insights.best_time_to_buy}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No price data available</h3>
            <p className="text-gray-600 mb-4">Try selecting a different category or refresh the data.</p>
            <Button onClick={fetchPriceData} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

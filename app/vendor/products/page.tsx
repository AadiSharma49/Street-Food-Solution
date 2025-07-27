"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, Search, ShoppingCart, Plus, Minus, LogOut, Loader2, Star, MapPin, Heart, Share2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useVendor } from "@/hooks/useVendor"
import { supabase, type Product, type Supplier } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ChatSystem } from "@/components/chat-system"
import { NotificationSystem } from "@/components/notification-system"

const categories = [
  "Vegetables",
  "Fruits",
  "Grains & Cereals",
  "Spices & Condiments",
  "Dairy Products",
  "Oils & Fats",
  "Pulses & Legumes",
  "Meat & Poultry",
  "Seafood",
  "Beverages",
]

interface ProductWithSupplier extends Product {
  suppliers: Supplier
}

interface CartItem {
  product: ProductWithSupplier
  quantity: number
}

export default function VendorProducts() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { vendor, loading: vendorLoading } = useVendor()
  const { toast } = useToast()

  const [products, setProducts] = useState<ProductWithSupplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductWithSupplier | null>(null)
  const [showProductDialog, setShowProductDialog] = useState(false)

  useEffect(() => {
    if (user && vendor) {
      fetchProducts()
    }
  }, [user, vendor])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          suppliers (
            id,
            company_name,
            city,
            state,
            rating,
            verified,
            delivery_radius,
            min_order_value
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const addToCart = (product: ProductWithSupplier, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { product, quantity }]
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
    } else {
      setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const getCartQuantity = (productId: string) => {
    const item = cart.find((item) => item.product.id === productId)
    return item?.quantity || 0
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
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

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.suppliers.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price
        case "price_high":
          return b.price - a.price
        case "rating":
          return (b.suppliers.rating || 0) - (a.suppliers.rating || 0)
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

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
              <Link href="/vendor/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/vendor/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
              <NotificationSystem />
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Catalog</h1>
              <p className="text-gray-600">Discover products from verified suppliers</p>
            </div>
            {cart.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cart Total: ₹{getCartTotal().toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{getCartItemsCount()} items</p>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">Checkout</Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products, suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Supplier Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={
                      product.image_url ||
                      `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800">{product.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description || "No description available"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-600">/{product.unit}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Min: {product.min_order_quantity} {product.unit}
                    </Badge>
                  </div>

                  <div className="mb-3 pb-3 border-b">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Supplier:</span>
                      <span className="font-medium">{product.suppliers.company_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span>{product.suppliers.rating || "New"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{product.suppliers.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getCartQuantity(product.id) > 0 ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(product.id, getCartQuantity(product.id) - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium min-w-[2rem] text-center">{getCartQuantity(product.id)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(product.id, getCartQuantity(product.id) + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(product, product.min_order_quantity)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                    <Dialog
                      open={showProductDialog && selectedProduct?.id === product.id}
                      onOpenChange={setShowProductDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedProduct?.name}</DialogTitle>
                          <DialogDescription>Product details and supplier information</DialogDescription>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <img
                                src={
                                  selectedProduct.image_url ||
                                  `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(selectedProduct.name) || "/placeholder.svg"}`
                                }
                                alt={selectedProduct.name}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-2">{selectedProduct.name}</h3>
                                <Badge className="mb-2">{selectedProduct.category}</Badge>
                                <p className="text-gray-600">{selectedProduct.description}</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Price:</span>
                                  <span className="font-semibold">
                                    ₹{selectedProduct.price}/{selectedProduct.unit}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Min Order:</span>
                                  <span>
                                    {selectedProduct.min_order_quantity} {selectedProduct.unit}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Stock:</span>
                                  <span>
                                    {selectedProduct.stock_quantity} {selectedProduct.unit}
                                  </span>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Supplier Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Company:</span>
                                    <span>{selectedProduct.suppliers.company_name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Location:</span>
                                    <span>
                                      {selectedProduct.suppliers.city}, {selectedProduct.suppliers.state}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Rating:</span>
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                      <span>{selectedProduct.suppliers.rating || "New"}</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Min Order Value:</span>
                                    <span>₹{selectedProduct.suppliers.min_order_value}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => addToCart(selectedProduct, selectedProduct.min_order_quantity)}
                                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ChatSystem />
    </div>
  )
}

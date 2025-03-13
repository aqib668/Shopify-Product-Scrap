import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, ArrowLeft, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getShopifyConnection } from "@/lib/supabase"

// In a real app, this would fetch from your API route that connects to Shopify
async function getProduct(id: string) {
  // Mock data for demonstration
  const products = {
    "1": {
      id: "1",
      title: "Classic T-Shirt",
      description:
        "A comfortable cotton t-shirt for everyday wear. Made from 100% organic cotton, this t-shirt is both sustainable and comfortable. The classic fit makes it perfect for everyday wear, while the durable fabric ensures it will last through countless washes.",
      price: "$29.99",
      images: [
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
      ],
      collection: "Apparel",
      inventory: 42,
      variants: ["Small", "Medium", "Large", "X-Large"],
      colors: ["Black", "White", "Navy", "Gray"],
      details: {
        material: "100% Organic Cotton",
        care: "Machine wash cold, tumble dry low",
        shipping: "Free shipping on orders over $50",
        returns: "30-day return policy",
      },
    },
    "2": {
      id: "2",
      title: "Leather Wallet",
      description:
        "Handcrafted genuine leather wallet with multiple card slots. This premium wallet features 8 card slots, 2 bill compartments, and an ID window. The slim design fits comfortably in your pocket while still providing ample storage for all your essentials.",
      price: "$49.99",
      images: [
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
      ],
      collection: "Accessories",
      inventory: 15,
      variants: ["Standard"],
      colors: ["Brown", "Black"],
      details: {
        material: "Genuine Leather",
        care: "Wipe clean with a damp cloth",
        shipping: "Free shipping on orders over $50",
        returns: "30-day return policy",
      },
    },
  }

  return products[id as keyof typeof products]
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  let hasConnection = false
  let connectionError = false

  try {
    const connection = await getShopifyConnection()
    hasConnection = !!connection
  } catch (error) {
    console.error("Error checking Shopify connection:", error)
    connectionError = true
  }

  if (!product) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      {connectionError && (
        <div className="mb-6 p-4 border rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Database Connection Error</p>
            <p className="text-sm">
              There was an error connecting to the database. Please check your environment variables.
            </p>
          </div>
        </div>
      )}

      {!connectionError && !hasConnection && (
        <div className="mb-6 p-4 border rounded-md bg-amber-50 text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Shopify not connected</p>
            <p className="text-sm">Connect your Shopify store to enable cart functionality.</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto" asChild>
            <Link href="/settings">Connect Now</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-md border cursor-pointer">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} - Image ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <Badge>{product.collection}</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{product.price}</p>
            <p className="text-sm text-muted-foreground mt-1">{product.inventory} in stock</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Size</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.variants.map((variant) => (
                  <Button key={variant} variant="outline" size="sm">
                    {variant}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.colors.map((color) => (
                  <Button key={color} variant="outline" size="sm">
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {hasConnection ? (
              <>
                <Button className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button className="flex-1" asChild>
                <Link href="/settings">Connect Shopify to Enable Shopping</Link>
              </Button>
            )}
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-2 mt-4">
              <h3 className="font-medium">Material</h3>
              <p className="text-sm text-muted-foreground">{product.details.material}</p>
              <h3 className="font-medium">Care Instructions</h3>
              <p className="text-sm text-muted-foreground">{product.details.care}</p>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">{product.details.shipping}</p>
            </TabsContent>
            <TabsContent value="returns" className="space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">{product.details.returns}</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}


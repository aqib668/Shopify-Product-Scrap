"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart, AlertCircle, Database } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title: string
  description: string
  price: string
  image: string
  collection: string
  inventory: number
}

export function ShopifyProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasConnection, setHasConnection] = useState(false)
  const [setupNeeded, setSetupNeeded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // First check if we have a connection
        const connectionResponse = await fetch("/api/shopify/connection")

        if (!connectionResponse.ok) {
          // Check if this is a setup issue
          if (connectionResponse.status === 503) {
            setSetupNeeded(true)
            setLoading(false)
            return
          }

          throw new Error(`Error checking connection: ${connectionResponse.status}`)
        }

        const connectionData = await connectionResponse.json()
        setHasConnection(!!connectionData.connection)

        if (!connectionData.connection) {
          setLoading(false)
          return
        }

        const response = await fetch("/api/shopify/products")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data.products)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch products:", err)

        // Check if this is a database setup issue
        if (err instanceof Error && (err.message.includes("relation") || err.message.includes("does not exist"))) {
          setSetupNeeded(true)
        } else {
          setError("Failed to load products. Please check your Shopify connection.")
        }

        setHasConnection(false)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleInitializeDatabase = async () => {
    try {
      setIsInitializing(true)

      // Call the setup API
      const response = await fetch("/api/setup")

      if (!response.ok) {
        throw new Error(`Setup failed: ${response.status}`)
      }

      // Reload the page after successful setup
      window.location.reload()
    } catch (err) {
      console.error("Failed to initialize database:", err)
      setError("Failed to initialize database. Please try again.")
    } finally {
      setIsInitializing(false)
    }
  }

  if (setupNeeded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/40">
        <Database className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Database Setup Required</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          The database tables need to be set up before you can use this application.
        </p>
        <Button onClick={handleInitializeDatabase} disabled={isInitializing}>
          {isInitializing ? "Initializing..." : "Initialize Database"}
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full rounded-none" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!hasConnection) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/40">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Shopify Connection</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          You need to connect your Shopify store before you can view and manage products.
        </p>
        <Button asChild>
          <Link href="/settings">Connect Shopify Store</Link>
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center border rounded-lg">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <div className="mb-4 text-destructive font-medium">{error}</div>
        <Button asChild>
          <Link href="/settings">Configure Shopify Connection</Link>
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg">
        <p className="mb-4">No products found in your Shopify store.</p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/settings">Check Shopify Connection</Link>
          </Button>
          <Button asChild>
            <a href="https://admin.shopify.com/products" target="_blank" rel="noopener noreferrer">
              Add Products in Shopify
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden flex flex-col">
          <CardHeader className="p-0 relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={400}
              height={200}
              className="h-48 w-full object-cover"
            />
            <Badge className="absolute top-2 right-2">{product.collection}</Badge>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
            <p className="text-muted-foreground text-sm mb-2">
              {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-lg">{product.price}</span>
              <span className="text-sm text-muted-foreground">{product.inventory} in stock</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            {hasConnection && (
              <Button size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


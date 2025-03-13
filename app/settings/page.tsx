"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { getShopifyConnection } from "@/lib/shopify-connection"

export default function SettingsPage() {
  const [storeUrl, setStoreUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // In a real app, this would validate and store the credentials
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Validate inputs
      if (!storeUrl || !apiKey || !apiSecret || !accessToken) {
        throw new Error("All fields are required")
      }

      if (!storeUrl.includes(".myshopify.com")) {
        throw new Error("Store URL must be a valid Shopify store URL")
      }

      // Success
      setIsConnected(true)
      // In a real app, you would store these credentials securely in your database
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to Shopify")
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function loadConnection() {
      try {
        const connection = await getShopifyConnection()
        if (connection) {
          setStoreUrl(connection.store_url)
          setApiKey(connection.api_key)
          setApiSecret(connection.api_secret)
          setAccessToken(connection.access_token)
          setIsConnected(true)
        }
      } catch (err) {
        console.error("Error loading connection:", err)
        if (err instanceof Error && err.message.includes("Cannot initialize Supabase client")) {
          setError("Database connection error. Please check your environment variables.")
        } else {
          setError("Failed to load existing connection")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadConnection()
  }, [])

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Store Connection Settings</h1>
        <p className="text-muted-foreground">
          Connect your Shopify store to access products, collections, and other data.
        </p>

        {isConnected && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connected</AlertTitle>
            <AlertDescription className="text-green-700">
              Your Shopify store is successfully connected.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <form onSubmit={handleConnect}>
            <CardHeader>
              <CardTitle>Shopify Store Connection</CardTitle>
              <CardDescription>Enter your Shopify store credentials to connect to your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-url">Store URL</Label>
                <Input
                  id="store-url"
                  placeholder="your-store.myshopify.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  placeholder="Shopify API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  id="api-secret"
                  type="password"
                  placeholder="Shopify API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-token">Access Token</Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Shopify Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Connecting..." : isConnected ? "Update Connection" : "Connect Store"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}


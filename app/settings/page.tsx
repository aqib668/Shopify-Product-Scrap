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
import { getShopifyConnection } from "@/lib/supabase"
import { saveShopifyConnectionAction } from "../actions"

export default function SettingsPage() {
  const [storeUrl, setStoreUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadConnection() {
      try {
        const connection = await getShopifyConnection()
        if (connection) {
          setStoreUrl(connection.store_url || "")
          setApiKey(connection.api_key || "")
          setApiSecret(connection.api_secret || "")
          setAccessToken(connection.access_token || "")
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

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append("store_url", storeUrl)
      formData.append("api_key", apiKey)
      formData.append("api_secret", apiSecret)
      formData.append("access_token", accessToken)

      const result = await saveShopifyConnectionAction(formData)

      if (result.success) {
        setSuccess(result.message)
        setIsConnected(true)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error("Error saving connection:", err)
      setError(err instanceof Error ? err.message : "Failed to connect to Shopify")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">Store Connection Settings</h1>
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Store Connection Settings</h1>
        <p className="text-muted-foreground">
          Connect your Shopify store to access products, collections, and other data.
        </p>

        {isConnected && !error && !success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connected</AlertTitle>
            <AlertDescription className="text-green-700">
              Your Shopify store is successfully connected.
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
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
                  name="store_url"
                  placeholder="your-store.myshopify.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  name="api_key"
                  placeholder="Shopify API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  id="api-secret"
                  name="api_secret"
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
                  name="access_token"
                  type="password"
                  placeholder="Shopify Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isConnected ? "Update Connection" : "Connect Store"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}


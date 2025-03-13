import { ShopifyProducts } from "@/components/shopify-products"
import { DashboardShell } from "@/components/dashboard-shell"
import { getShopifyConnection, initializeDatabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  let hasConnection = false
  let connectionError = false
  let setupNeeded = false

  try {
    // Try to initialize the database first
    await initializeDatabase()

    // Then check for a connection
    const connection = await getShopifyConnection()
    hasConnection = !!connection
  } catch (error) {
    console.error("Error checking Shopify connection:", error)
    connectionError = true

    // Check if this is a setup issue
    if (error instanceof Error && (error.message.includes("relation") || error.message.includes("does not exist"))) {
      setupNeeded = true
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Products Dashboard</h1>

        {setupNeeded && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>The database tables need to be set up. Please click the button below to initialize the database.</p>
              <Button variant="outline" size="sm" className="w-fit mt-2" asChild>
                <Link href="/api/setup">Initialize Database</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {connectionError && !setupNeeded && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Error</AlertTitle>
            <AlertDescription>
              There was an error connecting to the database. Please check your environment variables and database setup.
            </AlertDescription>
          </Alert>
        )}

        {!connectionError && (
          <p className="text-muted-foreground">
            {hasConnection
              ? "View and manage your Shopify products and collections."
              : "Connect your Shopify store to view and manage your products."}
          </p>
        )}

        <ShopifyProducts />
      </div>
    </DashboardShell>
  )
}


import { ShopifyProducts } from "@/components/shopify-products"
import { DashboardShell } from "@/components/dashboard-shell"
import { getShopifyConnection } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function HomePage() {
  let hasConnection = false
  let connectionError = false

  try {
    const connection = await getShopifyConnection()
    hasConnection = !!connection
  } catch (error) {
    console.error("Error checking Shopify connection:", error)
    connectionError = true
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Products Dashboard</h1>

        {connectionError && (
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


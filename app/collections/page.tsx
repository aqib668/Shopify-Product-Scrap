import { DashboardShell } from "@/components/dashboard-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getShopifyConnection } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function CollectionsPage() {
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
        <h1 className="text-3xl font-bold">Collections</h1>

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
              ? "View and manage your Shopify collections."
              : "Connect your Shopify store to view and manage your collections."}
          </p>
        )}

        {!hasConnection ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/40">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Shopify Connection</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You need to connect your Shopify store before you can view and manage collections.
            </p>
            <Button asChild>
              <Link href="/settings">Connect Shopify Store</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Collections will be displayed here when implemented */}
            <div className="p-6 text-center border rounded-lg">
              <p className="mb-4">Collections feature coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}


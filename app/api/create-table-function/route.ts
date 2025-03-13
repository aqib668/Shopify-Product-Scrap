import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = supabaseClient()

    // Create a stored procedure to create the table
    const { error } = await supabase.sql`
      CREATE OR REPLACE FUNCTION create_store_connections_table()
      RETURNS void AS $$
      BEGIN
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        CREATE TABLE IF NOT EXISTS store_connections (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          store_url TEXT NOT NULL,
          api_key TEXT NOT NULL,
          api_secret TEXT NOT NULL,
          access_token TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END;
      $$ LANGUAGE plpgsql;
    `

    if (error) {
      console.error("Error creating function:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create function",
          error: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Function created successfully",
    })
  } catch (error) {
    console.error("Error in create-table-function route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}


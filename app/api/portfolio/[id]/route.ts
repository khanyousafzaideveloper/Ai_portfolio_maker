import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id

    const { error } = await supabase.from("portfolios").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to delete portfolio" },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { success: true, message: "Portfolio deleted successfully" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Delete portfolio error:", error)
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 },
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id

    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("Fetch portfolio error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 },
    )
  }
}

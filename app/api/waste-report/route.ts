export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")
    const stateID = searchParams.get("stateID")
    const districtID = searchParams.get("districtID")
    const blockID = searchParams.get("blockID")
    const gpID = searchParams.get("gpID")
    const level = searchParams.get("level")

    // Build the backend URL with query parameters
    const backendUrl = new URL("https://swmapi.vercel.app/api/waste-report")
    backendUrl.searchParams.set("month", month || "August")
    backendUrl.searchParams.set("year", year || "2025")
    backendUrl.searchParams.set("stateID", stateID || "1")
    backendUrl.searchParams.set("districtID", districtID || "0")
    backendUrl.searchParams.set("blockID", blockID || "0")
    backendUrl.searchParams.set("gpID", gpID || "0")
    backendUrl.searchParams.set("level", level || "1")

    const response = await fetch(backendUrl.toString())

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()

    return Response.json(data)
  } catch (error) {
    console.error("[v0] API route error:", error)
    return Response.json({ success: false, error: "Failed to fetch data from backend", data: [] }, { status: 500 })
  }
}

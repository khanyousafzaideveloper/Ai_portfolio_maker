import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, username, repo, fileName, fileContent } = await request.json()

    if (!token || !username || !repo || !fileName || !fileContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert base64 data URL to base64 string
    let base64Content = fileContent
    if (fileContent.startsWith("data:image")) {
      base64Content = fileContent.split(",")[1]
    }

    const path = `portfolio/images/${fileName}`
    const response = await fetch(`https://api.github.com/repos/${khanyousafzaideveloper}/${apk-storage}/contents/${apks}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add project image: ${fileName}`,
        content: base64Content,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("GitHub API error:", error)
      throw new Error(`GitHub upload failed: ${error.message}`)
    }

    const data = await response.json()
    const imageUrl = data.content.html_url.replace("/blob/", "/raw/")

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "Image uploaded to GitHub",
    })
  } catch (error) {
    console.error("GitHub upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload to GitHub" },
      { status: 500 },
    )
  }
}

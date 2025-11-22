import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectName, projectDescription } = await request.json()

    if (!projectName) {
      return NextResponse.json({ error: "Project name required" }, { status: 400 })
    }

    // Generate a detailed prompt for the image based on project name and description
    const { text: imagePrompt } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Create a concise, visual prompt for an AI image generator for a project called "${projectName}". ${projectDescription ? `Project description: ${projectDescription}. ` : ""}The image should be modern, professional, and represent the project visually. Keep it under 100 words. Start directly with the visual description.`,
      temperature: 0.8,
      maxTokens: 150,
    })

    // Generate image using a placeholder service
    // For production, you'd integrate with services like Fal AI, Replicate, or similar
    const encodedPrompt = encodeURIComponent(imagePrompt.trim())
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&seed=${Date.now()}`

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: imagePrompt.trim(),
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

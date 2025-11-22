"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Download, Eye, Printer } from "lucide-react"

export default function PreviewPanel({ portfolioData, resumeData, isGenerating }) {
  const [previewMode, setPreviewMode] = useState<"embedded" | "none">("embedded")

  const handleDownloadPortfolio = () => {
    if (!portfolioData) return

    try {
      const blob = new Blob([portfolioData], { type: "text/html;charset=utf-8" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "portfolio.html")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download portfolio")
    }
  }

  const handleDownloadResume = () => {
    if (!resumeData) return

    try {
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(resumeData)
        newWindow.document.close()
        setTimeout(() => {
          newWindow.print()
        }, 250)
      }
    } catch (error) {
      console.error("Resume error:", error)
      alert("Failed to open resume")
    }
  }

  const handlePreviewFullScreen = () => {
    if (!portfolioData) return
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(portfolioData)
      newWindow.document.close()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Live Preview</CardTitle>
          <CardDescription>Your portfolio will appear here after generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolioData && (
            <div className="flex gap-2 mb-4 flex-wrap">
              <Button
                size="sm"
                variant={previewMode === "embedded" ? "default" : "outline"}
                onClick={() => setPreviewMode("embedded")}
                className="bg-primary/20 hover:bg-primary/30 border-primary/50 text-primary transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreviewFullScreen}
                className="bg-accent/20 hover:bg-accent/30 border-accent/50 text-accent transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Full Screen
              </Button>
            </div>
          )}

          {isGenerating ? (
            <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
              <div className="text-center space-y-3 animate-pulse-subtle">
                <div className="inline-block">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/50 border-t-primary animate-spin" />
                </div>
                <p className="text-muted-foreground">Generating your portfolio with AI...</p>
              </div>
            </div>
          ) : portfolioData ? (
            <div className="bg-background rounded-lg overflow-hidden border border-border/50 hover:border-border/80 transition-colors">
              {previewMode === "embedded" ? (
                <iframe srcDoc={portfolioData} className="w-full h-96 border-0" title="Portfolio Preview" />
              ) : (
                <div className="h-96 flex items-center justify-center bg-muted/20">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">Portfolio opened in new tab</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
              <div className="text-center">
                <div className="text-5xl mb-3">✨</div>
                <p className="text-muted-foreground">Fill the form and generate to see preview</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Section */}
      {portfolioData && (
        <div className="space-y-3 animate-slide-up">
          <Button
            onClick={handleDownloadPortfolio}
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/50"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Portfolio (HTML)
          </Button>
          {resumeData && (
            <Button
              onClick={handleDownloadResume}
              variant="outline"
              className="w-full border-border/50 hover:border-border hover:bg-muted/30 transition-colors bg-transparent"
              size="lg"
            >
              <Printer className="w-4 h-4 mr-2" />
              Download Resume (Print as PDF)
            </Button>
          )}
        </div>
      )}

      {/* Pro Tips */}
      <Card className="border-border/50 bg-muted/10 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✨ Enable AI to get professional descriptions and auto-generated images</p>
          <p>🖼️ Generate unique images for each project with one click</p>
          <p>📱 Use Preview to see how your portfolio looks before downloading</p>
          <p>🌓 Toggle between light and dark mode in the header</p>
        </CardContent>
      </Card>
    </div>
  )
}

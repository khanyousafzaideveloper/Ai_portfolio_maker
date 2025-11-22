"use client"

import { useState, useEffect } from "react"
import PortfolioForm from "@/components/portfolio-form"
import PreviewPanel from "@/components/preview-panel"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function GeneratorPage() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfolio Generator</h1>
            <p className="text-muted-foreground text-sm mt-1">Create your professional portfolio with AI</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-border/50 hover:border-border hover:bg-muted/50 bg-transparent"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <PortfolioForm
              onGenerate={(data, resume) => {
                setPortfolioData(data)
                setResumeData(resume)
              }}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>

          {/* Right Panel - Preview */}
          <div>
            <PreviewPanel portfolioData={portfolioData} resumeData={resumeData} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  )
}

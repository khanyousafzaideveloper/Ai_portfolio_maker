"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploader from "./image-uploader"

const BUCKET_NAME = "portfolio-images"

type Project = {
  id?: number
  name: string
  description: string
  image?: string | null
}

type PortfolioFormProps = {
  onGenerate: (html: string, resumeHtml?: string) => void
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
}

type FormDataState = {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  twitter: string
  website: string
  tagline: string
  aboutHint: string
  skills: string
  experience: string
  education: string
  useAI: boolean
  template: string
  research: string
  achievements: string
  events: string
  languages: string
}

async function uploadImageToStorage(path: string, image: string): Promise<string | null> {
  try {
    const response = await fetch(image)
    if (!response.ok) {
      console.warn("Image fetch failed", response.status, image)
      return null
    }

    const blob = await response.blob()
    const extension = blob.type.split("/")[1] || "png"
    const filePath = `${path}.${extension}`

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, blob, {
      contentType: blob.type || "image/png",
      upsert: true,
    })

    if (error) {
      console.warn("Supabase upload failed", error)
      return null
    }

    const publicUrlResponse = await supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return publicUrlResponse.data?.publicUrl ?? null
  } catch (error) {
    console.warn("Upload image to storage failed", error)
    return null
  }
}

export default function PortfolioForm({ onGenerate, isGenerating, setIsGenerating }: PortfolioFormProps) {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    twitter: "",
    website: "",
    tagline: "",
    aboutHint: "",
    skills: "",
    experience: "",
    education: "",
    useAI: true,
    template: "Modern Glass",

    research: "",
    achievements: "",
    events: "",
    languages: "",
  })

  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project>({ name: "", description: "", image: null })
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [enhancingField, setEnhancingField] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleGenerateDescription = async () => {
    if (!currentProject.name.trim()) {
      alert("Please enter a project name first")
      return
    }

    setGeneratingDescription(true)
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: currentProject.name,
          skills: formData.skills,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate description")

      const data = await response.json()
      setCurrentProject((prev) => ({
        ...prev,
        description: data.description,
      }))
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to generate description. You can write one manually.")
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!currentProject.name.trim()) {
      alert("Please enter a project name first")
      return
    }

    setGeneratingImage(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: currentProject.name,
          projectDescription: currentProject.description,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate image")

      const data = await response.json()
      setCurrentProject((prev) => ({
        ...prev,
        image: data.imageUrl,
      }))
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to generate image. You can upload one manually.")
    } finally {
      setGeneratingImage(false)
    }
  }

  const uploadResource = async (prefix: string, imageUrl: string | null): Promise<string | null> => {
    if (!imageUrl) return null
    const key = `${prefix}-${Date.now()}`
    return await uploadImageToStorage(key, imageUrl)
  }

  const handleAddProject = () => {
    if (!currentProject.name.trim()) {
      alert("Please enter a project name")
      return
    }

    const projectWithId: Project = {
      ...currentProject,
      id: Date.now(),
    }

    setProjects((prev) => [...prev, projectWithId])
    setCurrentProject({ name: "", description: "", image: null })
  }

  const handleRemoveProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const handleGeneratePortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      alert("Please fill in: Name and Email")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projects,
          profilePic,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate portfolio")

      const data = await response.json()

      // Upload profile picture and project images to storage before saving
      const profilePicUrl = await uploadResource("profile-pic", profilePic)
      const projectUploads = await Promise.all(
        projects.map(async (project, index) => {
          const imageUrl = await uploadResource(`project-${index}`, project.image)
          return {
            ...project,
            image: imageUrl || project.image,
          }
        }),
      )

      // Save portfolio to Supabase silently (no user notification)
      try {
        const saveResponse = await fetch("/api/save-portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            projects: projectUploads,
            profilePic: profilePicUrl || profilePic,
            portfolioHtml: data.portfolioHtml,
          }),
        })

        const saveResult = await saveResponse.json()
        if (!saveResponse.ok) {
          console.error("Portfolio save failed:", saveResult)
          alert(
            `Portfolio save failed: ${saveResult.details || saveResult.error}`,
          )
        }
      } catch (saveError) {
        console.error("Save operation failed:", saveError)
        alert("Portfolio could not be saved to Supabase.")
      }

      alert("Portfolio generated successfully! ✨")
      onGenerate(data.portfolioHtml, data.resumeHtml)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to generate portfolio. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhanceText = async (fieldName, fieldValue) => {
    if (!fieldValue.trim()) {
      alert("Please enter some text first")
      return
    }

    setEnhancingField(fieldName)
    try {
      const response = await fetch("/api/enhance-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fieldValue, type: fieldName }),
      })

      if (!response.ok) throw new Error("Enhancement failed")

      const { enhancedText } = await response.json()
      setFormData((prev) => ({
        ...prev,
        [fieldName]: enhancedText,
      }))
    } catch (error) {
      alert("Failed to enhance text. Please try again.")
      console.error("Enhancement error:", error)
    } finally {
      setEnhancingField(null)
    }
  }

  return (
    <form onSubmit={handleGeneratePortfolio} className="space-y-5">
      {/* Basic Info */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Basic Information</CardTitle>
          <CardDescription>Your personal details and contact info</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
                className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Professional Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="Full Stack Developer | Creative Marketer | Data Analyst"
                className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                required
                className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Picture */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Profile Picture</CardTitle>
          <CardDescription>Upload a professional photo</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader onImageChange={setProfilePic} label="Profile Picture" />
        </CardContent>
      </Card>

      {/* Social & Web Links */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Professional Links</CardTitle>
          <CardDescription>Connect your online profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/janedoe"
              className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/janedoe"
              className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="https://twitter.com/janedoe"
              className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>
          <div>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://janedoe.com"
              className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills & Experience */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Skills & Experience</CardTitle>
          <CardDescription>Your expertise and professional background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="React, TypeScript, Python, Node.js, AWS"
              className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>
          <div>
            <Label htmlFor="aboutHint">About Me Hint</Label>
            <textarea
              id="aboutHint"
              name="aboutHint"
              value={formData.aboutHint}
              onChange={handleInputChange}
              placeholder="Passionate about building scalable web applications and learning new technologies"
              rows={3}
              className="w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Button
                type="button"
                onClick={() => handleEnhanceText("experience", formData.experience)}
                disabled={enhancingField === "experience"}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {enhancingField === "experience" ? "Enhancing..." : "✨ Enhance"}
              </Button>
            </div>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Senior Developer at Tech Corp (2020-Present)&#10;Marketing Manager at Brand Inc (2018-2020)&#10;Describe your roles and achievements..."
              rows={3}
              className="w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Education</CardTitle>
          <CardDescription>Your educational background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="education">Education Details</Label>
              <Button
                type="button"
                onClick={() => handleEnhanceText("education", formData.education)}
                disabled={enhancingField === "education"}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {enhancingField === "education" ? "Enhancing..." : "✨ Enhance"}
              </Button>
            </div>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              placeholder="Bachelor of Science in Computer Science, University Name (2016-2020)&#10;Describe your degree, GPA, relevant coursework..."
              rows={3}
              className="w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Projects</CardTitle>
          <CardDescription>Add your projects - AI will generate descriptions and images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mt-1 space-y-3 p-4 bg-muted/20 border border-border/50 rounded-lg">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={currentProject.name}
                onChange={(e) => setCurrentProject((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="E-commerce Platform"
                className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="projectDesc">Description (or auto-generate)</Label>
              <textarea
                id="projectDesc"
                value={currentProject.description}
                onChange={(e) => setCurrentProject((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Project description will appear here..."
                rows={2}
                className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleGenerateDescription}
                disabled={generatingDescription}
                variant="outline"
                className="flex-1 bg-accent/10 hover:bg-accent/20 border-accent/50 hover:border-accent text-accent transition-colors"
              >
                {generatingDescription ? "✨ Generating..." : "✨ Auto-Generate Description"}
              </Button>
              <Button
                type="button"
                onClick={handleGenerateImage}
                disabled={generatingImage}
                variant="outline"
                className="flex-1 bg-accent/10 hover:bg-accent/20 border-accent/50 hover:border-accent text-accent transition-colors"
              >
                {generatingImage ? "🖼️ Generating..." : "🖼️ Generate Image"}
              </Button>
            </div>

            {!currentProject.image && (
              <ImageUploader
                onImageChange={(img) => setCurrentProject((prev) => ({ ...prev, image: img }))}
                label="Or upload project screenshot"
              />
            )}

            {currentProject.image && (
              <div className="relative w-full h-32 bg-muted/50 rounded-lg overflow-hidden border border-border/50">
                <img
                  src={currentProject.image || "/placeholder.svg"}
                  alt="Project"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCurrentProject((prev) => ({ ...prev, image: null }))}
                  className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddProject}
              className="w-full bg-primary hover:bg-primary/90 transition-colors"
            >
              Add Project
            </Button>
          </div>

          {projects.length > 0 && (
            <div className="space-y-2 animate-slide-up">
              <Label>Added Projects ({projects.length})</Label>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-border/80 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveProject(project.id)}>
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Research Profile */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Research Profile</CardTitle>
          <CardDescription>Add research work, publications or academic contributions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="research">Research Details</Label>
            <textarea
              id="research"
              name="research"
              value={formData.research || ""}
              onChange={handleInputChange}
              placeholder="List your research publications, projects or areas of interest..."
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements / Awards */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Achievements & Awards</CardTitle>
          <CardDescription>Highlight your recognitions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="achievements">Achievements / Awards</Label>
              <Button
                type="button"
                onClick={() => handleEnhanceText("achievements", formData.achievements)}
                disabled={enhancingField === "achievements"}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {enhancingField === "achievements" ? "Enhancing..." : "✨ Enhance"}
              </Button>
            </div>
            <textarea
              id="achievements"
              name="achievements"
              value={formData.achievements || ""}
              onChange={handleInputChange}
              placeholder="e.g., Best Developer Award 2023, Hackathon Winner..."
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conferences / Seminars / Trainings */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Conferences / Seminars / Trainings</CardTitle>
          <CardDescription>Events you participated in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="events">List of Events Attended</Label>
              <Button
                type="button"
                onClick={() => handleEnhanceText("events", formData.events)}
                disabled={enhancingField === "events"}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {enhancingField === "events" ? "Enhancing..." : "✨ Enhance"}
              </Button>
            </div>
            <textarea
              id="events"
              name="events"
              value={formData.events || ""}
              onChange={handleInputChange}
              placeholder="Conference on AI 2024, Web Summit 2023, React Workshop..."
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Languages</CardTitle>
          <CardDescription>Languages you speak</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="languages">Languages (comma-separated)</Label>
            <Input
              id="languages"
              name="languages"
              value={formData.languages || ""}
              onChange={handleInputChange}
              placeholder="English, Urdu, Arabic, French"
              className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">Settings</CardTitle>
          <CardDescription>Customize your portfolio generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useAI"
              name="useAI"
              checked={formData.useAI}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-input cursor-pointer"
            />
            <Label htmlFor="useAI" className="cursor-pointer">
              Enable AI Enhancement (generates professional content & images)
            </Label>
          </div>

          <div>
            <Label htmlFor="template">Template</Label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"
            >
              <option>Modern Glass</option>
              <option>Minimal Dark</option>
              <option>Creative Gradient</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/50"
        disabled={isGenerating}
      >
        {isGenerating ? "✨ Generating with AI..." : "✨ Generate Portfolio"}
      </Button>
    </form>
  )
}

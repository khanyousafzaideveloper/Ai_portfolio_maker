"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function ImageUploader({ onImageChange, label }) {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setPreview(dataUrl)
      onImageChange(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              Change Image
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="flex-1">
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 border-dashed border-2 bg-transparent"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📸</div>
            <p className="text-sm font-medium">Click to upload {label}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
          </div>
        </Button>
      )}
    </div>
  )
}

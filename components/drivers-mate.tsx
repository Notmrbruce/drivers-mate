"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Upload, FileUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function DriversMate() {
  const [file, setFile] = useState<File | null>(null)
  const [processOption, setProcessOption] = useState("full")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('processOption', processOption)

    try {
      const response = await fetch('/api/process-file', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'processed_file.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('File processing failed')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
      setProgress(100)
    }
  }

  return (
    <div className="min-h-screen bg-[#ff914d] p-8">
      <div className="max-w-4xl mx-auto">
        <Image src="/DriversMateLogo.png" alt="DriversMate Logo" width={300} height={100} className="mb-8" />
        <div className="bg-white border-4 border-black rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Card className="flex-1 bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-black">Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2 text-black">
                    <li>Head to tracsis & open up your work plan</li>
                    <li

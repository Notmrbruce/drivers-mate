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
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">DriversMate</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload File</Label>
                <div className="flex items-center space-x-2">
                  <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx"
                  />
                  {file && <span>{file.name}</span>}
                </div>
              </div>
              <RadioGroup value={processOption} onValueChange={setProcessOption}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Full Roster</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daysOff" id="daysOff" />
                  <Label htmlFor="daysOff">Days Off Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="workDays" id="workDays" />
                  <Label htmlFor="workDays">Work Days Only</Label>
                </div>
              </RadioGroup>
              <Button type="submit" disabled={isProcessing}>
                <FileUp className="w-4 h-4 mr-2" />
                Process File
              </Button>
              {isProcessing && <Progress value={progress} className="w-full" />}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

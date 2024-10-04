"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Upload, FileUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function DriversMate() {
  const [file, setFile] = useState<File | null>(null)
  const [processOption, setProcessOption] = useState("full")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return

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
    }
  }

  return (
    <div className="min-h-screen bg-[#FF9966] p-8">
      <div className="max-w-4xl mx-auto">
        <Image src="/placeholder.svg" alt="DriversMate Logo" width={300} height={100} className="mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="flex-1 bg-white/90">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Head to tracsis & open up your work plan</li>
                <li>Ammend the dates so they suit your needs</li>
                <li>Use the export as CSV button</li>
                <li>Open that file in excel & save as excel work book file (.xlsx)</li>
                <li>Upload that file to this site</li>
                <li>Once file is returned to you simply rename it to remove the .xlsx and replace it with .csv</li>
                <li>example &quot;work.csv&quot;</li>
                <li>Upload new file to https://csv-to-ical.chimbori.com/ and set up as ios calendar</li>
              </ol>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-[#333333] text-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Simple reformat tool</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">XLSX file (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".xlsx" />
                  </label>
                </div>
                {file && <p className="text-sm">{file.name}</p>}
                <RadioGroup value={processOption} onValueChange={setProcessOption}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full">Full Roster - Both work & days off</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daysOff" id="daysOff" />
                    <Label htmlFor="daysOff">Days Off Only - Days off only useful for sharing with others</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="workDays" id="workDays" />
                    <Label htmlFor="workDays">Work Days Only - Useful if you want to use separate colours to differentiate between days off & on in your calendar</Label>
                  </div>
                </RadioGroup>
                <Button type="submit" className="w-full">
                  <FileUp className="mr-2 h-4 w-4" /> Process File
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

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

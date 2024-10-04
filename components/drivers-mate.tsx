const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault()
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target?.result?.toString().split(',')[1]
    if (!base64) return

    try {
      const response = await fetch('/api/process-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          processOption,
        }),
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
  reader.readAsDataURL(file)
}

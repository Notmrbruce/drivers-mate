import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { writeFile, unlink, readFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  console.log('API route called')
  const formData = await request.formData()
  const file = formData.get('file') as File
  const processOption = formData.get('processOption') as string

  console.log('Process option:', processOption)

  if (!file) {
    console.error('No file uploaded')
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  console.log('File name:', file.name)

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name
  const filepath = path.join(process.cwd(), 'tmp', filename)

  try {
    console.log('Writing file to:', filepath)
    await writeFile(filepath, buffer)

    let scriptPath
    switch (processOption) {
      case 'full':
        scriptPath = path.join(process.cwd(), 'scripts', 'roster_reformatter_enhanced.py')
        break
      case 'daysOff':
        scriptPath = path.join(process.cwd(), 'scripts', 'roster_reformatter_rdonly.py')
        break
      case 'workDays':
        scriptPath = path.join(process.cwd(), 'scripts', 'roster_reformatter_workonly.py')
        break
      default:
        throw new Error('Invalid process option')
    }

    console.log('Using script:', scriptPath)

    const outputPath = path.join(process.cwd(), 'tmp', `processed_${filename}`)

    console.log('Output path:', outputPath)

    await new Promise((resolve, reject) => {
      exec(`python ${scriptPath} ${filepath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          return reject(error)
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
        resolve(null)
      })
    })

    console.log('Python script executed')

    const processedFile = await readFile(outputPath)
    console.log('Processed file read, size:', processedFile.length)

    await unlink(filepath)
    await unlink(outputPath)

    console.log('Temporary files deleted')

    return new NextResponse(processedFile, {
      headers: {
        'Content-Disposition': `attachment; filename="processed_${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 })
  }
}

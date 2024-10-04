import { VercelRequest, VercelResponse } from '@vercel/node'
import { exec } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { file, processOption } = req.body

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const buffer = Buffer.from(file, 'base64')
  const filename = 'uploaded_file.xlsx'
  const filepath = path.join('/tmp', filename)

  try {
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

    const outputPath = path.join('/tmp', `processed_${filename}`)

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

    const processedFile = await Bun.file(outputPath).arrayBuffer()
    await unlink(filepath)
    await unlink(outputPath)

    res.setHeader('Content-Disposition', `attachment; filename="processed_${filename}"`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return res.send(Buffer.from(processedFile))
  } catch (error) {
    console.error('Error processing file:', error)
    return res.status(500).json({ error: 'Error processing file' })
  }
}

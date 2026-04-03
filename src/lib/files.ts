type File = {
  type: string
  download_url: string
  path: string
}

export async function getFilesContent(files: File[]) {
  const contents = await Promise.all(
    files.slice(0, 10).map(async (file) => {
      const res = await fetch(file.download_url)
      const text = await res.text()

      return `// FILE: ${file.path}\n${text}`
    })
  )

  return contents.join("\n\n")
}
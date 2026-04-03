
import { getAllFiles, parseGitHubUrl, getFileScore, isPublicRepo, isValidGitHubUrl } from "@/lib/github"
import { getFilesContent } from "@/lib/files"
import { analyzeWithRetry } from "@/lib/ai-safe"


export async function POST(req: Request) {
    try {
        const { url } = await req.json()
        if (!url) {
            return Response.json({ error: "Missing URL" }, { status: 400 })
        }
    const { owner, repo } = parseGitHubUrl(url)
    if (!isValidGitHubUrl(url)) {
      return Response.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      )
    }

    const isPublic = await isPublicRepo(owner, repo);

    if (!isPublic) {
      return Response.json(
        { error: "Repository is private or not found" },
        { status: 403 }
      )
    }
    const files = await getAllFiles(owner, repo)
    const sorted = files.sort(
    (a, b) => getFileScore(b.path) - getFileScore(a.path)
    )
    const selected = sorted.slice(0, 50)
    const code = await getFilesContent(selected)

    const result = await analyzeWithRetry(code)


    return Response.json(result)
    } catch(err:any) {
        if (err.message === "AI_LIMIT") {
      return Response.json(
        { error: "AI is busy, try again later" },
        { status: 429 }
      )
    }

    console.error("🔥 ERROR:", err)

  return Response.json(
    { error: err.message || "Internal error" },
    { status: 500 }
  )
    
    }
    
}
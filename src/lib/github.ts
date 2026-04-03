type File = {
  type: string
  download_url: string
  path: string
}

const priorityDirs = [
  "src",
  "app",
  "components",
  "pages",
  "lib",
  "utils",
  "services",
  "data"
]

const lowPriorityDirs = [
  "tests",
  "__tests__",
  "mocks",
  "examples"
]

const allowedExtensions = [
  ".js", ".ts", ".jsx", ".tsx", ".css", ".html",
  ".py", ".java", ".go", ".rb", ".php", ".vue",
  ".rs", ".swift", ".kt", ".dart", ".m", ".scala",
  ".sh", ".sql", ".json", ".yml", ".yaml", ".md",
  ".c", ".cpp", ".h", ".cs", ".fs", ".lua", ".r",
  ".pl", ".groovy", ".asm", ".s", ".vb", ".vbs",
  ".ps1", ".psm1"
]

const MAX_FILES = 50
const ignoredDirs = ["node_modules", ".git", "dist", "build"]

export async function getAllFiles(
  owner: string,
  repo: string,
  path = "",
  collected: File[] = []
): Promise<File[]> {
  if (collected.length >= MAX_FILES) return collected

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  }
  )
  if (!res.ok) {
    console.error("GitHub API error")
    return collected
  }
if (res.status === 404) {
  throw new Error("Repository not found")
}

if (res.status === 403) {
  throw new Error("GitHub rate limit exceeded")
}
  const data = await res.json()
  for (const item of data) {
    if (collected.length >= MAX_FILES) break
    if (
        item.type === "dir" &&
            ignoredDirs.some(dir => item.path.includes(dir))
    ) {
        continue
    }
    if (item.type === "file") {
      const isAllowed = allowedExtensions.some(ext =>
        item.path.endsWith(ext)
      )

      if (isAllowed) {
        collected.push(item)
      }
    }

    if (item.type === "dir") {
      await getAllFiles(owner, repo, item.path, collected)
    }
  }

  return collected
}

export function parseGitHubUrl(url: string) {
  const [, , , owner, repo] = url.split("/")
  return { owner, repo }
}

export function getFileScore(path: string) {
  let score = 0

  if (priorityDirs.some(dir => path.startsWith(dir))) {
    score += 10
  }

  if (path.includes("config") || path.includes("setup")) {
    score += 3
  }

  if (lowPriorityDirs.some(dir => path.includes(dir))) {
    score -= 5
  }


if (path.includes("App.") || path.includes("Layout.")) {
  score += 5
}
  if (path.endsWith(".test.ts") || path.endsWith(".spec.ts")) {
    score -= 10
    }
  score += path.length * 0.01

  return score
}

export function isValidGitHubUrl(url: string) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname !== "github.com") return false

    const parts = parsed.pathname.split("/").filter(Boolean)

    return parts.length >= 2
  } catch {
    return false
  }
}

export async function isPublicRepo(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  }
  )

  if (!res.ok) return false

  const data = await res.json()

  return !data.private
}
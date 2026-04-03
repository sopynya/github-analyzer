export async function getRepoFiles(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents`
  )

  const data = await res.json()

  return data
}
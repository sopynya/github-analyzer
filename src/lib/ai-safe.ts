import { callGemini, analyzeCode, safeParseAI } from "./ai";

export async function repairJSON(broken: string) {
  const prompt = `
  You are a JSON fixer.
Fix the following JSON.

Rules:
- Return ONLY valid JSON
- Don't explain what you are doing
- Don't return anything other than the JSON to fix
- Keep original structure

JSON:
${broken}
`

  return await callGemini(prompt)
}

export async function analyzeWithRetry(code: string) {

  let response = await analyzeCode(code)
  let parsed = safeParseAI(response)

  if (parsed) return parsed

  response = await repairJSON(response)
  parsed = safeParseAI(response)

  if (parsed) return parsed

  response = await analyzeCode(code)
  parsed = safeParseAI(response)

  if (parsed) return parsed

  return {
    generalScore: 5,
    performanceScore: 5,
    securityRate: 5,
    securityIssues: ["Failed to analyze"],
    performanceIssues: [],
    generalIssues: [],
    suggestions: ["Try again later"]
  }
}
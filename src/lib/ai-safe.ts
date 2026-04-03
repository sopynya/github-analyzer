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

  if (!response) throw new Error("AI_EMPTY")

  let parsed = safeParseAI(response)

  if (parsed) return parsed

  const repaired = await repairJSON(response)
  const parsedRepair = safeParseAI(repaired)

  if (parsedRepair) return parsedRepair

  throw new Error("AI_INVALID")
}
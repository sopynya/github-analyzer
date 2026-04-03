import { GoogleGenAI } from "@google/genai"
import { z } from "zod"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

export const aiSchema = z.object({
  generalScore: z.number().min(0).max(10),
  performanceScore: z.number().min(0).max(10),
  securityRate: z.number().min(0).max(10),
  uiScore: z.number().min(0).max(10),
  cleanCodeScore: z.number().min(0).max(10),
  architectureScore: z.number().min(0).max(10),
  testabilityScore: z.number().min(0).max(10),
  complexityScore: z.number().min(0).max(10),
  errorHandlingScore: z.number().min(0).max(10),
  consistencyScore: z.number().min(0).max(10),

  securityIssues: z.array(z.string()),
  performanceIssues: z.array(z.string()),
  generalIssues: z.array(z.string()),
  uiIssues: z.array(z.string()),
  codeSmells: z.array(z.string()),
  architectureIssues: z.array(z.string()),
  testabilityIssues: z.array(z.string()),
  errorHandlingIssues: z.array(z.string()),

  suggestions: z.array(z.string())
})

export function safeParseAI(response: string) {
  try {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const json = JSON.parse(cleaned)
    return aiSchema.parse(json)
  } catch {
    return null
  }
}

export async function analyzeCode(code: string) {
  try {
    const MAX = 20000
    if (code.length > MAX) {
      code = code.slice(0, MAX)
    }

    const prompt = `
You are a senior software engineer performing a professional code review.

STRICT RULES:
- Respond ONLY with valid JSON
- Do NOT include explanations, markdown, or extra text
- All scores must be between 0 and 10 and broken down into decimals (e.g. 7.5, not 7 or 8)
- Base your scores on the code provided, do not make assumptions about missing code
- If no issues or suggestions return empty arrays, do not write "None" or "N/A"

OUTPUT FORMAT:
{
  "generalScore": number,
  "performanceScore": number,
  "securityRate": number,
  "uiScore": number,
  "cleanCodeScore": number,
  "architectureScore": number,
  "testabilityScore": number,
  "complexityScore": number,
  "errorHandlingScore": number,
  "consistencyScore": number,

  "securityIssues": string[],
  "performanceIssues": string[],
  "generalIssues": string[],
  "uiIssues": string[],
  "codeSmells": string[],
  "architectureIssues": string[],
  "testabilityIssues": string[],
  "errorHandlingIssues": string[],

  "suggestions": string[]
}

Code:
${code}
`

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    })

    return res.text

  } catch (err: any) {
    console.error("GEMINI ERROR:", err)

    if (
      err.message?.includes("429") ||
      err.message?.includes("quota")
    ) {
      throw new Error("AI_LIMIT")
    }

    throw new Error(err.message || "AI_ERROR")
  }
}

export async function callGemini(prompt: string) {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    })

    return res.text

  } catch (err: any) {
    console.error("🔥 GEMINI CALL ERROR:", err)

    if (
      err.message?.includes("429") ||
      err.message?.includes("quota")
    ) {
      throw new Error("AI_LIMIT")
    }

    throw new Error(err.message || "AI_ERROR")
  }
}
export async function testAI() {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello"
  })

  console.log(res.text)
}
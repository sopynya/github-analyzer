# Github Analyzer

Analyze any public public GitHub repository using AI and get a professional code review.

---

## Features 
- Analyze entire GitHub repositories via URL
- AI-powered code review (structure, performance, security)
- Detailed scoring system (0–10)
- Fast analysis with optimized file selection
- Beautiful UI with real-time visual metrics
- Retry + auto-repair system for AI responses

## Metrics

The analyzer evaluates:

- General Code Quality
- Performance
- Security
- UI / CSS Quality
- Clean Code
- Architecture
- Testability
- Complexity
- Error Handling
- Consistency

Each category receives a score from 0 to 10, along with actionable insights.

## How it works

1. User inputs a GitHub repository URL  
2. The backend fetches repository files via GitHub API  
3. Important files are prioritized and combined  
4. Code is sent to an AI model (Gemini)  
5. The AI returns structured JSON analysis  
6. Results are validated, repaired (if needed), and displayed 

## Tech Stack 

- **Frontend:** Next.js (React)  
- **Backend:** Next.js API Routes  
- **AI:** Google Gemini API  
- **Validation:** Zod  
- **Styling:** CSS

## Limitations 
- Very large repositories may be truncated for performance
- AI analysis is not perfect and should be used as guidance
- Rate limits may apply depending on API usage

---

## Suggestions

If you have any suggestions feel free to tell me, open issues or submit a pull request.
Thanks for reading!
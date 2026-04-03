"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { ScoreCircle } from "@/components/ScoreCircle";
import Loading from "@/components/Loading";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: repoUrl }),
      });
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error analyzing repository")
      } else {
        const data = await res.json()
        setData(data);
      }
    } catch (err) {
      setError("Error analyzing repository")
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
    <header className={styles.header}>
      <h1>Code Analyzer</h1>
      <nav>
        <a href="">Source</a>
      </nav>
    </header>
    <main className={styles.main}>
      <section className={styles.hero}>
        <h2>Analyze your GitHub codebase with AI</h2>
        <p>Get insights, identify issues, and improve your code quality effortlessly.</p>
      </section>
      <section className={styles.analyze}>
        <p>
          Paste your GitHub repository URL to analyze it with AI.
          It must be a public repository.
        </p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </section>
      {data && (
        <section className={styles.results}>
        <h3>Analysis Results</h3>
        <div className={styles.scores}>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.generalScore || 0} size={220} stroke={15} />
            <span style={{ fontSize: "1.6rem" }}>General</span>
          </div>
          <div className={styles.miniscore}>
            <div className={styles.scoreItem}>
            <ScoreCircle score={data?.performanceScore || 0} size={70} stroke={8} />
            <span>Performance</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.securityRate || 0} size={70} stroke={8} />
            <span>Security</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.uiScore || 0} size={70} stroke={8} />
            <span>UI/UX</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.cleanCodeScore || 0} size={70} stroke={8} />
            <span>Clean Code</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.architectureScore || 0} size={70} stroke={8} />
            <span>Architecture</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.testabilityScore || 0} size={70} stroke={8} />
            <span>Testability</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.complexityScore || 0} size={70} stroke={8} />
            <span>Complexity</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.errorHandlingScore || 0} size={70} stroke={8} />
            <span>Error Handling</span>
          </div>
          <div className={styles.scoreItem}>
            <ScoreCircle score={data?.consistencyScore || 0} size={70} stroke={8} />
            <span>Consistency</span>
          </div>
          </div>
        </div>
        <div className={styles.suggestions}>
          <h4>Suggestions</h4>
          <ul>
            {data?.suggestions?.map((suggestion: string, index: number) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
        <div className={styles.issues}>
          <h4>Issues</h4>
          {data.generalIssues?.length > 0 && (
            <>
              <h5>General Issues</h5>
              <ul>
                {data.generalIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.performanceIssues?.length > 0 && (
            <>
              <h5>Performance Issues</h5>
              <ul>
                {data.performanceIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.securityIssues?.length > 0 && (
            <>
              <h5>Security Issues</h5>
              <ul>
                {data.securityIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.uiIssues?.length > 0 && (
            <>
              <h5>UI/UX Issues</h5>
              <ul>
                {data.uiIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.codeSmells?.length > 0 && (
            <>
              <h5>Code Smells</h5>
              <ul>
                {data.codeSmells.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.architectureIssues?.length > 0 && (
            <>
              <h5>Architecture Issues</h5>
              <ul>
                {data.architectureIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.testabilityIssues?.length > 0 && (
            <>
              <h5>Testability Issues</h5>
              <ul>
                {data.testabilityIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.errorHandlingIssues?.length > 0 && (
            <>
              <h5>Error Handling Issues</h5>
              <ul>
                {data.errorHandlingIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
          {data.consistencyIssues?.length > 0 && (
            <>
              <h5>Consistency Issues</h5>
              <ul>
                {data.consistencyIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      )}
      {loading && (
        <Loading />
      )}
    </main>
    </>
  );
}

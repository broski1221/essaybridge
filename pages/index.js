import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "english", label: "English" },
  { code: "nepali", label: "Nepali (नेपाली)" },
  { code: "hindi", label: "Hindi (हिन्दी)" },
  { code: "korean", label: "Korean (한국어)" },
  { code: "japanese", label: "Japanese (日本語)" },
  { code: "chinese", label: "Chinese (中文)" },
  { code: "spanish", label: "Spanish (Español)" },
  { code: "french", label: "French (Français)" },
  { code: "german", label: "German (Deutsch)" },
  { code: "arabic", label: "Arabic (العربية)" },
  { code: "portuguese", label: "Portuguese (Português)" },
  { code: "russian", label: "Russian (Русский)" },
  { code: "bengali", label: "Bengali (বাংলা)" },
  { code: "italian", label: "Italian (Italiano)" },
];

const PURPOSES = [
  { id: "university", label: "University Application", icon: "🎓", desc: "Personal statement, SOP" },
  { id: "research", label: "Research Paper", icon: "🔬", desc: "Academic, scholarly tone" },
  { id: "cover_letter", label: "Cover Letter", icon: "💼", desc: "Professional, concise" },
  { id: "ielts", label: "IELTS / TOEFL Essay", icon: "📝", desc: "Exam-style writing" },
  { id: "business", label: "Business Writing", icon: "📊", desc: "Corporate communication" },
  { id: "general", label: "General Essay", icon: "✍️", desc: "Balanced, clear tone" },
];

const FORMALITY = ["Casual", "Neutral", "Formal", "Academic"];

export default function EssayBridge() {
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("nepali");
  const [targetLang, setTargetLang] = useState("english");
  const [purpose, setPurpose] = useState("general");
  const [formality, setFormality] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analyzing your essay...");

  const msgs = [
    "Analyzing your essay...",
    "Detecting cultural context...",
    "Adapting tone and formality...",
    "Polishing academic language...",
    "Finalizing your translation...",
  ];

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const wordCount = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
  const selectedPurpose = PURPOSES.find(p => p.id === purpose);

  const translate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `You are an expert essay translation and transformation engine.

Task:
- Source language: ${sourceLang}
- Target language: ${targetLang}
- Essay purpose: ${selectedPurpose?.label}
- Formality level: ${FORMALITY[formality]}

Essay:
"""
${inputText}
"""

Translate accurately, adapt cultural idioms naturally, match the tone to the purpose, and fix logical flow.

Respond ONLY in this exact JSON format with no markdown or backticks:
{
  "translatedEssay": "full translated and polished essay",
  "changes": ["change 1", "change 2", "change 3", "change 4", "change 5"],
  "culturalAdaptations": ["adaptation1", "adaptation2"],
  "scores": {
    "originalClarity": 72,
    "translatedClarity": 88,
    "academicTone": 82,
    "fluency": 91,
    "cohesion": 85
  },
  "summaryNote": "one sentence about the key transformation"
}`;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const clean = data.result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.translatedEssay) return;
    navigator.clipboard.writeText(result.translatedEssay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0a0a0f;color:#e8e4d9;font-family:'DM Sans',sans-serif;min-height:100vh;}
        .app{min-height:100vh;background:#0a0a0f;background-image:radial-gradient(ellipse 80% 50% at 20% -10%,rgba(193,150,74,0.08) 0%,transparent 60%);padding:0 0 60px;}
        .header{padding:28px 20px 20px;border-bottom:1px solid rgba(193,150,74,0.15);display:flex;align-items:flex-end;justify-content:space-between;}
        h1{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#e8e4d9;}
        h1 span{color:#c1964a;}
        .subtitle{font-size:0.7rem;color:rgba(232,228,217,0.4);letter-spacing:2px;text-transform:uppercase;margin-top:4px;font-family:'DM Mono',monospace;}
        .badge{background:rgba(193,150,74,0.1);border:1px solid rgba(193,150,74,0.25);color:#c1964a;font-family:'DM Mono',monospace;font-size:0.65rem;padding:4px 10px;border-radius:20px;letter-spacing:1px;}
        .main{max-width:900px;margin:0 auto;padding:28px 16px 0;}
        .section-label{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:2.5px;text-transform:uppercase;color:rgba(232,228,217,0.35);margin-bottom:10px;}
        .purpose-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px;}
        .purpose-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px 12px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px;}
        .purpose-card:hover{border-color:rgba(193,150,74,0.3);}
        .purpose-card.active{border-color:rgba(193,150,74,0.6);background:rgba(193,150,74,0.08);}
        .purpose-name{font-size:0.75rem;font-weight:600;color:#e8e4d9;}
        .purpose-desc{font-size:0.62rem;color:rgba(232,228,217,0.35);margin-top:2px;}
        .lang-row{display:flex;align-items:flex-end;gap:10px;margin-bottom:24px;}
        .lang-wrap{flex:1;}
        .lang-label{font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:2px;text-transform:uppercase;color:rgba(232,228,217,0.3);margin-bottom:6px;}
        select{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#e8e4d9;font-family:'DM Sans',sans-serif;font-size:0.82rem;padding:9px 12px;outline:none;appearance:none;}
        select:focus{border-color:rgba(193,150,74,0.5);}
        select option{background:#1a1a22;}
        .formality-row{margin-bottom:24px;}
        .formality-track{display:flex;gap:6px;margin-top:8px;}
        .formality-pill{flex:1;padding:7px 4px;border-radius:6px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);font-size:0.68rem;font-family:'DM Mono',monospace;color:rgba(232,228,217,0.4);cursor:pointer;text-align:center;transition:all 0.2s;}
        .formality-pill.active{border-color:rgba(193,150,74,0.5);background:rgba(193,150,74,0.1);color:#c1964a;}
        .col-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
        .col-title{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:2px;text-transform:uppercase;color:rgba(232,228,217,0.35);}
        .word-count{font-family:'DM Mono',monospace;font-size:0.6rem;color:rgba(232,228,217,0.25);}
        textarea{width:100%;min-height:200px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#e8e4d9;font-family:'DM Sans',sans-serif;font-size:0.875rem;line-height:1.7;padding:16px;outline:none;resize:vertical;margin-bottom:16px;}
        textarea:focus{border-color:rgba(193,150,74,0.3);}
        textarea::placeholder{color:rgba(232,228,217,0.2);}
        .translate-btn{width:100%;padding:14px;background:linear-gradient(135deg,#c1964a 0%,#a07834 100%);border:none;border-radius:12px;color:#0a0a0f;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.88rem;cursor:pointer;margin-bottom:24px;transition:all 0.2s;}
        .translate-btn:disabled{opacity:0.45;cursor:not-allowed;}
        .output-box{width:100%;min-height:200px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;font-family:'DM Sans',sans-serif;font-size:0.875rem;line-height:1.7;color:#e8e4d9;margin-bottom:10px;}
        .output-placeholder{color:rgba(232,228,217,0.18);font-style:italic;font-family:'Playfair Display',serif;}
        .output-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:160px;gap:14px;}
        .spinner{width:32px;height:32px;border:2px solid rgba(193,150,74,0.15);border-top-color:#c1964a;border-radius:50%;animation:spin 0.8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .loading-text{font-family:'DM Mono',monospace;font-size:0.7rem;color:rgba(193,150,74,0.6);animation:pulse 1.5s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        .action-row{display:flex;gap:8px;margin-bottom:24px;}
        .action-btn{flex:1;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:rgba(232,228,217,0.6);font-family:'DM Mono',monospace;font-size:0.68rem;cursor:pointer;transition:all 0.2s;text-align:center;}
        .action-btn:hover{border-color:rgba(193,150,74,0.3);color:#c1964a;}
        .insights{border:1px solid rgba(193,150,74,0.15);border-radius:12px;overflow:hidden;animation:fadeUp 0.4s ease;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .insights-header{background:rgba(193,150,74,0.06);padding:12px 16px;border-bottom:1px solid rgba(193,150,74,0.1);display:flex;align-items:center;gap:8px;}
        .insights-title{font-family:'Playfair Display',serif;font-style:italic;font-size:0.95rem;color:#c1964a;}
        .insights-body{padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .insight-section h4{font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:2px;text-transform:uppercase;color:rgba(232,228,217,0.35);margin-bottom:10px;}
        .change-item{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:0.78rem;line-height:1.5;color:rgba(232,228,217,0.75);}
        .change-dot{width:5px;height:5px;border-radius:50%;background:#c1964a;flex-shrink:0;margin-top:6px;}
        .score-item{margin-bottom:10px;}
        .score-label{display:flex;justify-content:space-between;font-size:0.72rem;color:rgba(232,228,217,0.5);margin-bottom:4px;font-family:'DM Mono',monospace;}
        .score-val{color:#c1964a;}
        .score-bar-bg{height:3px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;}
        .score-bar{height:3px;border-radius:4px;background:linear-gradient(90deg,#c1964a,#e8b86d);}
        .cultural-tag{display:inline-block;background:rgba(100,80,200,0.1);border:1px solid rgba(100,80,200,0.2);color:rgba(180,170,230,0.8);font-size:0.68rem;padding:2px 8px;border-radius:20px;margin:2px 3px 2px 0;font-family:'DM Mono',monospace;}
        .summary-note{margin-top:14px;padding:10px 12px;background:rgba(193,150,74,0.06);border:1px solid rgba(193,150,74,0.15);border-radius:8px;font-size:0.76rem;color:rgba(232,228,217,0.65);font-style:italic;line-height:1.6;}
        .error-msg{color:#e07070;font-size:0.78rem;font-family:'DM Mono',monospace;margin-bottom:16px;padding:10px 14px;background:rgba(200,80,80,0.08);border:1px solid rgba(200,80,80,0.15);border-radius:8px;}
        .copy-success{color:#4caf8a;font-size:0.68rem;font-family:'DM Mono',monospace;margin-left:6px;}
        @media(max-width:500px){.insights-body{grid-template-columns:1fr}.purpose-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div className="app">
        <div className="header">
          <div>
            <h1>Essay<span>Bridge</span></h1>
            <div className="subtitle">AI Essay Intelligence · Language Transformer</div>
          </div>
          <div className="badge">✦ Gemini AI</div>
        </div>

        <div className="main">
          <div className="section-label">Essay Purpose</div>
          <div className="purpose-grid">
            {PURPOSES.map(p => (
              <div key={p.id} className={`purpose-card ${purpose === p.id ? "active" : ""}`} onClick={() => setPurpose(p.id)}>
                <span style={{fontSize:"1rem"}}>{p.icon}</span>
                <div>
                  <div className="purpose-name">{p.label}</div>
                  <div className="purpose-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lang-row">
            <div className="lang-wrap">
              <div className="lang-label">From</div>
              <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div style={{color:"#c1964a",fontSize:"1.2rem",paddingBottom:"8px"}}>→</div>
            <div className="lang-wrap">
              <div className="lang-label">To</div>
              <select value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
          </div>

          <div className="formality-row">
            <div className="section-label">Formality Level</div>
            <div className="formality-track">
              {FORMALITY.map((f, i) => (
                <div key={f} className={`formality-pill ${formality === i ? "active" : ""}`} onClick={() => setFormality(i)}>{f}</div>
              ))}
            </div>
          </div>

          <div className="col-header">
            <span className="col-title">Your Essay</span>
            <span className="word-count">{wordCount(inputText)} words</span>
          </div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste or type your essay here in any language..."
          />

          {error && <div className="error-msg">⚠ {error}</div>}

          <button className="translate-btn" onClick={translate} disabled={loading || !inputText.trim()}>
            {loading ? "Transforming..." : `✦ Transform Essay → ${LANGUAGES.find(l => l.code === targetLang)?.label}`}
          </button>

          <div className="col-header">
            <span className="col-title">Transformed Essay {result && <span style={{color:"#c1964a"}}>✓</span>}</span>
            {result && <span className="word-count">{wordCount(result.translatedEssay)} words {copied && <span className="copy-success">✓ Copied!</span>}</span>}
          </div>
          <div className="output-box">
            {loading ? (
              <div className="output-loading">
                <div className="spinner"/>
                <div className="loading-text">{loadingMsg}</div>
              </div>
            ) : result ? (
              <div style={{whiteSpace:"pre-wrap"}}>{result.translatedEssay}</div>
            ) : (
              <div className="output-placeholder">Your transformed essay will appear here...</div>
            )}
          </div>

          {result && (
            <div className="action-row">
              <button className="action-btn" onClick={handleCopy}>⎘ Copy</button>
              <button className="action-btn" onClick={() => {
                const blob = new Blob([result.translatedEssay], {type:"text/plain"});
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "essaybridge-output.txt";
                a.click();
              }}>↓ Download</button>
            </div>
          )}

          {result && (
            <div className="insights">
              <div className="insights-header">
                <span>✦</span>
                <span className="insights-title">What EssayBridge improved</span>
              </div>
              <div className="insights-body">
                <div className="insight-section">
                  <h4>Improvements Made</h4>
                  {result.changes?.map((c, i) => (
                    <div key={i} className="change-item">
                      <div className="change-dot"/>
                      <span>{c}</span>
                    </div>
                  ))}
                  {result.culturalAdaptations?.length > 0 && (
                    <>
                      <h4 style={{marginTop:14}}>Cultural Adaptations</h4>
                      {result.culturalAdaptations.map((t, i) => <span key={i} className="cultural-tag">{t}</span>)}
                    </>
                  )}
                </div>
                <div className="insight-section">
                  <h4>Quality Scores</h4>
                  {result.scores && Object.entries({
                    "Clarity (before)": result.scores.originalClarity,
                    "Clarity (after)": result.scores.translatedClarity,
                    "Academic Tone": result.scores.academicTone,
                    "Fluency": result.scores.fluency,
                    "Cohesion": result.scores.cohesion,
                  }).map(([label, val]) => (
                    <div key={label} className="score-item">
                      <div className="score-label"><span>{label}</span><span className="score-val">{val}/100</span></div>
                      <div className="score-bar-bg"><div className="score-bar" style={{width:`${val}%`}}/></div>
                    </div>
                  ))}
                  {result.summaryNote && <div className="summary-note">{result.summaryNote}</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
      }

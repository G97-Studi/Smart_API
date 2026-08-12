import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest, ApiError } from "../api/client";

interface Props {
  // Called with the AI-generated text when the user accepts it.
  onApply: (suggestion: string) => void;
}

// Small AI-powered component (Milestone 5 bonus/required feature): takes a
// customer's informal complaint and asks the backend's /ai/suggest route
// (which itself calls an external AI API, or falls back if no key is
// configured) to turn it into a clean issue description. Displayed inline
// without leaving the page.
export default function AIDescriptionAssistant({ onApply }: Props) {
  const { token } = useAuth();
  const [rawInput, setRawInput] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!rawInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ suggestion: string; source: string }>("/ai/suggest", {
        method: "POST",
        body: { rawInput },
        token
      });
      setSuggestion(data.suggestion);
      setSource(data.source);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "AI suggestion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-box">
      <strong>AI issue description assistant</strong>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="Describe the problem in your own words..."
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
        />
        <button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? "Thinking..." : "Suggest"}
        </button>
      </div>
      {error && <div className="error-banner" style={{ marginTop: 8 }}>{error}</div>}
      {suggestion && (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: "4px 0" }}>{suggestion}</p>
          <small style={{ color: "#6b7280" }}>source: {source}</small>{" "}
          <button type="button" onClick={() => onApply(suggestion)}>Use this</button>
        </div>
      )}
    </div>
  );
}

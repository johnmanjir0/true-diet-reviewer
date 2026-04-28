"use client";
import { useEffect, useState } from "react";
import { History, X } from "lucide-react";

export interface HistoryItem {
  tool: "diet" | "beauty" | "health";
  name: string;
  riskLevel: string;
  date: string;
}

const STORAGE_KEY = "truereview_history";
const MAX_ITEMS = 5;

const riskColor: Record<string, string> = {
  "安全": "#16a34a",
  "要注意": "#d97706",
  "危険": "#dc2626",
};

export function saveHistory(item: Omit<HistoryItem, "date">) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  const history: HistoryItem[] = raw ? JSON.parse(raw) : [];
  const filtered = history.filter(h => !(h.tool === item.tool && h.name === item.name));
  const newHistory = [{ ...item, date: new Date().toLocaleDateString("ja-JP") }, ...filtered].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export default function AnalysisHistory({
  tool,
  onSelect,
}: {
  tool: "diet" | "beauty" | "health";
  onSelect: (name: string) => void;
}) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const all: HistoryItem[] = JSON.parse(raw);
      setHistory(all.filter(h => h.tool === tool));
    }
  }, [tool]);

  const remove = (name: string) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const all: HistoryItem[] = JSON.parse(raw);
    const updated = all.filter(h => !(h.tool === tool && h.name === name));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated.filter(h => h.tool === tool));
  };

  if (history.length === 0) return null;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#94a3b8", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <History size={14} /> 最近の解析履歴
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {history.map(h => (
          <div key={h.name} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "99px", padding: "0.3rem 0.6rem 0.3rem 0.8rem", fontSize: "0.8rem" }}>
            <button
              onClick={() => onSelect(h.name)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#334155", fontWeight: "600", padding: 0 }}
            >
              {h.name}
            </button>
            <span style={{ fontSize: "0.7rem", fontWeight: "800", color: riskColor[h.riskLevel] || "#64748b", marginLeft: "0.2rem" }}>
              {h.riskLevel}
            </span>
            <button
              onClick={() => remove(h.name)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "0 2px", display: "flex", alignItems: "center" }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

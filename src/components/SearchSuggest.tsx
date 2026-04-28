"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTIONS: Record<string, string[]> = {
  diet: [
    "ナイシトール", "防風通聖散", "カロリミット", "メタバリアEX", "シボヘール",
    "大人のカロリミット", "内脂サポート", "ビセラ", "ラクビ", "キラリ麹の炭クレンズ",
    "コンブチャクレンズ", "マイプロテイン", "ザバス", "賢者の食卓", "糖質ぱっくん",
    "ベルタ酵素", "スリモア", "優光泉", "ベジバリア", "トリプルカッター",
  ],
  beauty: [
    "ポーラ BA クリーム", "SKII フェイシャルトリートメントエッセンス", "エスティローダー アドバンス",
    "オルビス", "ファンケル", "ドクターシーラボ", "ランコム ジェニフィック",
    "コーセー コスメデコルテ", "ちふれ", "なめらか本舗", "ハーバー",
    "アクアレーベル", "キュレル", "ニベア Q10", "マキアージュ",
    "DHC オリーブバージンオイル", "無印良品 化粧水", "ロゼット 洗顔パスタ",
  ],
  health: [
    "ロキソニン", "バファリン", "イブ", "ロートアルガード",
    "コーヒー と 睡眠薬", "ロキソニン と 胃薬",
    "血圧の薬 と グレープフルーツ", "ワーファリン と 納豆",
    "ロキソニン と 抗凝固薬", "マグネシウム と 鉄剤",
    "ビタミンC と 鉄剤", "カルシウム と マグネシウム",
    "セントジョーンズワート と 薬", "コエンザイムQ10", "ナットウキナーゼ",
  ],
};

export default function SearchSuggest({
  tool,
  value,
  onChange,
  placeholder,
  onSubmit,
}: {
  tool: "diet" | "beauty" | "health";
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onSubmit?: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value.length >= 1
    ? SUGGESTIONS[tool].filter(s => s.includes(value)).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (s: string) => {
    onChange(s);
    setOpen(false);
    onSubmit?.(s);
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="search-input"
        style={{ paddingLeft: "1.5rem" }}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          zIndex: 100,
          overflow: "hidden",
        }}>
          {filtered.map(s => (
            <button
              key={s}
              onMouseDown={() => select(s)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.8rem 1.2rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                color: "#334155",
                borderBottom: "1px solid #f1f5f9",
                transition: "background 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#f0f9ff")}
              onMouseOut={e => (e.currentTarget.style.background = "none")}
            >
              🔍 {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

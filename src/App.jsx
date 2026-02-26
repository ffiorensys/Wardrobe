import { useState, useRef, useCallback } from "react";

const CATEGORIES = ["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories", "Dresses"];
const CATEGORY_ICONS = {
  Tops: "👕", Bottoms: "👖", Shoes: "👟", Outerwear: "🧥", Accessories: "👜", Dresses: "👗",
};
const FORMALITY_OPTIONS = ["Casual", "Business Casual", "Semi-formal", "Formal"];
const FIT_OPTIONS = ["Fitted", "Regular", "Loose", "Oversized"];

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────

const COLOR_TEMPERATURE = {
  warm: ["red","orange","yellow","coral","peach","terracotta","rust","gold","amber","cream","beige","tan","camel","brown","burgundy","wine","magenta","pink","salmon"],
  cool: ["blue","navy","teal","cyan","turquoise","mint","green","purple","violet","lavender","lilac","grey","silver","white","indigo","cobalt"],
  neutral: ["black","white","grey","gray","beige","cream","ivory","nude","camel","tan","brown","khaki","navy"],
};

function getColorTemp(color) {
  const c = (color || "").toLowerCase();
  if (COLOR_TEMPERATURE.neutral.some(n => c.includes(n))) return "neutral";
  if (COLOR_TEMPERATURE.warm.some(n => c.includes(n))) return "warm";
  if (COLOR_TEMPERATURE.cool.some(n => c.includes(n))) return "cool";
  return "neutral";
}

function isNeutral(color) {
  const c = (color || "").toLowerCase();
  return COLOR_TEMPERATURE.neutral.some(n => c.includes(n));
}

// ─── SCORING FUNCTIONS ────────────────────────────────────────────────────────

function scoreColorCombination(items) {
  const colors = items.map(i => i.color).filter(Boolean);
  if (colors.length === 0) return { score: 5, scheme: "Unknown", tip: "" };

  const uniqueColors = [...new Set(colors.map(c => c.toLowerCase()))];
  const neutralCount = uniqueColors.filter(isNeutral).length;
  const nonNeutral = uniqueColors.filter(c => !isNeutral(c));

  if (uniqueColors.length > 3)
    return { score: 3, scheme: "Too many colors", tip: "Reduce to max 3 colors (60-30-10 rule)" };

  if (uniqueColors.length === 1)
    return { score: 8, scheme: "Monochromatic", tip: "Elegant monochromatic look — try varying textures for depth" };

  if (neutralCount >= uniqueColors.length - 1 && nonNeutral.length <= 1)
    return { score: 10, scheme: "Neutral + Accent", tip: "Perfect base! Neutrals with one accent follow the 60-30-10 rule" };

  if (neutralCount === uniqueColors.length)
    return { score: 9, scheme: "All Neutrals", tip: "Clean and versatile. Add a color accent accessory to elevate the look" };

  const temps = uniqueColors.map(getColorTemp);
  const allSameTemp = temps.every(t => t === temps[0]);
  if (uniqueColors.length <= 3 && allSameTemp)
    return { score: 8, scheme: "Analogous", tip: "Harmonious analogous palette — looks natural and well-coordinated" };

  if (uniqueColors.length === 2)
    return { score: 7, scheme: "Two-Color", tip: "Clean two-color combination. Consider if they're complementary or analogous" };

  return { score: 6, scheme: "Mixed", tip: "Check that colors share similar saturation levels for a cohesive look" };
}

function scoreVolumeBalance(items) {
  const tops = items.filter(i => i.category === "Tops" || i.category === "Dresses");
  const bottoms = items.filter(i => i.category === "Bottoms");

  if (tops.length > 0 && bottoms.length > 0) {
    const topFitted = tops.some(t =>
      ["fitted","slim","crop","tight"].some(f => (t.description || "").toLowerCase().includes(f))
    );
    const bottomLoose = bottoms.some(b =>
      ["wide","flare","loose","relaxed","baggy"].some(f => (b.description || "").toLowerCase().includes(f))
    );
    const topLoose = tops.some(t =>
      ["oversized","loose","boxy","relaxed"].some(f => (t.description || "").toLowerCase().includes(f))
    );
    const bottomFitted = bottoms.some(b =>
      ["slim","skinny","fitted","straight"].some(f => (b.description || "").toLowerCase().includes(f))
    );

    if ((topFitted && bottomLoose) || (topLoose && bottomFitted))
      return { score: 10, tip: "Great volume balance! Fitted top + loose bottom (or vice versa) follows the golden proportion rule" };
  }

  return { score: 7, tip: "Balance volumes: pair a fitted piece with a looser one for ideal proportions" };
}

function checkFormalityAlignment(items) {
  const formalityMap = { Casual: 1, "Business Casual": 2, "Semi-formal": 3, Formal: 4 };
  const levels = items.map(i => formalityMap[i.formality]).filter(Boolean);
  if (levels.length < 2) return { ok: true, tip: "" };
  const min = Math.min(...levels), max = Math.max(...levels);
  if (max - min > 1)
    return { ok: false, tip: "⚠ Formality mismatch: pieces span more than one dress code level" };
  return { ok: true, tip: "" };
}

function scoreTextures(items) {
  const materials = items.map(i => i.material).filter(Boolean);
  const unique = [...new Set(materials.map(m => m.toLowerCase()))];
  if (unique.length >= 2) return { score: 10, tip: "Great texture mix — creates visual depth and interest" };
  if (unique.length === 1) return { score: 6, tip: "Mix textures (e.g. soft + structured, matte + shiny) for more visual depth" };
  return { score: 5, tip: "Add material info to your items for better texture recommendations" };
}

function hasThirdElement(items) {
  return items.some(i => i.category === "Outerwear") || items.some(i => i.category === "Accessories");
}

function scoreOutfit(items) {
  const colorResult = scoreColorCombination(items);
  const volumeResult = scoreVolumeBalance(items);
  const textureResult = scoreTextures(items);
  const formalityResult = checkFormalityAlignment(items);
  const thirdEl = hasThirdElement(items);

  const total = Math.round(
    colorResult.score * 0.30 +
    volumeResult.score * 0.25 +
    (formalityResult.ok ? 10 : 5) * 0.20 +
    textureResult.score * 0.10 +
    (thirdEl ? 10 : 6) * 0.05 +
    7 * 0.10
  );

  const tips = [colorResult.tip, volumeResult.tip, textureResult.tip, formalityResult.tip].filter(Boolean);
  if (!thirdEl)
    tips.push("Add a jacket, scarf, or statement accessory as your 'third element' to elevate the look");

  return { score: Math.min(10, total), colorScheme: colorResult.scheme, tips };
}

// ─── OUTFIT GENERATION ────────────────────────────────────────────────────────

function generateScoredOutfits(clothes, prompt) {
  const byCategory = {};
  clothes.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
  const occasions = ["Casual Day Out", "Work", "Weekend Brunch", "Evening Out", "Day Off"];
  const vibes = [
    "Effortless & comfortable",
    "Polished & curated",
    "Relaxed with intention",
    "Confident & put-together",
    "Fresh & modern",
  ];

  const attempts = [];

  for (let i = 0; i < 20; i++) {
    const outfitItems = [];

    if (byCategory.Dresses?.length > 0 && Math.random() > 0.65) {
      outfitItems.push(getRandom(byCategory.Dresses));
    } else {
      if (byCategory.Tops?.length > 0) outfitItems.push(getRandom(byCategory.Tops));
      if (byCategory.Bottoms?.length > 0) outfitItems.push(getRandom(byCategory.Bottoms));
    }

    if (byCategory.Shoes?.length > 0) outfitItems.push(getRandom(byCategory.Shoes));
    if (byCategory.Outerwear?.length > 0 && Math.random() > 0.45) outfitItems.push(getRandom(byCategory.Outerwear));
    if (byCategory.Accessories?.length > 0 && Math.random() > 0.35) outfitItems.push(getRandom(byCategory.Accessories));

    if (outfitItems.length >= 2) {
      const scored = scoreOutfit(outfitItems);
      attempts.push({ items: outfitItems, ...scored });
    }
  }

  attempts.sort((a, b) => b.score - a.score);

  const picked = [];
  const usedSigs = new Set();
  for (const a of attempts) {
    const sig = a.items.map(i => i.id || i.name).sort().join("|");
    if (!usedSigs.has(sig)) {
      usedSigs.add(sig);
      picked.push(a);
      if (picked.length === 2) break;
    }
  }

  return picked.map((p, i) => ({
    title: `Look ${i + 1}`,
    occasion: prompt.trim() || getRandom(occasions),
    vibe: getRandom(vibes),
    score: p.score,
    colorScheme: p.colorScheme,
    stylingTips: p.tips,
    items: p.items.map(item => ({
      name: item.name,
      category: item.category,
      imageUrl: item.imageUrl || null,
    })),
  }));
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  const color = score >= 8 ? "#4CAF50" : score >= 6 ? "#D4AF37" : "#E57373";
  const label = score >= 8 ? "Great Match" : score >= 6 ? "Good Match" : "Needs Work";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        border: `2px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Space Mono', monospace", fontSize: "11px",
        color, fontWeight: "700",
      }}>{score}</div>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: "9px",
        color, letterSpacing: "1.5px",
      }}>{label.toUpperCase()}</span>
    </div>
  );
}

function OutfitCard({ outfit, index, onDelete }) {
  const [showTips, setShowTips] = useState(false);

  return (
    <div
      style={{
        background: "#1a1a1f", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px", padding: "20px", marginBottom: "16px",
        transition: "all 0.3s ease",
        animation: `fadeSlideIn 0.5s ease ${index * 0.1}s both`,
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.3)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,255,255,0.08)";
        const btn = e.currentTarget.querySelector(".delete-outfit-btn");
        if (btn) btn.style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
        const btn = e.currentTarget.querySelector(".delete-outfit-btn");
        if (btn) btn.style.opacity = "0";
      }}
    >
      {/* Delete button */}
      <button
        className="delete-outfit-btn"
        onClick={e => { e.stopPropagation(); onDelete(index); }}
        style={{
          position: "absolute", top: "12px", right: "12px",
          background: "rgba(0,0,0,0.8)", border: "none",
          color: "rgba(255,100,100,0.9)", borderRadius: "50%",
          width: "32px", height: "32px", cursor: "pointer",
          fontSize: "16px", opacity: 0, transition: "opacity 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10, fontWeight: "bold",
        }}
      >✕</button>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "14px",
        flexWrap: "wrap", gap: "10px",
      }}>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "10px",
            letterSpacing: "2px", color: "rgba(212,175,55,0.6)", marginBottom: "4px",
          }}>
            LOOK {String(index + 1).padStart(2, "0")} · {outfit.colorScheme?.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
            {outfit.occasion} — <em>{outfit.vibe}</em>
          </div>
        </div>
        {outfit.score && <ScoreBadge score={outfit.score} />}
      </div>

      {/* Item images */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
        {outfit.items?.map((item, i) => (
          <div key={i}>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                title={item.name}
                style={{
                  width: "110px", height: "110px", objectFit: "cover",
                  borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s ease", cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,175,55,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            ) : (
              <div style={{
                width: "110px", height: "110px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "6px",
              }}>
                <span style={{ fontSize: "32px" }}>{CATEGORY_ICONS[item.category] || "✦"}</span>
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: "10px",
                  color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "0 6px",
                }}>{item.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Styling tips */}
      {outfit.stylingTips?.length > 0 && (
        <div>
          <button
            onClick={() => setShowTips(v => !v)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'Space Mono', monospace", fontSize: "9px",
              letterSpacing: "2px", color: "rgba(212,175,55,0.6)",
              padding: "0", display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            {showTips ? "▲" : "▼"} STYLING TIPS ({outfit.stylingTips.length})
          </button>
          {showTips && (
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {outfit.stylingTips.map((tip, i) => (
                <div key={i} style={{
                  background: "rgba(212,175,55,0.06)", borderRadius: "8px",
                  padding: "10px 14px", borderLeft: "2px solid rgba(212,175,55,0.4)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                }}>{tip}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClothingCard({ item, onDelete }) {
  return (
    <div
      style={{
        position: "relative", background: "#1a1a1f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", overflow: "hidden", transition: "all 0.25s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.3)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,255,255,0.08)";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "0";
      }}
    >
      <div style={{
        height: "140px", background: "rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: "40px", opacity: 0.6 }}>{CATEGORY_ICONS[item.category] || "✦"}</span>
        }
        <button
          className="delete-btn"
          onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          style={{
            position: "absolute", top: "8px", right: "8px",
            background: "rgba(0,0,0,0.7)", border: "none",
            color: "rgba(200,60,60,0.8)", borderRadius: "50%",
            width: "26px", height: "26px", cursor: "pointer",
            fontSize: "12px", opacity: 0, transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.85)",
          fontSize: "13px", fontWeight: "500", marginBottom: "4px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{item.name}</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "1px" }}>
            {item.category.toUpperCase()}
          </span>
          {item.color && (
            <span style={{ fontFamily: "'Space Mono', monospace", color: "rgba(212,175,55,0.5)", fontSize: "10px" }}>
              · {item.color}
            </span>
          )}
          {item.formality && (
            <span style={{ fontFamily: "'Space Mono', monospace", color: "rgba(150,180,255,0.4)", fontSize: "10px" }}>
              · {item.formality}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [clothes, setClothes] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [activeTab, setActiveTab] = useState("wardrobe");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState({
    name: "", category: "Tops", color: "", description: "",
    material: "", formality: "Casual", fit: "Regular", imageUrl: "",
  });
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => setNewItem(prev => ({ ...prev, imageUrl: e.target.result }));
    reader.readAsDataURL(file);
  }, []);

  const addClothingItem = () => {
    if (!newItem.name.trim()) return;
    setClothes(prev => [...prev, { ...newItem, id: Date.now() + Math.random() }]);
    setNewItem({ name: "", category: "Tops", color: "", description: "", material: "", formality: "Casual", fit: "Regular", imageUrl: "" });
    setAddingItem(false);
  };

  const deleteItem = id => setClothes(prev => prev.filter(c => c.id !== id));
  const deleteOutfit = index => setOutfits(prev => prev.filter((_, i) => i !== index));

  const generateOutfits = async () => {
    if (clothes.length < 2) { setError("Add at least 2 items to generate outfits!"); return; }
    setError(""); setIsGenerating(true); setActiveTab("outfits");
    await new Promise(r => setTimeout(r, 1500));
    try {
      const generated = generateScoredOutfits(clothes, prompt);
      setOutfits(prev => [...generated, ...prev]);
    } catch {
      setError("Couldn't generate outfits. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredClothes = activeCategory === "All"
    ? clothes
    : clothes.filter(c => c.category === activeCategory);

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = clothes.filter(c => c.category === cat).length;
    return acc;
  }, {});

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
    padding: "10px 14px", color: "#fff", fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
  };

  const labelStyle = {
    fontFamily: "'Space Mono', monospace", fontSize: "10px",
    letterSpacing: "2px", color: "rgba(255,255,255,0.4)",
    display: "block", marginBottom: "6px",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0C",
      fontFamily: "'DM Sans', sans-serif", color: "#fff",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 40% at 50% -10%, rgba(212,175,55,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 90% 80%, rgba(180,140,30,0.1) 0%, transparent 50%)
        `,
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }
        input, select, textarea { outline: none; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a1f; }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 60px", position: "relative", zIndex: 1 }}>

        {/* ── Header ────────────────────────────────── */}
        <div style={{ padding: "48px 0 32px", animation: "fadeSlideIn 0.6s ease both" }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", color: "#D4AF37",
            fontSize: "11px", letterSpacing: "4px", marginBottom: "12px",
          }}>✦ AI STYLIST</div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 6vw, 56px)", fontWeight: "900",
            margin: "0 0 8px 0", lineHeight: "1.05", letterSpacing: "-1px",
            background: "linear-gradient(135deg, #fff 30%, rgba(212,175,55,0.8) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Your Wardrobe,{"\n"}Reimagined.</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px", margin: 0 }}>
            Upload your clothes — let AI style them with real fashion criteria
          </p>
        </div>

        {/* ── Stats strip ───────────────────────────── */}
        {clothes.length > 0 && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap", animation: "fadeIn 0.5s ease 0.2s both" }}>
            {[
              { label: "PIECES", value: clothes.length },
              { label: "CATEGORIES", value: Object.values(categoryCounts).filter(v => v > 0).length },
              { label: "LOOKS", value: outfits.length },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "12px 20px",
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#D4AF37", lineHeight: 1, marginBottom: "4px" }}>{stat.value}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tabs ──────────────────────────────────── */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "28px",
          background: "rgba(255,255,255,0.03)", borderRadius: "12px",
          padding: "4px", border: "1px solid rgba(255,255,255,0.06)", width: "fit-content",
        }}>
          {["wardrobe", "outfits"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? "rgba(212,175,55,0.15)" : "transparent",
              border: activeTab === tab ? "1px solid rgba(212,175,55,0.3)" : "1px solid transparent",
              color: activeTab === tab ? "#D4AF37" : "rgba(255,255,255,0.4)",
              borderRadius: "8px", padding: "8px 20px", cursor: "pointer",
              fontFamily: "'Space Mono', monospace", fontSize: "11px",
              letterSpacing: "2px", transition: "all 0.2s ease",
            }}>
              {tab.toUpperCase()}
              {tab === "outfits" && outfits.length > 0 && (
                <span style={{
                  marginLeft: "6px", background: "#D4AF37", color: "#1a1a1f",
                  borderRadius: "10px", padding: "1px 7px", fontSize: "10px", fontWeight: "700",
                }}>{outfits.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ══ WARDROBE TAB ══════════════════════════════════════════════════════ */}
        {activeTab === "wardrobe" && (
          <div style={{ animation: "fadeIn 0.3s ease both" }}>

            {/* Add item form */}
            {addingItem ? (
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "16px", padding: "24px", marginBottom: "24px",
                animation: "fadeSlideIn 0.3s ease both",
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", margin: "0 0 20px", fontSize: "18px", color: "#fff" }}>
                  Add New Item
                </h3>

                {/* Image drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px", height: "120px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", marginBottom: "16px", transition: "all 0.2s",
                    background: newItem.imageUrl ? "none" : "rgba(255,255,255,0.02)",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {newItem.imageUrl
                    ? <img src={newItem.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "6px" }}>📸</div>
                        <div style={{ fontFamily: "'DM Sans'", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                          Drop photo or click to upload
                        </div>
                      </div>
                  }
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => handleFileUpload(e.target.files[0])} />

                {/* Fields grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>ITEM NAME *</label>
                    <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. White linen shirt"
                      onKeyDown={e => e.key === "Enter" && addClothingItem()} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>CATEGORY</label>
                    <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                      style={{ ...inputStyle, background: "#1a1a1f", cursor: "pointer" }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>COLOR (specific)</label>
                    <input value={newItem.color} onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))}
                      placeholder="e.g. Navy blue, coral, ivory" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>MATERIAL / TEXTURE</label>
                    <input value={newItem.material} onChange={e => setNewItem(p => ({ ...p, material: e.target.value }))}
                      placeholder="e.g. Cotton, silk, denim, wool" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>FORMALITY LEVEL</label>
                    <select value={newItem.formality} onChange={e => setNewItem(p => ({ ...p, formality: e.target.value }))}
                      style={{ ...inputStyle, background: "#1a1a1f", cursor: "pointer" }}>
                      {FORMALITY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>FIT / SILHOUETTE</label>
                    <select value={newItem.fit} onChange={e => setNewItem(p => ({ ...p, fit: e.target.value }))}
                      style={{ ...inputStyle, background: "#1a1a1f", cursor: "pointer" }}>
                      {FIT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>ADDITIONAL DETAILS</label>
                    <input value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                      placeholder="e.g. Wide leg, cropped, floral pattern, A-line..." style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={addClothingItem} style={{
                    background: "linear-gradient(135deg, #D4AF37, rgba(180,140,30,0.95))",
                    color: "#1a1a1f", border: "none", borderRadius: "10px",
                    padding: "11px 24px", cursor: "pointer", fontWeight: "700",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                  }}>Add to Wardrobe</button>
                  <button onClick={() => {
                    setAddingItem(false);
                    setNewItem({ name: "", category: "Tops", color: "", description: "", material: "", formality: "Casual", fit: "Regular", imageUrl: "" });
                  }} style={{
                    background: "transparent", color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                    padding: "11px 20px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingItem(true)} style={{
                width: "100%", background: "rgba(212,175,55,0.06)",
                border: "1.5px dashed rgba(212,175,55,0.3)", borderRadius: "14px",
                padding: "20px", cursor: "pointer", color: "rgba(212,175,55,0.7)",
                fontFamily: "'Space Mono', monospace", fontSize: "12px",
                letterSpacing: "2px", marginBottom: "24px", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,175,55,0.06)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; }}
              >
                <span style={{ fontSize: "16px" }}>+</span> ADD CLOTHING ITEM
              </button>
            )}

            {/* Category filter pills */}
            {clothes.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
                  YOUR WARDROBE BY CATEGORY
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["All", ...CATEGORIES.filter(c => categoryCounts[c] > 0)].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                      background: activeCategory === cat ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                      border: activeCategory === cat ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      color: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.4)",
                      borderRadius: "20px", padding: "8px 16px", cursor: "pointer",
                      fontFamily: "'Space Mono', monospace", fontSize: "10px",
                      letterSpacing: "1.5px", transition: "all 0.15s ease",
                    }}>
                      <span style={{ fontSize: "14px", marginRight: "6px" }}>{CATEGORY_ICONS[cat] || "✦"}</span>
                      {cat.toUpperCase()}
                      {cat !== "All" && (
                        <span style={{
                          marginLeft: "8px",
                          background: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.15)",
                          color: activeCategory === cat ? "#1a1a1f" : "rgba(255,255,255,0.45)",
                          borderRadius: "10px", padding: "2px 6px", fontSize: "9px", fontWeight: "700",
                        }}>{categoryCounts[cat]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clothes grid */}
            {clothes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>👗</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "rgba(255,255,255,0.25)", margin: "0 0 8px" }}>
                  Your wardrobe is empty
                </p>
                <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px", margin: 0 }}>
                  Add your first piece — include color, material and fit for smarter outfit scoring
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                {filteredClothes.map(item => (
                  <ClothingCard key={item.id} item={item} onDelete={deleteItem} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ OUTFITS TAB ══════════════════════════════════════════════════════ */}
        {activeTab === "outfits" && (
          <div style={{ animation: "fadeIn 0.3s ease both" }}>

            {/* Existing looks */}
            {!isGenerating && outfits.length > 0 && (
              <>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
                  YOUR CURATED LOOKS
                </div>
                {outfits.map((outfit, i) => (
                  <OutfitCard key={i} outfit={outfit} index={i} onDelete={deleteOutfit} />
                ))}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "32px 0" }} />
              </>
            )}

            {/* Generate section */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px", padding: "20px", marginBottom: "24px",
            }}>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px" }}>
                OCCASION OR STYLE (OPTIONAL)
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. Business casual, first date, beach vacation..."
                  onKeyDown={e => e.key === "Enter" && generateOutfits()}
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                    padding: "12px 16px", color: "#fff", fontSize: "14px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={generateOutfits}
                  disabled={isGenerating || clothes.length < 2}
                  style={{
                    background: isGenerating || clothes.length < 2
                      ? "rgba(212,175,55,0.15)"
                      : "linear-gradient(135deg, #D4AF37, rgba(180,140,30,0.95))",
                    color: isGenerating || clothes.length < 2 ? "rgba(255,255,255,0.3)" : "#1a1a1f",
                    border: "none", borderRadius: "10px", padding: "12px 24px",
                    cursor: isGenerating || clothes.length < 2 ? "not-allowed" : "pointer",
                    fontFamily: "'Space Mono', monospace", fontSize: "11px",
                    letterSpacing: "1.5px", fontWeight: "700", whiteSpace: "nowrap",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  {isGenerating
                    ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>STYLING...</>
                    : "✦ GENERATE LOOKS"
                  }
                </button>
              </div>
              {error && <p style={{ color: "rgba(200,60,60,0.8)", fontSize: "13px", margin: "10px 0 0", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: "10px 0 0", letterSpacing: "1.5px" }}>
                OUTFITS SCORED ON: COLOR HARMONY · VOLUME BALANCE · FORMALITY · TEXTURE MIX · THIRD ELEMENT
              </p>
            </div>

            {/* Loading */}
            {isGenerating && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "12px", animation: "shimmer 1.5s ease-in-out infinite" }}>
                  Analyzing your wardrobe...
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", color: "rgba(212,175,55,0.4)", fontSize: "11px", letterSpacing: "3px" }}>
                  APPLYING FASHION CRITERIA
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isGenerating && outfits.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.2 }}>✦</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "rgba(255,255,255,0.2)", margin: "0 0 8px" }}>No looks yet</p>
                <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px", margin: 0 }}>
                  {clothes.length < 2 ? "Add at least 2 items to your wardrobe first" : "Hit Generate Looks to get styled"}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

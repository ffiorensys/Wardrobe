import { useState, useRef, useCallback } from "react";

const CATEGORIES = ["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories", "Dresses"];

const CATEGORY_ICONS = {
  Tops: "👕",
  Bottoms: "👖",
  Shoes: "👟",
  Outerwear: "🧥",
  Accessories: "👜",
  Dresses: "👗",
};

function OutfitCard({ outfit, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        animation: `fadeSlideIn 0.5s ease ${index * 0.1}s both`,
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.4)";
        e.currentTarget.style.background = "rgba(212,175,55,0.04)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{
              background: "rgba(212,175,55,0.15)",
              color: "#D4AF37",
              fontSize: "11px",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "2px",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid rgba(212,175,55,0.3)",
            }}>LOOK {String(index + 1).padStart(2, "0")}</span>
            {outfit.occasion && (
              <span style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "1px",
                padding: "4px 10px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>{outfit.occasion}</span>
            )}
          </div>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "22px",
            fontWeight: "700",
            color: "#fff",
            margin: "0 0 6px 0",
            letterSpacing: "0.5px",
          }}>{outfit.title}</h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.45)",
            fontSize: "14px",
            margin: 0,
            lineHeight: "1.5",
          }}>{outfit.vibe}</p>
        </div>
        <span style={{
          color: "rgba(212,175,55,0.6)",
          fontSize: "18px",
          transition: "transform 0.3s ease",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          marginLeft: "16px",
        }}>▾</span>
      </div>

      {expanded && (
        <div style={{
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {outfit.items && outfit.items.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "10px",
                padding: "10px 14px",
              }}>
                <span style={{ fontSize: "18px" }}>{CATEGORY_ICONS[item.category] || "✦"}</span>
                <div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}>{item.name}</div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "11px",
                    letterSpacing: "1px",
                  }}>{item.category.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
          {outfit.styling_tip && (
            <div style={{
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: "10px",
              padding: "12px 16px",
            }}>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                color: "#D4AF37",
                fontSize: "10px",
                letterSpacing: "2px",
                display: "block",
                marginBottom: "6px",
              }}>STYLING TIP</span>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                margin: 0,
                lineHeight: "1.6",
              }}>{outfit.styling_tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClothingCard({ item, onDelete }) {
  return (
    <div style={{
      position: "relative",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.25s ease",
      animation: "fadeSlideIn 0.4s ease both",
      group: true,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "0";
      }}
    >
      <div style={{
        height: "140px",
        background: "rgba(255,255,255,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "40px", opacity: 0.6 }}>{CATEGORY_ICONS[item.category] || "✦"}</span>
        )}
        <button
          className="delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          style={{
            position: "absolute", top: "8px", right: "8px",
            background: "rgba(0,0,0,0.7)", border: "none",
            color: "rgba(255,100,100,0.8)", borderRadius: "50%",
            width: "26px", height: "26px", cursor: "pointer",
            fontSize: "12px", opacity: 0, transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(255,255,255,0.8)",
          fontSize: "13px",
          fontWeight: "500",
          marginBottom: "4px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{item.name}</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            color: "rgba(255,255,255,0.3)",
            fontSize: "10px",
            letterSpacing: "1px",
          }}>{item.category.toUpperCase()}</span>
          {item.color && (
            <span style={{
              fontFamily: "'Space Mono', monospace",
              color: "rgba(212,175,55,0.5)",
              fontSize: "10px",
              letterSpacing: "1px",
            }}>· {item.color}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WardrobeApp() {
  const [clothes, setClothes] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [activeTab, setActiveTab] = useState("wardrobe");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState({ name: "", category: "Tops", color: "", description: "", imageUrl: "" });
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewItem(prev => ({ ...prev, imageUrl: e.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const addClothingItem = () => {
    if (!newItem.name.trim()) return;
    const item = {
      ...newItem,
      id: Date.now() + Math.random(),
    };
    setClothes(prev => [...prev, item]);
    setNewItem({ name: "", category: "Tops", color: "", description: "", imageUrl: "" });
    setAddingItem(false);
  };

  const deleteItem = (id) => {
    setClothes(prev => prev.filter(c => c.id !== id));
  };

  const generateOutfits = async () => {
    if (clothes.length < 2) {
      setError("Add at least 2 items to generate outfits!");
      return;
    }
    setError("");
    setIsGenerating(true);
    setActiveTab("outfits");

    const wardrobeDesc = clothes.map(c =>
      `- ${c.name} (${c.category}${c.color ? `, ${c.color}` : ""}${c.description ? `, ${c.description}` : ""})`
    ).join("\n");

    const userPrompt = prompt.trim()
      ? `Occasion/style request: ${prompt}\n\n`
      : "";

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a professional fashion stylist. Here is someone's wardrobe:\n\n${wardrobeDesc}\n\n${userPrompt}Create 3 stylish outfit combinations from these items. Return ONLY a JSON array with no markdown or extra text, using this exact structure:\n[\n  {\n    "title": "Outfit name",\n    "occasion": "Casual / Work / Evening / etc.",\n    "vibe": "One-line mood/aesthetic description",\n    "items": [\n      { "name": "exact item name from wardrobe", "category": "category" }\n    ],\n    "styling_tip": "One practical styling tip"\n  }\n]\n\nOnly use items from the provided wardrobe. Make outfits cohesive and fashionable.`,
          }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setOutfits(parsed);
    } catch (err) {
      setError("Couldn't generate outfits. Please try again.");
      console.error(err);
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0C",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background ambient */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 40% at 50% -10%, rgba(212,175,55,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 90% 80%, rgba(180,120,40,0.05) 0%, transparent 50%)
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
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); border-radius: 4px; }
        input, select, textarea { outline: none; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 60px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          padding: "48px 0 32px",
          animation: "fadeSlideIn 0.6s ease both",
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            color: "#D4AF37",
            fontSize: "11px",
            letterSpacing: "4px",
            marginBottom: "12px",
            opacity: 0.8,
          }}>✦ AI STYLIST</div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: "900",
            margin: "0 0 8px 0",
            lineHeight: "1.05",
            letterSpacing: "-1px",
            background: "linear-gradient(135deg, #fff 30%, rgba(212,175,55,0.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Your Wardrobe,{"\n"}Reimagined.</h1>
          <p style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "15px",
            margin: 0,
            fontWeight: "400",
            letterSpacing: "0.2px",
          }}>Upload your clothes — let AI style them for any occasion</p>
        </div>

        {/* Stats strip */}
        {clothes.length > 0 && (
          <div style={{
            display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap",
            animation: "fadeIn 0.5s ease 0.2s both",
          }}>
            {[
              { label: "PIECES", value: clothes.length },
              { label: "CATEGORIES", value: Object.values(categoryCounts).filter(v => v > 0).length },
              { label: "LOOKS", value: outfits.length },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                padding: "12px 20px",
                minWidth: "90px",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#D4AF37",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.3)",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "4px",
          marginBottom: "28px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          padding: "4px",
          border: "1px solid rgba(255,255,255,0.06)",
          width: "fit-content",
        }}>
          {["wardrobe", "outfits"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? "rgba(212,175,55,0.15)" : "transparent",
              border: activeTab === tab ? "1px solid rgba(212,175,55,0.3)" : "1px solid transparent",
              color: activeTab === tab ? "#D4AF37" : "rgba(255,255,255,0.4)",
              borderRadius: "8px",
              padding: "8px 20px",
              cursor: "pointer",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              letterSpacing: "2px",
              transition: "all 0.2s ease",
            }}>
              {tab.toUpperCase()}
              {tab === "outfits" && outfits.length > 0 && (
                <span style={{
                  marginLeft: "6px",
                  background: "#D4AF37",
                  color: "#0A0A0C",
                  borderRadius: "10px",
                  padding: "1px 7px",
                  fontSize: "10px",
                  fontWeight: "700",
                }}>{outfits.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* WARDROBE TAB */}
        {activeTab === "wardrobe" && (
          <div style={{ animation: "fadeIn 0.3s ease both" }}>

            {/* Add item form */}
            {addingItem ? (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                animation: "fadeSlideIn 0.3s ease both",
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  margin: "0 0 20px 0",
                  fontSize: "18px",
                  color: "#fff",
                }}>Add New Item</h3>

                {/* Image drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    transition: "all 0.2s",
                    background: newItem.imageUrl ? "none" : "rgba(255,255,255,0.02)",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                  {newItem.imageUrl ? (
                    <img src={newItem.imageUrl} alt="" style={{
                      width: "100%", height: "100%", objectFit: "contain",
                    }} />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", marginBottom: "6px" }}>📸</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                        Drop photo or click to upload
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => handleFileUpload(e.target.files[0])} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>ITEM NAME *</label>
                    <input
                      value={newItem.name}
                      onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. White linen shirt"
                      onKeyDown={e => e.key === "Enter" && addClothingItem()}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                        padding: "10px 14px", color: "#fff", fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>CATEGORY</label>
                    <select
                      value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                      style={{
                        width: "100%", background: "#1a1a1f",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                        padding: "10px 14px", color: "#fff", fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                      }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>COLOR</label>
                    <input
                      value={newItem.color}
                      onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))}
                      placeholder="e.g. Navy blue"
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                        padding: "10px 14px", color: "#fff", fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>DESCRIPTION</label>
                    <input
                      value={newItem.description}
                      onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                      placeholder="e.g. Slim fit, cotton"
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                        padding: "10px 14px", color: "#fff", fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={addClothingItem} style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.9), rgba(180,140,30,0.9))",
                    color: "#0A0A0C", border: "none", borderRadius: "10px",
                    padding: "11px 24px", cursor: "pointer", fontWeight: "700",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                    transition: "all 0.2s",
                  }}>Add to Wardrobe</button>
                  <button onClick={() => { setAddingItem(false); setNewItem({ name: "", category: "Tops", color: "", description: "", imageUrl: "" }); }} style={{
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
                letterSpacing: "2px", marginBottom: "24px",
                transition: "all 0.2s ease", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "10px",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,175,55,0.06)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; }}
              >
                <span style={{ fontSize: "16px" }}>+</span> ADD CLOTHING ITEM
              </button>
            )}

            {/* Category filter */}
            {clothes.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["All", ...CATEGORIES.filter(c => categoryCounts[c] > 0)].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    background: activeCategory === cat ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                    border: activeCategory === cat ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    color: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.4)",
                    borderRadius: "20px", padding: "6px 14px", cursor: "pointer",
                    fontFamily: "'Space Mono', monospace", fontSize: "10px",
                    letterSpacing: "1.5px", transition: "all 0.15s ease",
                  }}>
                    {CATEGORY_ICONS[cat] || ""} {cat.toUpperCase()}
                    {cat !== "All" && <span style={{ marginLeft: "6px", opacity: 0.5 }}>{categoryCounts[cat]}</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Clothes grid */}
            {clothes.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 24px",
                animation: "fadeIn 0.5s ease both",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>👗</div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px", color: "rgba(255,255,255,0.25)",
                  margin: "0 0 8px 0",
                }}>Your wardrobe is empty</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.15)", fontSize: "14px", margin: 0 }}>
                  Add your first piece to get started
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px",
              }}>
                {filteredClothes.map(item => (
                  <ClothingCard key={item.id} item={item} onDelete={deleteItem} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* OUTFITS TAB */}
        {activeTab === "outfits" && (
          <div style={{ animation: "fadeIn 0.3s ease both" }}>
            {/* Generate prompt + button */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}>
              <label style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px", letterSpacing: "2px",
                color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "10px",
              }}>OCCASION OR STYLE (OPTIONAL)</label>
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
                      ? "rgba(212,175,55,0.2)"
                      : "linear-gradient(135deg, rgba(212,175,55,0.95), rgba(180,140,30,0.95))",
                    color: isGenerating || clothes.length < 2 ? "rgba(255,255,255,0.3)" : "#0A0A0C",
                    border: "none", borderRadius: "10px", padding: "12px 24px",
                    cursor: isGenerating || clothes.length < 2 ? "not-allowed" : "pointer",
                    fontFamily: "'Space Mono', monospace", fontSize: "11px",
                    letterSpacing: "1.5px", fontWeight: "700",
                    whiteSpace: "nowrap", transition: "all 0.2s ease",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                      STYLING...
                    </>
                  ) : "✦ GENERATE LOOKS"}
                </button>
              </div>
              {error && (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(255,100,100,0.8)", fontSize: "13px",
                  margin: "10px 0 0 0",
                }}>{error}</p>
              )}
            </div>

            {/* Loading state */}
            {isGenerating && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px", color: "rgba(255,255,255,0.5)",
                  marginBottom: "12px",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}>Curating your looks...</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  color: "rgba(212,175,55,0.4)", fontSize: "11px", letterSpacing: "3px",
                }}>YOUR AI STYLIST IS AT WORK</div>
              </div>
            )}

            {/* Outfit cards */}
            {!isGenerating && outfits.length > 0 && outfits.map((outfit, i) => (
              <OutfitCard key={i} outfit={outfit} index={i} />
            ))}

            {/* Empty state */}
            {!isGenerating && outfits.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.2 }}>✦</div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px", color: "rgba(255,255,255,0.2)", margin: "0 0 8px",
                }}>No looks yet</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.15)", fontSize: "14px", margin: 0 }}>
                  {clothes.length < 2
                    ? "Add at least 2 items to your wardrobe first"
                    : "Hit Generate Looks to get styled"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

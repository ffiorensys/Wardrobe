import { useState, useRef, useCallback, useEffect } from "react";

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
        background: "#1a1a1f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        animation: `fadeSlideIn 0.5s ease ${index * 0.1}s both`,
        boxShadow: "0 2px 6px rgba(255,255,255,0.06)",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.3)";
        e.currentTarget.style.background = "rgba(212,175,55,0.02)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,255,255,0.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
        e.currentTarget.style.background = "#1a1a1f";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(255,255,255,0.06)";
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
      background: "#1a1a1f",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.25s ease",
      animation: "fadeSlideIn 0.4s ease both",
      group: true,
      boxShadow: "0 1px 3px rgba(255,255,255,0.06)",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.3)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,255,255,0.1)";
        e.currentTarget.querySelector(".delete-btn").style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(255,255,255,0.06)";
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
            color: "rgba(200,60,60,0.8)", borderRadius: "50%",
            width: "26px", height: "26px", cursor: "pointer",
            fontSize: "12px", opacity: 0, transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(255,255,255,0.85)",
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

export default function App() {
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
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [isLoadingData, setIsLoadingData] = useState(true);
  const saveTimerRef = useRef(null);

  // Load persisted data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const clothesResult = await window.storage.get("wardrobe:clothes");
        const outfitsResult = await window.storage.get("wardrobe:outfits");
        if (clothesResult?.value) setClothes(JSON.parse(clothesResult.value));
        if (outfitsResult?.value) setOutfits(JSON.parse(outfitsResult.value));
      } catch {
        // No saved data yet, start fresh
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Save clothes whenever they change (debounced)
  useEffect(() => {
    if (isLoadingData) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("saving");
    saveTimerRef.current = setTimeout(async () => {
      try {
        await window.storage.set("wardrobe:clothes", JSON.stringify(clothes));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 600);
  }, [clothes, isLoadingData]);

  // Save outfits whenever they change
  useEffect(() => {
    if (isLoadingData || outfits.length === 0) return;
    const saveOutfits = async () => {
      try {
        await window.storage.set("wardrobe:outfits", JSON.stringify(outfits));
      } catch {
        // silent fail for outfits
      }
    };
    saveOutfits();
  }, [outfits, isLoadingData]);

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

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Group clothes by category
      const byCategory = {};
      clothes.forEach(item => {
        if (!byCategory[item.category]) byCategory[item.category] = [];
        byCategory[item.category].push(item);
      });

      const generatedOutfits = [];
      const occasions = ["Casual", "Work", "Weekend", "Evening", "Day Out"];
      const vibes = [
        "Effortless and comfortable",
        "Polished and put-together",
        "Relaxed with a stylish edge",
        "Confident and professional",
        "Fresh and modern"
      ];
      const tips = [
        "Roll up the sleeves for a more relaxed vibe",
        "Add a belt to define your waist and create the 1/3-2/3 proportion",
        "Layer with a jacket when it gets cooler - this 'third element' transforms the look",
        "Keep accessories minimal for a clean look",
        "Mix textures for visual interest and depth",
        "Balance volumes: pair fitted pieces with looser ones",
        "Stick to a monochromatic or neutral palette for foolproof elegance",
        "Apply the 60-30-10 rule: 60% main color, 30% secondary, 10% accent",
        "Remember: proper fit is more valuable than any trend or brand",
        "Create visual balance - tight on top, loose on bottom or vice versa",
        "Add a statement accessory as your strategic 'third element'",
        "Neutral tones (black, white, grey, beige) never fail"
      ];

      // Helper to get random item from array
      const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
      
      // Helper to get random items avoiding duplicates across outfits
      const usedItems = new Set();
      const getRandomUnused = (arr) => {
        const available = arr.filter(item => !usedItems.has(item.id));
        if (available.length === 0) return getRandom(arr); // fallback if all used
        const chosen = getRandom(available);
        usedItems.add(chosen.id);
        return chosen;
      };

      // Generate 3 outfits
      for (let i = 0; i < 3; i++) {
        const outfitItems = [];
        
        // Core pieces: Top + Bottom (or Dress)
        if (byCategory.Dresses && byCategory.Dresses.length > 0 && Math.random() > 0.6) {
          // Sometimes use a dress as the main piece
          outfitItems.push(getRandomUnused(byCategory.Dresses));
        } else {
          // Standard top + bottom combination
          if (byCategory.Tops && byCategory.Tops.length > 0) {
            outfitItems.push(getRandomUnused(byCategory.Tops));
          }
          if (byCategory.Bottoms && byCategory.Bottoms.length > 0) {
            outfitItems.push(getRandomUnused(byCategory.Bottoms));
          }
        }

        // Add shoes if available
        if (byCategory.Shoes && byCategory.Shoes.length > 0) {
          outfitItems.push(getRandomUnused(byCategory.Shoes));
        }

        // Randomly add outerwear or accessories
        if (byCategory.Outerwear && byCategory.Outerwear.length > 0 && Math.random() > 0.5) {
          outfitItems.push(getRandomUnused(byCategory.Outerwear));
        }
        if (byCategory.Accessories && byCategory.Accessories.length > 0 && Math.random() > 0.4) {
          outfitItems.push(getRandomUnused(byCategory.Accessories));
        }

        // Only create outfit if we have at least 2 items
        if (outfitItems.length >= 2) {
          generatedOutfits.push({
            title: `Look ${i + 1}`,
            occasion: prompt.trim() || getRandom(occasions),
            vibe: getRandom(vibes),
            items: outfitItems.map(item => ({
              name: item.name,
              category: item.category
            })),
            styling_tip: getRandom(tips)
          });
        }
      }

      setOutfits(generatedOutfits);
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

  if (isLoadingData) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0A0A0C",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
      }}>
        <div style={{ fontSize: "36px", animation: "spin 1.5s linear infinite", color: "#D4AF37" }}>✦</div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          color: "#8B7355", fontSize: "11px", letterSpacing: "3px",
        }}>LOADING YOUR WARDROBE...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }
        input, select, textarea { outline: none; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
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
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            ✦ AI STYLIST
            {saveStatus === "saving" && (
              <span style={{
                fontSize: "9px", letterSpacing: "2px",
                color: "rgba(255,255,255,0.3)",
                animation: "shimmer 1s ease-in-out infinite",
              }}>SAVING...</span>
            )}
            {saveStatus === "saved" && (
              <span style={{
                fontSize: "9px", letterSpacing: "2px",
                color: "rgba(80,150,90,0.8)",
                animation: "fadeIn 0.3s ease both",
              }}>✓ SAVED</span>
            )}
            {saveStatus === "error" && (
              <span style={{
                fontSize: "9px", letterSpacing: "2px",
                color: "rgba(200,80,60,0.8)",
              }}>⚠ SAVE ERROR</span>
            )}
          </div>
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
                  color: "#FAF8F3",
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
                    background: "linear-gradient(135deg, #D4AF37, rgba(180,140,30,0.95))",
                    color: "#1a1a1f", border: "none", borderRadius: "10px",
                    padding: "11px 24px", cursor: "pointer", fontWeight: "700",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                    transition: "all 0.2s", boxShadow: "0 2px 8px rgba(212,175,55,0.25)",
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

            {/* Category sections */}
            {clothes.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "12px",
                }}>YOUR WARDROBE BY CATEGORY</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["All", ...CATEGORIES.filter(c => categoryCounts[c] > 0)].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                      background: activeCategory === cat ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                      border: activeCategory === cat ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      color: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.4)",
                      borderRadius: "20px", padding: "8px 16px", cursor: "pointer",
                      fontFamily: "'Space Mono', monospace", fontSize: "10px",
                      letterSpacing: "1.5px", transition: "all 0.15s ease",
                      boxShadow: activeCategory === cat ? "0 2px 8px rgba(212,175,55,0.2)" : "none",
                    }}
                      onMouseEnter={e => {
                        if (activeCategory !== cat) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (activeCategory !== cat) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                        }
                      }}
                    >
                      <span style={{ fontSize: "14px", marginRight: "6px" }}>{CATEGORY_ICONS[cat] || "✦"}</span>
                      {cat.toUpperCase()}
                      {cat !== "All" && <span style={{ 
                        marginLeft: "8px", 
                        background: activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.15)",
                        color: activeCategory === cat ? "#FFF" : "rgba(255,255,255,0.45)",
                        borderRadius: "10px",
                        padding: "2px 6px",
                        fontSize: "9px",
                        fontWeight: "700"
                      }}>{categoryCounts[cat]}</span>}
                    </button>
                  ))}
                </div>
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
            {/* Show existing outfits FIRST if they exist */}
            {!isGenerating && outfits.length > 0 && (
              <>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "16px",
                }}>YOUR GENERATED LOOKS</div>
                {outfits.map((outfit, i) => (
                  <OutfitCard key={i} outfit={outfit} index={i} />
                ))}
                <div style={{ 
                  height: "1px", 
                  background: "rgba(255,255,255,0.08)", 
                  margin: "32px 0",
                }} />
              </>
            )}

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
                      ? "rgba(212,175,55,0.15)"
                      : "linear-gradient(135deg, #D4AF37, rgba(180,140,30,0.95))",
                    color: isGenerating || clothes.length < 2 ? "rgba(255,255,255,0.3)" : "#1a1a1f",
                    border: "none", borderRadius: "10px", padding: "12px 24px",
                    cursor: isGenerating || clothes.length < 2 ? "not-allowed" : "pointer",
                    fontFamily: "'Space Mono', monospace", fontSize: "11px",
                    letterSpacing: "1.5px", fontWeight: "700",
                    whiteSpace: "nowrap", transition: "all 0.2s ease",
                    display: "flex", alignItems: "center", gap: "8px",
                    boxShadow: isGenerating || clothes.length < 2 ? "none" : "0 2px 8px rgba(212,175,55,0.25)",
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
                  color: "rgba(200,60,60,0.8)", fontSize: "13px",
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

            {/* Empty state - shown when no outfits exist yet */}
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

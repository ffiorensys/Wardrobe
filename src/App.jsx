import { useState, useRef, useCallback, useEffect } from "react";

const CATEGORIES = ["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories", "Dresses"];

const CATEGORIES_ES = {
  "Tops": "Parte Superior",
  "Bottoms": "Parte Inferior",
  "Shoes": "Calzado",
  "Outerwear": "Abrigos",
  "Accessories": "Accesorios",
  "Dresses": "Vestidos"
};

const CATEGORÍA_ICONS = {
  Tops: "👕",
  Bottoms: "👖",
  Shoes: "👟",
  Outerwear: "🧥",
  Accessories: "👜",
  Dresses: "👗",
};

const FORMALITY_LEVELS = [
  { value: "Casual", label: "Casual" },
  { value: "Business Casual", label: "Casual de Negocio" },
  { value: "Semi-formal", label: "Semi-formal" },
  { value: "Formal", label: "Formal" }
];

const FIT_TYPES = [
  { value: "Fitted", label: "Ajustado" },
  { value: "Regular", label: "Regular" },
  { value: "Loose", label: "Holgado" },
  { value: "Oversized", label: "Muy Holgado" }
];

const MATERIALS = [
  "Algodón", "Seda", "Lana", "Denim", "Cuero", "Lino", 
  "Poliéster", "Cashmere", "Terciopelo", "Satén", "Otro"
];

const PATTERNS = [
  { value: "Solid", label: "Sólido" },
  { value: "Stripes", label: "Rayas" },
  { value: "Floral", label: "Flores" },
  { value: "Geometric", label: "Geométrico" },
  { value: "Dots", label: "Puntos" },
  { value: "Plaid", label: "Cuadros" },
  { value: "Animal Print", label: "Estampado Animal" }
];

const SEASONS = [
  { value: "All-year", label: "Todo el año" },
  { value: "Spring/Summer", label: "Primavera/Verano" },
  { value: "Fall/Winter", label: "Otoño/Invierno" }
];

const LENGTHS = {
  tops: [
    { value: "Cropped", label: "Corto" },
    { value: "Regular", label: "Regular" },
    { value: "Long", label: "Largo" },
    { value: "Extra Long", label: "Extra Largo" }
  ],
  bottoms: [
    { value: "Shorts", label: "Shorts" },
    { value: "Cropped", label: "Corto/Capri" },
    { value: "Regular", label: "Regular" },
    { value: "Full-length", label: "Largo Completo" }
  ]
};

function OutfitCard({ outfit, index, onDelete }) {
  return (
    <div
      style={{
        background: "#1a1a1f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
        transition: "all 0.3s ease",
        animation: `fadeSlideIn 0.5s ease ${index * 0.1}s both`,
        boxShadow: "0 2px 6px rgba(255,255,255,0.06)",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid rgba(212,175,55,0.3)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,255,255,0.1)";
        const deleteBtn = e.currentTarget.querySelector(".delete-outfit-btn");
        if (deleteBtn) deleteBtn.style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(255,255,255,0.06)";
        const deleteBtn = e.currentTarget.querySelector(".delete-outfit-btn");
        if (deleteBtn) deleteBtn.style.opacity = "0";
      }}
    >
      <button
        className="delete-outfit-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(index); }}
        style={{
          position: "absolute", top: "12px", right: "12px",
          background: "rgba(0,0,0,0.8)", border: "none",
          color: "rgba(255,100,100,0.9)", borderRadius: "50%",
          width: "32px", height: "32px", cursor: "pointer",
          fontSize: "16px", opacity: 0, transition: "opacity 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10,
          fontWeight: "bold",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,100,100,0.2)";
          e.currentTarget.style.color = "rgba(255,100,100,1)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(0,0,0,0.8)";
          e.currentTarget.style.color = "rgba(255,100,100,0.9)";
        }}
      >✕</button>

      {/* Small label at top */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "2px",
        color: "rgba(212,175,55,0.6)",
        marginBottom: "12px",
      }}>LOOK {String(index + 1).padStart(2, "0")}</div>

      {/* Images in a row */}
      <div style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}>
        {outfit.items && outfit.items.map((item, i) => (
          <div key={i} style={{ position: "relative" }}>
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name}
                title={item.name} // Tooltip on hover
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
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
                width: "120px",
                height: "120px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
              }}>
                {CATEGORÍA_ICONS[item.category] || "✦"}
              </div>
            )}
          </div>
        ))}
      </div>
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
          <span style={{ fontSize: "40px", opacity: 0.6 }}>{CATEGORÍA_ICONS[item.category] || "✦"}</span>
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
  const [newItem, setNewItem] = useState({ 
    name: "", 
    category: "Tops", 
    primaryColor: "",
    secondaryColors: "",
    formalityLevel: "Casual",
    fit: "Regular",
    material: "",
    pattern: "Solid",
    season: "All-year",
    length: "Full-length",
    description: "", 
    imageUrl: "" 
  });
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [isLoadingData, setIsLoadingData] = useState(true);
  const saveTimerRef = useRef(null);

  // Load persisted data on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const clothesData = localStorage.getItem("wardrobe:clothes");
        const outfitsData = localStorage.getItem("wardrobe:outfits");
        if (clothesData) setClothes(JSON.parse(clothesData));
        if (outfitsData) setOutfits(JSON.parse(outfitsData));
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
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("wardrobe:clothes", JSON.stringify(clothes));
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
    try {
      localStorage.setItem("wardrobe:outfits", JSON.stringify(outfits));
    } catch {
      // silent fail for outfits
    }
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
    setNewItem({ name: "", category: "Tops", primaryColor: "", secondaryColors: "", formalityLevel: "Casual", fit: "Regular", material: "", pattern: "Solid", season: "All-year", length: "Regular", description: "", imageUrl: "" });
    setAddingItem(false);
  };

  const deleteItem = (id) => {
    setClothes(prev => prev.filter(c => c.id !== id));
  };

  const deleteOutfit = (index) => {
    setOutfits(prev => prev.filter((_, i) => i !== index));
  };

  const generateOutfits = async () => {
    if (clothes.length < 2) {
      setError("¡Agrega al menos 2 prendas para generar outfits!");
      return;
    }
    setError("");
    setIsGenerating(true);
    setActiveTab("outfits");

    try {
      // Preparar descripción detallada del guardarropa
      const wardrobeDesc = clothes.map(c => {
        let desc = `- ${c.name} (${CATEGORIES_ES[c.category] || c.category})`;
        if (c.primaryColor) desc += `, Color: ${c.primaryColor}`;
        if (c.formalityLevel) desc += `, Formalidad: ${c.formalityLevel}`;
        if (c.fit) desc += `, Ajuste: ${c.fit}`;
        if (c.material) desc += `, Material: ${c.material}`;
        if (c.pattern) desc += `, Patrón: ${c.pattern}`;
        if (c.season) desc += `, Temporada: ${c.season}`;
        return desc;
      }).join("\n");

      const userOccasion = prompt.trim() 
        ? `El usuario quiere outfits para: ${prompt}`
        : "Crea outfits versátiles apropiados para varias ocasiones";

      // Llamar a Claude API con criterios profesionales
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 2500,
          messages: [{
            role: "user",
            content: `Eres un estilista profesional experto con conocimiento profundo de los principios de moda.

PRINCIPIOS DE MODA A APLICAR (CRÍTICOS):

1. TEORÍA DEL COLOR:
   - Regla de los 3 colores: máximo 3 colores por outfit (60% dominante, 30% secundario, 10% acento)
   - Esquemas efectivos: monocromático, análogo, complementario, o neutros + 1 acento
   - Principio "Goldilocks": outfits moderadamente coordinados son MÁS fashionable
   - Intensidad consistente: todos los colores deben tener similar saturación
   
2. PROPORCIONES Y SILUETA:
   - Regla de los tercios: 1/3 arriba + 2/3 abajo (o viceversa), NUNCA 50/50
   - Balance de volúmenes: ajustado arriba + holgado abajo (o viceversa)
   - NUNCA todo ajustado o todo holgado simultáneamente
   
3. EL "TERCER ELEMENTO":
   - Incluir una capa/accesorio extra que transforma el outfit de básico a intencional
   - Ejemplos: chaqueta, bufanda, cinturón, reloj statement
   
4. FIT Y AJUSTE:
   - El ajuste correcto es MÁS importante que cualquier marca o tendencia
   - Priorizar prendas con fit apropiado
   
5. TEXTURA Y PROFUNDIDAD:
   - Mezclar al menos 2 texturas diferentes para crear interés visual
   - Evitar uniformidad total de materiales
   
6. NIVEL DE FORMALIDAD:
   - Todas las prendas del outfit deben estar en el mismo nivel de formalidad ±1
   - No mezclar formal con super casual

GUARDARROPA DEL USUARIO:
${wardrobeDesc}

SOLICITUD: ${userOccasion}

Crea 2 combinaciones de outfits siguiendo ESTRICTAMENTE los principios arriba. Retorna SOLO un array JSON (sin markdown, sin texto extra):

[
  {
    "title": "Nombre breve del outfit",
    "occasion": "Tipo de ocasión",
    "vibe": "Descripción estética de una línea",
    "items": [
      { "name": "nombre exacto de la prenda del guardarropa", "category": "categoría" }
    ],
    "styling_tip": "Un tip específico aplicando los principios de moda (menciona qué principio usas: proporciones, balance de volumen, regla de color, tercer elemento, etc.)"
  }
]

REGLAS ESTRICTAS:
- Usa SOLO prendas del guardarropa proporcionado (nombres exactos)
- Aplica los principios de moda para crear looks balanceados y cohesivos
- Cada outfit debe tener 2-5 prendas
- Respeta niveles de formalidad similares
- Balance de volúmenes (fitted + loose)
- Máximo 3 colores por outfit
- Los styling tips deben referenciar principios específicos aplicados`
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      // Agregar imageUrl a cada item
      const enrichedOutfits = parsed.map(outfit => ({
        ...outfit,
        items: outfit.items.map(item => {
          const fullItem = clothes.find(c => c.name === item.name);
          return {
            ...item,
            imageUrl: fullItem?.imageUrl || null
          };
        })
      }));

      setOutfits(prev => [...enrichedOutfits, ...prev]);
    } catch (err) {
      setError("No se pudieron generar outfits. Verifica tu conexión o intenta de nuevo.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

RULES:
- Only use items from the provided wardrobe (exact names)
- Apply fashion principles to create balanced, cohesive looks
- Each outfit should have 2-5 items
- Styling tips should reference specific principles (proportions, volume balance, color rule, third element, etc.)`
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      // Add imageUrl to each item
      const enrichedOutfits = parsed.map(outfit => ({
        ...outfit,
        items: outfit.items.map(item => {
          const fullItem = clothes.find(c => c.name === item.name);
          return {
            ...item,
            imageUrl: fullItem?.imageUrl || null
          };
        })
      }));

      setOutfits(prev => [...enrichedOutfits, ...prev]);
    } catch (err) {
      setError("Couldn't generate outfits. Make sure you have a valid API key or try again.");
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
        }}>CARGANDO TU GUARDARROPA...</div>
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
              }}>GUARDANDO...</span>
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
              }}>⚠ ERROR AL GUARDAR</span>
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
                }}>Agregar Nueva Prenda</h3>

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
                        Arrastra una foto o haz clic para subir
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => handleFileUpload(e.target.files[0])} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>NOMBRE DE LA PRENDA *</label>
                    <input
                      value={newItem.name}
                      onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                      placeholder="ej. White linen shirt"
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
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>CATEGORÍA</label>
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
                      placeholder="ej. Navy blue"
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                        padding: "10px 14px", color: "#fff", fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>DESCRIPCIÓN</label>
                    <input
                      value={newItem.description}
                      onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                      placeholder="ej. Slim fit, cotton"
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
                  }}>Agregar al Guardarropa</button>
                  <button onClick={() => { setAddingItem(false); setNewItem({ name: "", category: "Tops", primaryColor: "", secondaryColors: "", formalityLevel: "Casual", fit: "Regular", material: "", pattern: "Solid", season: "All-year", length: "Regular", description: "", imageUrl: "" }); }} style={{
                    background: "transparent", color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                    padding: "11px 20px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                  }}>Cancelar</button>
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
                }}>TU GUARDARROPA POR CATEGORÍA</div>
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
                      <span style={{ fontSize: "14px", marginRight: "6px" }}>{CATEGORÍA_ICONS[cat] || "✦"}</span>
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
                }}>Tu guardarropa está vacío</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.15)", fontSize: "14px", margin: 0 }}>
                  Agrega tu primera prenda para empezar
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
                }}>TUS LOOKS GENERADOS</div>
                {outfits.map((outfit, i) => (
                  <OutfitCard key={i} outfit={outfit} index={i} onDelete={deleteOutfit} />
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
              }}>OCASIÓN O ESTILO (OPCIONAL)</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="ej. Business casual, first date, beach vacation..."
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
                }}>Creando tus looks...</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  color: "rgba(212,175,55,0.4)", fontSize: "11px", letterSpacing: "3px",
                }}>TU ESTILISTA IA ESTÁ TRABAJANDO</div>
              </div>
            )}

            {/* Empty state - shown when no outfits exist yet */}
            {!isGenerating && outfits.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.2 }}>✦</div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px", color: "rgba(255,255,255,0.2)", margin: "0 0 8px",
                }}>Aún no hay looks</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.15)", fontSize: "14px", margin: 0 }}>
                  {clothes.length < 2
                    ? "Agrega al menos 2 prendas a tu guardarropa primero"
                    : "Presiona Generar Looks para obtener estilo"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

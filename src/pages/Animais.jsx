import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";

const allAnimals = [
  {
    name: "Onça-pintada",
    status: "Criticamente ameaçada",
    statusBg: "#fee2e2",
    statusColor: "#991b1b",
    biome: "Mata Atlântica",
    region: "Sudeste",
    population: 300,
    trend: [1200, 950, 700, 520, 380, 300],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "O maior felino das Américas perdeu mais de 50% de seu habitat na Mata Atlântica nos últimos 15 anos. A fragmentação florestal impede a migração entre populações.",
    threats: ["Desmatamento", "Caça ilegal", "Fragmentação de habitat"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/onca-pintada.png",
  },
  {
    name: "Arara-azul",
    status: "Em perigo",
    statusBg: "#fef3c7",
    statusColor: "#92400e",
    biome: "Pantanal",
    region: "Centro-Oeste",
    population: 6500,
    trend: [10000, 8500, 7200, 6800, 6600, 6500],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "Com apenas 6.500 indivíduos restantes, a arara-azul depende da preservação das matas ciliares e árvores nativas para nidificação no Pantanal.",
    threats: ["Tráfico de animais", "Perda de habitat", "Queimadas"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/arara-azul-de-lear_01_0.png",
  },
  {
    name: "Mico-leão-dourado",
    status: "Criticamente ameaçada",
    statusBg: "#fee2e2",
    statusColor: "#991b1b",
    biome: "Mata Atlântica",
    region: "Sudeste",
    population: 2500,
    trend: [400, 800, 1200, 1800, 2200, 2500],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "Símbolo da conservação brasileira, o mico-leão-dourado é um caso de sucesso parcial: programas de reintrodução elevaram sua população, mas a espécie permanece vulnerável.",
    threats: ["Fragmentação florestal", "Doenças", "Baixa diversidade genética"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/micoleao-cke.png",
  },
  {
    name: "Lobo-guará",
    status: "Vulnerável",
    statusBg: "#fef9c3",
    statusColor: "#854d0e",
    biome: "Cerrado",
    region: "Centro-Oeste",
    population: 23000,
    trend: [35000, 31000, 28000, 26000, 24000, 23000],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "O maior canídeo sul-americano habita as vastas savanas do Cerrado. A expansão agrícola e as rodovias são as principais causas de mortalidade da espécie.",
    threats: ["Expansão agrícola", "Atropelamentos", "Perda de habitat"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/lobo-guara.png",
  },
  {
    name: "Tucano-de-bico-preto",
    status: "Em perigo",
    statusBg: "#fef3c7",
    statusColor: "#92400e",
    biome: "Amazônia",
    region: "Norte",
    population: 4200,
    trend: [8000, 7000, 6200, 5400, 4700, 4200],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "Dispersor de sementes essencial para a regeneração da Amazônia, o tucano-de-bico-preto sofre com a fragmentação florestal que isola populações.",
    threats: ["Desmatamento", "Tráfico de animais", "Fragmentação"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/large-6.jpg",
  },
  {
    name: "Perereca-verde-da-mata",
    status: "Criticamente ameaçada",
    statusBg: "#fee2e2",
    statusColor: "#991b1b",
    biome: "Mata Atlântica",
    region: "Sudeste",
    population: 180,
    trend: [900, 650, 450, 320, 230, 180],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "Endêmica de fragmentos florestais da Mata Atlântica, esta perereca é altamente sensível a alterações microclimáticas causadas pelo desmatamento.",
    threats: ["Desmatamento", "Mudanças climáticas", "Fungos patogênicos"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/figura_1.jpg",
  },
  {
    name: "Tamanduá-bandeira",
    status: "Vulnerável",
    statusBg: "#fef9c3",
    statusColor: "#854d0e",
    biome: "Cerrado",
    region: "Centro-Oeste",
    population: 5000,
    trend: [9000, 8000, 7000, 6200, 5500, 5000],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "O maior mirmecófago do mundo, o tamanduá-bandeira tem baixíssima taxa reprodutiva, tornando-o extremamente vulnerável à pressão humana sobre o Cerrado.",
    threats: ["Queimadas", "Atropelamentos", "Perda de habitat"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/tamandua-bandeira-2.png",
  },
  {
    name: "Boto-cor-de-rosa",
    status: "Em perigo",
    statusBg: "#fef3c7",
    statusColor: "#92400e",
    biome: "Amazônia",
    region: "Norte",
    population: 12000,
    trend: [25000, 21000, 17000, 15000, 13000, 12000],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "O maior golfinho de água doce do mundo enfrenta ameaças crescentes pela poluição dos rios amazônicos, pesca acidental e construção de hidrelétricas.",
    threats: ["Poluição hídrica", "Pesca acidental", "Hidrelétricas"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/banner_blog_novo_24.png",
  },
  {
    name: "Ararinha-azul",
    status: "Extinta na natureza",
    statusBg: "#f3f4f6",
    statusColor: "#374151",
    biome: "Caatinga",
    region: "Nordeste",
    population: 0,
    trend: [200, 80, 20, 5, 1, 0],
    years: ["2000", "2005", "2010", "2015", "2020", "2024"],
    description:
      "Considerada extinta na natureza desde 2000, a ararinha-azul sobrevive apenas em cativeiro. Programas de reintrodução tentam devolvê-la à Caatinga baiana.",
    threats: ["Desmatamento total", "Captura para cativeiro", "Ausência de habitat"],
    img: "https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/ARARINHA_AZUL-795.jpg",
  },
];

const biomes = ["Todos", "Amazônia", "Cerrado", "Mata Atlântica", "Pantanal", "Caatinga"];
const statuses = ["Todos", "Criticamente ameaçada", "Em perigo", "Vulnerável", "Extinta na natureza"];

// ─── Hook ────────────────────────────────────────────────────────────────────

function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ─── Mini gráfico ─────────────────────────────────────────────────────────────

function MiniLineChart({ trend, years, color }) {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [dims, setDims] = useState({ width: 200, ready: false });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setDims({ width: w, ready: true });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const w = dims.width;
  const h = 80;
  const pad = { l: 8, r: 8, t: 8, b: 20 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  const maxVal = Math.max(...trend, 1);
  const minVal = Math.min(...trend, 0);
  const range = maxVal - minVal || 1;

  const pts = trend.map((v, i) => ({
    x: pad.l + (i / (trend.length - 1)) * plotW,
    y: pad.t + (1 - (v - minVal) / range) * plotH,
    label: years[i],
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${pts[pts.length - 1].x} ${pad.t + plotH} L ${pts[0].x} ${pad.t + plotH} Z`;

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {dims.ready && (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
          <defs>
            <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`}
            style={{ opacity: animated ? 1 : 0, transition: "opacity 600ms ease" }} />
          <path d={pathD} fill="none" stroke={color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: animated ? 1 : 0, transition: "opacity 600ms ease" }} />
          {pts.map((p, i) => (
            <g key={i} style={{ opacity: animated ? 1 : 0, transition: `opacity 0.3s ease ${i * 0.05}s` }}>
              <circle cx={p.x} cy={p.y} r={3} fill={color} stroke="#fff" strokeWidth="1.5" />
              {(i === 0 || i === pts.length - 1) && (
                <text x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.label}</text>
              )}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Animais() {
  const navigate = useNavigate();
  const windowWidth = useWindowSize();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const [biomeFilter, setBiomeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = allAnimals.filter((a) => {
    const matchBiome = biomeFilter === "Todos" || a.biome === biomeFilter;
    const matchStatus = statusFilter === "Todos" || a.status === statusFilter;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.biome.toLowerCase().includes(search.toLowerCase());
    return matchBiome && matchStatus && matchSearch;
  });

  const trendColor = (trend) => {
    const delta = trend[trend.length - 1] - trend[0];
    if (delta > 0) return "#16a34a";
    if (delta < -trend[0] * 0.5) return "#ef4444";
    return "#f59e0b";
  };

  const gridCols = isMobile
    ? "1fr"
    : isTablet
    ? "repeat(2, 1fr)"
    : "repeat(auto-fill, minmax(320px, 1fr))";

  const hasActiveFilters = biomeFilter !== "Todos" || statusFilter !== "Todos";

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .animal-card { animation: fadeIn 400ms ease forwards; transition: transform 0.25s, box-shadow 0.25s; }
        .animal-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
        .filter-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); }
        .modal-content { background: #fff; border-radius: 20px; max-width: 700px; width: 100%; max-height: 92vh; overflow-y: auto; box-shadow: 0 32px 64px rgba(0,0,0,0.2); animation: fadeIn 300ms ease; }
        /* esconde scrollbar dos filtros no mobile */
        .biome-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(21,128,61,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 24px",
          height: isMobile ? 56 : 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 8,
                padding: isMobile ? "6px 10px" : "6px 14px",
                color: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6,
                minHeight: 44, transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              <i className="fas fa-arrow-left" style={{ fontSize: 12 }} />
              {!isMobile && <span>Voltar</span>}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={logo} alt="EcoMapBrasil" style={{ height: isMobile ? 28 : 36 }} />
              {!isMobile && <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>EcoMapBrasil</span>}
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 8, padding: isMobile ? "6px 10px" : "6px 14px",
          }}>
            <i className="fas fa-paw" style={{ color: "#bbf7d0", fontSize: 13 }} />
            {!isMobile && <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Espécies Ameaçadas</span>}
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
        padding: isMobile ? "36px 20px" : "56px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#86efac", textTransform: "uppercase", marginBottom: 10 }}>
          Biodiversidade Brasileira
        </p>
        <h1 style={{
          fontSize: isMobile ? "clamp(22px, 6vw, 30px)" : "clamp(28px, 4vw, 42px)",
          fontWeight: 800, color: "#fff",
          maxWidth: 700, margin: "0 auto 14px", lineHeight: 1.2,
        }}>
          Espécies Ameaçadas pelo Desmatamento
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: "#bbf7d0", maxWidth: 580, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Conheça as espécies que estão perdendo seu habitat. Cada uma conta a história de um ecossistema em colapso.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 20 : 32, flexWrap: "wrap" }}>
          {[
            { value: allAnimals.length, label: "Espécies listadas" },
            { value: allAnimals.filter((a) => a.status === "Criticamente ameaçada").length, label: "Criticamente ameaçadas" },
            { value: allAnimals.filter((a) => a.status === "Extinta na natureza").length, label: "Extintas na natureza" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: isMobile ? 11 : 13, color: "#86efac" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filtros ────────────────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: isMobile ? "12px 16px" : "20px 24px",
        position: "sticky",
        top: isMobile ? 56 : 64,
        zIndex: 40,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Linha superior: busca + (mobile: botão filtros | desktop: contador) */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: isMobile ? 0 : 12 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <i className="fas fa-search" style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13,
              }} />
              <input
                type="text"
                placeholder="Buscar espécie ou bioma..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", paddingLeft: 36, paddingRight: 12,
                  paddingTop: 9, paddingBottom: 9,
                  border: "1px solid #e5e7eb", borderRadius: 10,
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#16a34a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            {isMobile ? (
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 14px", borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: filtersOpen ? "#16a34a" : (hasActiveFilters ? "#f0fdf4" : "#f9fafb"),
                  color: filtersOpen ? "#fff" : (hasActiveFilters ? "#16a34a" : "#374151"),
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap", minHeight: 44, flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                <i className="fas fa-sliders-h" style={{ fontSize: 13 }} />
                Filtros
                {hasActiveFilters && !filtersOpen && (
                  <span style={{
                    background: "#16a34a", color: "#fff",
                    borderRadius: "50%", width: 16, height: 16,
                    fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>✓</span>
                )}
              </button>
            ) : (
              <span style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                {filtered.length} espécie{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Filtros expandidos — sempre visíveis no desktop/tablet, colapsáveis no mobile */}
          {(!isMobile || filtersOpen) && (
            <div style={{
              display: "flex", gap: isMobile ? 8 : 16,
              flexDirection: isMobile ? "column" : "row",
              flexWrap: isMobile ? "nowrap" : "wrap",
              alignItems: isMobile ? "stretch" : "center",
              paddingTop: isMobile ? 12 : 0,
              borderTop: isMobile ? "1px solid #f3f4f6" : "none",
              animation: "fadeIn 200ms ease",
            }}>
              {/* Filtros de bioma — scroll horizontal no mobile */}
              <div
                className="biome-scroll"
                style={{
                  display: "flex", gap: 6,
                  flexWrap: isMobile ? "nowrap" : "wrap",
                  overflowX: isMobile ? "auto" : "visible",
                  paddingBottom: isMobile ? 2 : 0,
                  msOverflowStyle: "none", scrollbarWidth: "none",
                }}
              >
                {biomes.map((b) => (
                  <button
                    key={b}
                    className="filter-btn"
                    onClick={() => setBiomeFilter(b)}
                    style={{
                      padding: "7px 14px", borderRadius: 8,
                      fontSize: 12, fontWeight: 600,
                      background: biomeFilter === b ? "#16a34a" : "#f3f4f6",
                      color: biomeFilter === b ? "#fff" : "#374151",
                      border: biomeFilter === b ? "none" : "1px solid #e5e7eb",
                      whiteSpace: "nowrap", minHeight: 36,
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "8px 12px", borderRadius: 10,
                    border: "1px solid #e5e7eb", fontSize: 13,
                    color: "#374151", outline: "none", cursor: "pointer",
                    background: "#fff", flex: isMobile ? 1 : "unset", minHeight: 36,
                  }}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {isMobile && (
                  <span style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {filtered.length} espécie{filtered.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Grid de cards ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "20px 16px" : "40px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <i className="fas fa-search" style={{ fontSize: 40, marginBottom: 16, display: "block" }} />
            <p style={{ fontSize: 16 }}>Nenhuma espécie encontrada com esses filtros.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: isMobile ? 16 : 24 }}>
            {filtered.map((animal, idx) => (
              <div
                key={animal.name}
                className="animal-card"
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: isMobile ? 16 : 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  animationDelay: `${idx * 60}ms`,
                }}
                onClick={() => setSelected(animal)}
              >
                <div style={{ height: isMobile ? 160 : 200, overflow: "hidden", position: "relative" }}>
                  <img
                    src={animal.img}
                    alt={animal.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{
                    position: "absolute", top: 10, left: 10,
                    background: animal.statusBg, color: animal.statusColor,
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                  }}>
                    {animal.status}
                  </div>
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(0,0,0,0.5)", color: "#fff",
                    fontSize: 10, fontWeight: 600, padding: "3px 10px",
                    borderRadius: 6, backdropFilter: "blur(4px)",
                  }}>
                    {animal.biome}
                  </div>
                </div>

                <div style={{ padding: isMobile ? "14px 16px" : "20px" }}>
                  <h3 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                    {animal.name}
                  </h3>
                  <p style={{
                    fontSize: 13, color: "#6b7280", lineHeight: 1.5,
                    marginBottom: isMobile ? 12 : 16,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {animal.description}
                  </p>

                  <div style={{ marginBottom: isMobile ? 10 : 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Tendência populacional
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: trendColor(animal.trend) }}>
                        {animal.trend[animal.trend.length - 1] === 0
                          ? "Extinta"
                          : `${animal.trend[animal.trend.length - 1].toLocaleString()} ind.`}
                      </span>
                    </div>
                    <MiniLineChart trend={animal.trend} years={animal.years} color={trendColor(animal.trend)} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                      {animal.threats.slice(0, isMobile ? 1 : 2).map((t) => (
                        <span key={t} style={{
                          fontSize: 10, background: "#fef2f2", color: "#ef4444",
                          padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <button
                      style={{
                        background: "none", border: "1px solid #16a34a",
                        color: "#16a34a", borderRadius: 8,
                        padding: "5px 12px", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                        minHeight: 36, transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#16a34a"; }}
                    >
                      Ver mais <i className="fas fa-arrow-right" style={{ fontSize: 10 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ──────────────────────────────────────────────────── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{
              height: isMobile ? 200 : 280,
              overflow: "hidden",
              borderRadius: isMobile ? "16px 16px 0 0" : "20px 20px 0 0",
              position: "relative",
            }}>
              <img
                src={selected.img}
                alt={selected.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
              }} />
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
                  width: 40, height: 40, borderRadius: "50%",
                  cursor: "pointer", fontSize: 16, backdropFilter: "blur(4px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <i className="fas fa-times" />
              </button>
              <div style={{ position: "absolute", bottom: 14, left: 18 }}>
                <span style={{
                  background: selected.statusBg, color: selected.statusColor,
                  fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 6,
                }}>
                  {selected.status}
                </span>
              </div>
            </div>

            <div style={{ padding: isMobile ? "18px 16px 24px" : "28px 28px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
                <h2 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#111", margin: 0 }}>
                  {selected.name}
                </h2>
                <span style={{
                  background: "#f0fdf4", color: "#16a34a",
                  fontSize: 12, fontWeight: 700, padding: "4px 12px",
                  borderRadius: 8, whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {selected.biome}
                </span>
              </div>

              <p style={{ fontSize: isMobile ? 13 : 14, color: "#4b5563", lineHeight: 1.7, marginBottom: 20 }}>
                {selected.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12, marginBottom: 20 }}>
                {[
                  {
                    label: "População estimada",
                    value: selected.population === 0 ? "Extinta" : selected.population.toLocaleString(),
                    color: selected.population === 0 ? "#ef4444" : "#111",
                  },
                  {
                    label: "Variação (2000–2024)",
                    value: selected.trend[0] === 0
                      ? "N/A"
                      : `${Math.round(((selected.trend[selected.trend.length - 1] - selected.trend[0]) / selected.trend[0]) * 100)}%`,
                    color: trendColor(selected.trend),
                  },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: "#f8fafc", borderRadius: 12,
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    border: "1px solid #e5e7eb",
                  }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: stat.color }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                  Evolução Populacional (2000–2024)
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 12px" }}>
                  <MiniLineChart trend={selected.trend} years={selected.years} color={trendColor(selected.trend)} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                  Principais Ameaças
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selected.threats.map((t) => (
                    <span key={t} style={{
                      background: "#fef2f2", color: "#ef4444",
                      border: "1px solid #fecaca",
                      fontSize: isMobile ? 11 : 12, fontWeight: 600,
                      padding: "6px 12px", borderRadius: 8,
                    }}>
                      <i className="fas fa-exclamation-triangle" style={{ marginRight: 5, fontSize: 10 }} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{
        background: "#052e16",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: isMobile ? "20px 16px" : "24px",
        textAlign: "center",
        fontSize: isMobile ? 12 : 13,
        color: "#4b5563",
      }}>
        © 2025 EcoMapBrasil — Dados de conservação baseados em IUCN, ICMBio e WWF Brasil.
      </footer>
    </div>
  );
}
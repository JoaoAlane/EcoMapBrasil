import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Dados ────────────────────────────────────────────────────────────────────

const biomeColors = {
  'Amazônia':       '#0d5016',
  'Cerrado':        '#d4a017',
  'Caatinga':       '#ff6b35',
  'Mata Atlântica': '#4169e1',
  'Pantanal':       '#8b4513',
  'Pampa':          '#32cd32',
}

const biomesData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Amazônia', desmatamento: '78%', area_km2: 5500000, descricao: 'Maior floresta tropical do mundo' },
      geometry: { type: 'Polygon', coordinates: [[[-73.98,5.27],[-60.11,5.27],[-49.95,2.82],[-44.30,-2.33],[-48.63,-16.34],[-57.30,-18.04],[-67.81,-11.87],[-70.09,-9.19],[-73.98,-7.36],[-73.98,5.27]]] },
    },
    {
      type: 'Feature',
      properties: { name: 'Cerrado', desmatamento: '45%', area_km2: 2036448, descricao: 'Savana tropical com grande biodiversidade' },
      geometry: { type: 'Polygon', coordinates: [[[-57.30,-18.04],[-48.63,-16.34],[-44.30,-2.33],[-42.54,-2.33],[-35.24,-14.24],[-35.24,-20.30],[-46.63,-24.53],[-52.43,-24.53],[-57.30,-18.04]]] },
    },
    {
      type: 'Feature',
      properties: { name: 'Caatinga', desmatamento: '15%', area_km2: 844453, descricao: 'Vegetação seca adaptada ao semiárido' },
      geometry: { type: 'Polygon', coordinates: [[[-42.54,-2.33],[-35.24,-2.33],[-34.80,-17.34],[-42.54,-17.34],[-42.54,-2.33]]] },
    },
    {
      type: 'Feature',
      properties: { name: 'Mata Atlântica', desmatamento: '32%', area_km2: 1110182, descricao: 'Floresta costeira altamente ameaçada' },
      geometry: { type: 'MultiPolygon', coordinates: [
        [[[-35.00,-5.50],[-34.80,-5.50],[-34.80,-17.50],[-35.00,-17.50],[-35.00,-5.50]]],
        [[[-48.50,-19.00],[-40.00,-19.00],[-40.00,-33.75],[-51.00,-33.75],[-51.00,-23.00],[-48.50,-19.00]]],
        [[[-38.50,-12.50],[-34.80,-12.50],[-34.80,-18.00],[-38.50,-18.00],[-38.50,-12.50]]],
      ]},
    },
    {
      type: 'Feature',
      properties: { name: 'Pantanal', desmatamento: '12%', area_km2: 150355, descricao: 'Maior planície alagada do mundo' },
      geometry: { type: 'Polygon', coordinates: [[[-59.18,-14.24],[-55.67,-14.24],[-55.67,-22.27],[-59.18,-22.27],[-59.18,-14.24]]] },
    },
    {
      type: 'Feature',
      properties: { name: 'Pampa', desmatamento: '25%', area_km2: 176496, descricao: 'Campos nativos do Sul do Brasil' },
      geometry: { type: 'Polygon', coordinates: [[[-57.65,-28.18],[-49.70,-28.18],[-49.70,-33.75],[-57.65,-33.75],[-57.65,-28.18]]] },
    },
  ],
}

const timelineData = [
  { year: '2023', text: 'Recorde de desmatamento na Amazônia: 11.568 km²' },
  { year: '2020', text: 'Cerrado perde 7.340 km² de vegetação nativa' },
  { year: '2018', text: 'Mata Atlântica tem apenas 12,4% de sua cobertura original' },
  { year: '2015', text: 'Pantanal perde 12% de sua área para queimadas' },
  { year: '2010', text: 'Caatinga tem 45% de sua área original desmatada' },
]

const biomeSidebar = [
  { key: 'amazonia',       name: 'Amazônia',       color: '#0d5016', pct: '78%', icon: 'fa-tree' },
  { key: 'cerrado',        name: 'Cerrado',         color: '#d4a017', pct: '45%', icon: 'fa-sun' },
  { key: 'caatinga',       name: 'Caatinga',        color: '#ff6b35', pct: '15%', icon: 'fa-water' },
  { key: 'mata-atlantica', name: 'Mata Atlântica',  color: '#4169e1', pct: '32%', icon: 'fa-leaf' },
  { key: 'pantanal',       name: 'Pantanal',        color: '#8b4513', pct: '12%', icon: 'fa-frog' },
  { key: 'pampa',          name: 'Pampa',           color: '#32cd32', pct: '25%', icon: 'fa-seedling' },
]

// ─── Hook: tamanho de janela ───────────────────────────────────────────────────

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth })
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return size
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function Mapa() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const biomesLayerRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [activeBiome, setActiveBiome] = useState(null)

  // Mobile bottom-sheet
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('biomas') // 'biomas' | 'timeline'

  // Mobile overlay menu (fontes de dados)
  const [menuOpen, setMenuOpen] = useState(false)

  const { width } = useWindowSize()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  // ─── Inicializa mapa ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(); return }
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js'
      script.onload = resolve
      document.body.appendChild(script)
    })

    loadLeaflet().then(() => {
      if (mapInstanceRef.current || !mapRef.current) return
      const L = window.L

      const map = L.map(mapRef.current, { center: [-14, -52], zoom: 4, zoomControl: false })
      mapInstanceRef.current = map

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri', maxZoom: 18,
      }).addTo(map)

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri', maxZoom: 18,
      }).addTo(map)

      const biomesLayer = L.geoJSON(biomesData, {
        style: (feature) => ({
          fillColor: biomeColors[feature.properties.name] || '#666',
          weight: 1, opacity: 0, color: '#333', fillOpacity: 0,
        }),
        onEachFeature: (feature, layer) => {
          layer.on({ click: (e) => map.fitBounds(e.target.getBounds()) })
          layer.bindPopup(`
            <div style="font-family:'Segoe UI',sans-serif;min-width:200px;padding:4px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                <div style="width:12px;height:12px;border-radius:3px;background:${biomeColors[feature.properties.name]};flex-shrink:0"></div>
                <h3 style="margin:0;font-size:15px;color:#1a1a1a">${feature.properties.name}</h3>
              </div>
              <div style="display:flex;flex-direction:column;gap:5px;font-size:12px;color:#444">
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#888">Área total</span>
                  <strong>${feature.properties.area_km2.toLocaleString()} km²</strong>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#888">Desmatamento</span>
                  <strong style="color:#dc2626">${feature.properties.desmatamento}</strong>
                </div>
                <div style="margin-top:4px;padding-top:8px;border-top:1px solid #eee;color:#555;font-style:italic">
                  ${feature.properties.descricao}
                </div>
              </div>
            </div>
          `)
        },
      }).addTo(map)

      biomesLayerRef.current = biomesLayer

      fetch('/meuarquivo4.json')
        .then(res => { if (!res.ok) throw new Error('não encontrado'); return res.json() })
        .then(data => {
          L.geoJSON(data, {
            style: { color: '#ef4444', weight: 2, fillColor: '#ef4444', fillOpacity: 0.45 }
          }).addTo(map)
        })
        .catch(err => console.log('Áreas afetadas não carregadas:', err))

      L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map)

      setTimeout(() => setLoading(false), 800)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Invalida tamanho do mapa quando layout muda (sidebar some/aparece)
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300)
    }
  }, [isMobile, isTablet, sheetOpen])

  // ─── Foca bioma ──────────────────────────────────────────────────────────────

  const focusBiome = useCallback((biome) => {
    setActiveBiome(biome.key)
    const layer = biomesLayerRef.current
    if (!layer) return
    layer.eachLayer((l) => {
      if (l.feature.properties.name === biome.name) {
        mapInstanceRef.current.fitBounds(l.getBounds(), { padding: [40, 40] })
        l.openPopup()
      }
    })
    // Em mobile fecha o sheet depois de focar
    if (isMobile) setSheetOpen(false)
  }, [isMobile])

  // ─── Estilos responsivos ──────────────────────────────────────────────────────

  const headerHeight = isMobile ? 52 : 60

  const sidebarWidth = isTablet ? 240 : 320

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', sans-serif",
      background: '#0f1117',
      overflow: 'hidden',
    }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{
        background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a27 60%, #3d7a3d 100%)',
        color: 'white',
        padding: '0 16px',
        height: headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
        flexShrink: 0,
        zIndex: 100,
        gap: 12,
      }}>
        {/* Voltar */}
        <button
          onClick={() => navigate('/')}
          aria-label="Voltar"
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 8,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: isMobile ? '6px 10px' : '6px 14px',
            color: 'white', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            minWidth: 44, minHeight: 44,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <i className="fas fa-arrow-left" style={{ fontSize: 12 }} />
          {!isMobile && <span style={{ marginLeft: 6 }}>Voltar</span>}
        </button>

        {/* Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0 }} />
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? 14 : isTablet ? 15 : 17,
            fontWeight: 600,
            letterSpacing: 0.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {isMobile ? 'EcoMapBrasil' : 'EcoMapBrasil — Monitoramento de Biomas'}
          </h1>
        </div>

        {/* Desktop: fonte dos dados | Mobile: botão menu */}
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Informações"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8, padding: '6px 10px',
              color: 'white', cursor: 'pointer',
              minWidth: 44, minHeight: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <i className="fas fa-info-circle" style={{ fontSize: 14 }} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
            <i className="fas fa-satellite" />
            {!isTablet && <span>Dados: INPE · IBGE · MapBiomas</span>}
            {isTablet && <span>INPE · IBGE</span>}
          </div>
        )}
      </header>

      {/* ── Overlay menu mobile (fontes de dados) ─────────────────── */}
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 500,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
            paddingTop: headerHeight,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0 0 0 12px',
              padding: '16px 20px',
              minWidth: 200,
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
              Fontes de dados
            </p>
            {['INPE', 'IBGE', 'MapBiomas'].map(src => (
              <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <i className="fas fa-satellite" style={{ color: '#4ade80', fontSize: 12 }} />
                <span style={{ fontSize: 13, color: '#d1d5db' }}>{src}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading overlay ───────────────────────────────────────── */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.85)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, gap: 16,
        }}>
          <div style={{
            width: 44, height: 44,
            border: '4px solid rgba(74,222,128,0.2)',
            borderTop: '4px solid #4ade80',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: '#4ade80', fontSize: 15, margin: 0, fontWeight: 500 }}>Carregando mapa...</p>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Mapa */}
        <div ref={mapRef} style={{ flex: 1, height: '100%' }} />

        {/* ── Sidebar desktop / tablet ─────────────────────────── */}
        {!isMobile && (
          <aside style={{
            width: sidebarWidth,
            background: '#111827',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}>
            <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#6b7280', textTransform: 'uppercase' }}>
                Painel de Informações
              </p>
            </div>

            <div style={{ padding: '14px 16px', flex: 1 }}>

              {/* Biomas */}
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6b7280', textTransform: 'uppercase' }}>
                🌿 Biomas — clique para focar
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 24 }}>
                {biomeSidebar.map(b => (
                  <button
                    key={b.key}
                    onClick={() => focusBiome(b)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: isTablet ? 8 : 12,
                      padding: isTablet ? '8px 10px' : '10px 12px',
                      borderRadius: 10, cursor: 'pointer',
                      border: activeBiome === b.key
                        ? `1px solid ${b.color}`
                        : '1px solid rgba(255,255,255,0.06)',
                      background: activeBiome === b.key
                        ? `${b.color}22`
                        : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s',
                      textAlign: 'left', width: '100%',
                      minHeight: 44,
                    }}
                    onMouseEnter={e => { if (activeBiome !== b.key) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                    onMouseLeave={e => { if (activeBiome !== b.key) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{
                      width: isTablet ? 30 : 36,
                      height: isTablet ? 30 : 36,
                      borderRadius: 8, flexShrink: 0,
                      background: `${b.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${b.color}55`,
                    }}>
                      <i className={`fas ${b.icon}`} style={{ color: b.color, fontSize: isTablet ? 12 : 14 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: isTablet ? 12 : 13, fontWeight: 600, color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{b.pct} desmatado</div>
                    </div>
                    <div style={{
                      width: isTablet ? 24 : 32,
                      height: 6, borderRadius: 3,
                      background: `linear-gradient(to right, ${b.color}, ${b.color}44)`,
                      opacity: 0.7, flexShrink: 0,
                    }} />
                  </button>
                ))}
              </div>

              {/* Timeline */}
              <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6b7280', textTransform: 'uppercase' }}>
                📊 Linha do Tempo
              </p>
              <TimelineList data={timelineData} />
            </div>

            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              fontSize: 11, color: '#4b5563',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <i className="fas fa-info-circle" />
              <span>Clique em um bioma no mapa para mais detalhes</span>
            </div>
          </aside>
        )}

        {/* ── Legenda flutuante ─────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? (sheetOpen ? 210 : 90) : 32,
          left: 16,
          background: 'rgba(17,24,39,0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          zIndex: 1000,
          transition: 'bottom 0.3s ease',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
            Legenda
          </p>
          {[
            { color: '#ef4444', label: 'Áreas Afetadas' },
            { color: '#3b82f6', label: 'Limites Estaduais' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#d1d5db' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── Bottom sheet mobile ───────────────────────────────── */}
        {isMobile && (
          <>
            {/* Botão flutuante para abrir sheet */}
            {!sheetOpen && (
              <button
                onClick={() => setSheetOpen(true)}
                aria-label="Ver biomas"
                style={{
                  position: 'absolute',
                  bottom: 20,
                  right: 16,
                  zIndex: 1000,
                  background: '#16a34a',
                  border: 'none',
                  borderRadius: 28,
                  padding: '10px 18px',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(22,163,74,0.5)',
                  minHeight: 44,
                }}
              >
                <i className="fas fa-layer-group" style={{ fontSize: 13 }} />
                Biomas
              </button>
            )}

            {/* Sheet */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              background: '#111827',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px 16px 0 0',
              transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
              maxHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Handle */}
              <div
                onClick={() => setSheetOpen(false)}
                style={{ padding: '10px 0 4px', cursor: 'pointer', textAlign: 'center', flexShrink: 0 }}
                aria-label="Fechar painel"
              >
                <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '0 auto' }} />
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}>
                {[
                  { key: 'biomas', label: '🌿 Biomas' },
                  { key: 'timeline', label: '📊 Timeline' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.key ? '2px solid #4ade80' : '2px solid transparent',
                      color: activeTab === tab.key ? '#4ade80' : '#6b7280',
                      fontSize: 13,
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      padding: '10px 0',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      minHeight: 44,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Conteúdo */}
              <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
                {activeTab === 'biomas' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {biomeSidebar.map(b => (
                      <button
                        key={b.key}
                        onClick={() => focusBiome(b)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 10px',
                          borderRadius: 10, cursor: 'pointer',
                          border: activeBiome === b.key
                            ? `1px solid ${b.color}`
                            : '1px solid rgba(255,255,255,0.08)',
                          background: activeBiome === b.key ? `${b.color}22` : 'rgba(255,255,255,0.04)',
                          textAlign: 'left',
                          minHeight: 52,
                        }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                          background: `${b.color}33`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `1px solid ${b.color}55`,
                        }}>
                          <i className={`fas ${b.icon}`} style={{ color: b.color, fontSize: 12 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{b.pct} desmatado</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {activeTab === 'timeline' && (
                  <TimelineList data={timelineData} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Sub-componente Timeline ─────────────────────────────────────────────────

function TimelineList({ data }) {
  return (
    <div style={{ position: 'relative' }}>
      {data.map((item, i) => (
        <div key={item.year} style={{ display: 'flex', gap: 12, marginBottom: 16, position: 'relative' }}>
          {i < data.length - 1 && (
            <div style={{
              position: 'absolute', left: 11, top: 22,
              width: 2, bottom: -16,
              background: 'linear-gradient(to bottom, #16a34a44, transparent)',
            }} />
          )}
          <div style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            background: '#16a34a22',
            border: '2px solid #16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
          </div>
          <div>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700,
              color: '#4ade80', background: '#16a34a22',
              borderRadius: 4, padding: '1px 6px', marginBottom: 3,
            }}>{item.year}</div>
            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
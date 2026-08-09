import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import logo from '../assets/logo2.png'
import Reviews from '../components/Reviews'

const teamMembers = [
  { name: 'Vinicius',    photo: null },
  { name: 'Bruno',       photo: null },
  { name: 'Cesar',       photo: null },
  { name: 'João Flávio', photo: null },
]

const animals = [
  { name: 'Onça-pintada',        status: 'Criticamente ameaçada', statusBg: '#fee2e2', statusColor: '#991b1b', description: 'Perdeu 50% de seu habitat na Mata Atlântica nos últimos 15 anos.',    biome: 'Mata Atlântica', population: '-60%', img: 'https://static.biologianet.com/2020/05/onca-pintada.jpg' },
  { name: 'Arara-azul',          status: 'Em perigo',             statusBg: '#fef3c7', statusColor: '#92400e', description: 'Apenas 6.500 indivíduos restantes devido à perda de habitat no Pantanal.', biome: 'Pantanal',      population: '-40%', img: 'https://imagens.ebc.com.br/7mrmO9tFuEk0CPiJHKLEqTCk9R4=/1170x700/smart/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/2024/09/18/arara-azul-de-lear_01_0.jpg?itok=wDa3CBCI' },
  { name: 'Mico-leão-dourado',   status: 'Criticamente ameaçada', statusBg: '#fee2e2', statusColor: '#991b1b', description: 'Restam apenas 2.500 indivíduos na natureza devido ao desmatamento.',      biome: 'Mata Atlântica', population: '-70%', img: 'https://static.todamateria.com.br/upload/mi/co/micoleao-cke.jpg' },
  { name: 'Lobo-guará',          status: 'Vulnerável',            statusBg: '#fef9c3', statusColor: '#854d0e', description: 'Perdeu 30% de seu habitat no Cerrado nos últimos 20 anos.',               biome: 'Cerrado',        population: '-35%', img: 'https://s3.static.brasilescola.uol.com.br/be/2020/08/lobo-guara.jpg' },
  { name: 'Tucano-de-bico-preto',status: 'Em perigo',             statusBg: '#fef3c7', statusColor: '#92400e', description: 'População em declínio devido à fragmentação florestal.',                  biome: 'Amazônia',       population: '-25%', img: 'https://www.parquedasaves.com.br/wp-content/uploads/2019/08/large-6.jpg' },
  { name: 'Perereca-verde-da-mata',status:'Criticamente ameaçada',statusBg: '#fee2e2', statusColor: '#991b1b', description: 'Endêmica de pequenas áreas ameaçadas pelo desmatamento.',                 biome: 'Mata Atlântica', population: '-80%', img: 'https://portal.pcs.ifsuldeminas.edu.br/images/campus_pocos_caldas/noticias/2020/junho/20200630/perereca-folhagem/figura_1.jpg' },
]

const solutions = [
  { icon: 'fa-shopping-bag',   title: 'Consumo Consciente',  text: 'Evite produtos que contribuem para o desmatamento, como carne de origem duvidosa, madeira ilegal e óleo de palma não sustentável.' },
  { icon: 'fa-hands-helping',  title: 'Apoie Organizações',  text: 'Contribua com instituições que trabalham para preservar os biomas brasileiros e combater o desmatamento ilegal.' },
  { icon: 'fa-vote-yea',       title: 'Engajamento Político',text: 'Apoie políticas públicas e candidatos comprometidos com a preservação ambiental e o desenvolvimento sustentável.' },
  { icon: 'fa-tree',           title: 'Reflorestamento',     text: 'Participe de iniciativas de plantio de árvores nativas e recuperação de áreas degradadas em sua região.' },
  { icon: 'fa-graduation-cap', title: 'Educação Ambiental',  text: 'Divulgue informações sobre a importância da preservação e os impactos do desmatamento em sua comunidade.' },
  { icon: 'fa-mobile-alt',     title: 'Denuncie',            text: 'Use aplicativos como "Denúncia Ambiente" para reportar atividades ilegais de desmatamento que você identificar.' },
]

const stats = [
  { icon: 'fa-chart-line',          value: '+30%',     label: 'Aumento no desmatamento na última década',      accent: '#4ade80' },
  { icon: 'fa-fire',                value: '1.5mi ha', label: 'Área queimada anualmente no Brasil',            accent: '#f97316' },
  { icon: 'fa-exclamation-triangle',value: '1.173',    label: 'Espécies animais ameaçadas de extinção',        accent: '#facc15' },
  { icon: 'fa-map-marked-alt',      value: '6 biomas', label: 'Biomas brasileiros afetados pelo desmatamento', accent: '#60a5fa' },
]

function AnimatedBars() {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)
  const biomas = [
    { name: 'Amazônia',       value: 780, color: '#16a34a' },
    { name: 'Cerrado',        value: 520, color: '#ca8a04' },
    { name: 'Mata Atlântica', value: 320, color: '#3b82f6' },
    { name: 'Caatinga',       value: 150, color: '#f97316' },
    { name: 'Pantanal',       value: 90,  color: '#b45309' },
    { name: 'Pampa',          value: 60,  color: '#4ade80' },
  ]
  const max = 780
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ background: '#1a1f2e', borderRadius: 12, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {biomas.map((b, i) => {
        const pct = Math.round((b.value / max) * 100)
        const labelInside = pct > 20
        return (
          <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 110, fontSize: 12, fontWeight: 600, color: '#ffffff', flexShrink: 0 }}>{b.name}</div>
            <div style={{ flex: 1, height: 36, background: '#0f1117', borderRadius: 6, overflow: 'visible', display: 'flex', alignItems: 'center' }}>
              <div style={{ height: 36, borderRadius: 6, backgroundColor: b.color, width: animated ? `${pct}%` : '0%', transition: `width 900ms cubic-bezier(.2,.8,.2,1) ${i * 140}ms`, display: 'flex', alignItems: 'center', justifyContent: labelInside ? 'flex-end' : 'flex-start', paddingRight: labelInside ? 8 : 0, flexShrink: 0 }} />
              {animated && <span style={{ fontSize: 11, fontWeight: 700, color: labelInside ? '#fff' : b.color, marginLeft: labelInside ? -((String(b.value).length * 7) + 28) : 6, whiteSpace: 'nowrap', flexShrink: 0 }}>{b.value} mil</span>}
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
        <div style={{ width: 110, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#ffffff', fontWeight: 600 }}>
          <span>0</span><span>195</span><span>390</span><span>585</span><span>780 mil km²</span>
        </div>
      </div>
    </div>
  )
}

function DonutChart() {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)
  const biomas = [
    { name: 'Amazônia',       value: 780, color: '#16a34a' },
    { name: 'Cerrado',        value: 520, color: '#ca8a04' },
    { name: 'Mata Atlântica', value: 320, color: '#3b82f6' },
    { name: 'Caatinga',       value: 150, color: '#f97316' },
    { name: 'Pantanal',       value: 90,  color: '#b45309' },
    { name: 'Pampa',          value: 60,  color: '#4ade80' },
  ]
  const total = biomas.reduce((s, b) => s + b.value, 0)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  let start = 0
  const slices = biomas.map(b => { const pct = (b.value / total) * 100; const s = { ...b, start, end: start + pct }; start += pct; return s })
  return (
    <div ref={ref} style={{ marginTop: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', textTransform: 'uppercase', marginBottom: 16 }}>Distribuição por Bioma</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 180, height: 180, borderRadius: '50%', background: animated ? `conic-gradient(${slices.map(s => `${s.color} ${s.start}% ${s.end}%`).join(',')})` : '#1a1f2e', transition: 'background 1s ease', mask: 'radial-gradient(circle, transparent 55px, black 56px)', WebkitMask: 'radial-gradient(circle, transparent 55px, black 56px)', flexShrink: 0 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', width: '100%' }}>
          {biomas.map(b => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: b.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#ffffff' }}>{b.name}</span>
              <span style={{ fontSize: 11, color: '#ffffff', fontWeight: 600, marginLeft: 'auto' }}>{Math.round((b.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LineChart() {
  const ref = useRef(null)
  const [dims, setDims] = useState({ width: 600, ready: false })
  const [animated, setAnimated] = useState(false)
  const biomas = [
    { name: 'Amazônia', value: 780, color: '#16a34a' },
    { name: 'Cerrado', value: 520, color: '#ca8a04' },
    { name: 'Mata Atlântica', value: 320, color: '#3b82f6' },
    { name: 'Caatinga', value: 150, color: '#f97316' },
    { name: 'Pantanal', value: 90, color: '#b45309' },
    { name: 'Pampa', value: 60, color: '#4ade80' },
  ]
  const margin = { left: 36, right: 8, top: 16, bottom: 52 }
  const height = 240
  const maxVal = 780
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => { const w = entries[0].contentRect.width; if (w > 0) setDims({ width: w, ready: true }) })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const plotW = Math.max(100, dims.width - margin.left - margin.right)
  const plotH = height - margin.top - margin.bottom
  const points = biomas.map((b, i) => ({ x: margin.left + (i / (biomas.length - 1)) * plotW, y: margin.top + (1 - b.value / maxVal) * plotH, ...b }))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  return (
    <div ref={ref} style={{ marginTop: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', textTransform: 'uppercase', marginBottom: 12 }}>Comparativo (mil km²)</p>
      {dims.ready && (
        <svg viewBox={`0 0 ${dims.width} ${height}`} style={{ width: '100%', height }} preserveAspectRatio="xMinYMin meet">
          {[0,1,2,3,4].map(i => { const y = margin.top + (i/4)*plotH; const val = Math.round(maxVal*(1-i/4)); return <g key={i}><line x1={margin.left} x2={margin.left+plotW} y1={y} y2={y} stroke="rgba(211, 205, 205, 0.23)" strokeWidth="1"/><text x={margin.left-6} y={y+4} textAnchor="end" fontSize="10" fill="#ffffff">{val}</text></g> })}
          <path d={pathD} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: animated ? 1 : 0, transition: 'opacity 600ms ease' }} />
          {points.map((p, i) => (
            <g key={p.name} style={{ opacity: animated ? 1 : 0, transition: `opacity 0.4s ease ${i*0.08}s` }}>
              <circle cx={p.x} cy={p.y} r={5} fill={p.color} stroke="#0f1117" strokeWidth="2"/>
              <text x={p.x} y={margin.top+plotH+28} textAnchor="middle" fontSize="10" fill="#ffffff">{p.name.split(' ')[0]}</text>
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}

function RadarChart() {
  const ref = useRef(null)
  const [dims, setDims] = useState({ width: 300, ready: false })
  const [animated, setAnimated] = useState(false)
  const biomas = [
    { name: 'Amazônia', value: 780, color: '#16a34a' },
    { name: 'Cerrado', value: 520, color: '#ca8a04' },
    { name: 'Mata Atlântica', value: 320, color: '#3b82f6' },
    { name: 'Caatinga', value: 150, color: '#f97316' },
    { name: 'Pantanal', value: 90, color: '#b45309' },
    { name: 'Pampa', value: 60, color: '#4ade80' },
  ]
  const maxVal = 780; const n = biomas.length; const levels = 4
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => { const w = entries[0].contentRect.width; if (w > 0) setDims({ width: Math.min(w, 300), ready: true }) })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const size = dims.width; const margin = 40; const cx = size/2; const cy = size/2; const radius = size/2 - margin
  const angle = i => -Math.PI/2 + (2*Math.PI*i)/n
  const pt = (i, r) => ({ x: cx + Math.cos(angle(i))*r, y: cy + Math.sin(angle(i))*r })
  const gridPolygons = Array.from({ length: levels }, (_, l) => Array.from({ length: n }, (_, i) => pt(i, radius*((l+1)/levels))).map(p => `${p.x},${p.y}`).join(' '))
  const areaPoints = biomas.map((b, i) => pt(i, radius*(b.value/maxVal)))
  const areaD = areaPoints.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  return (
    <div ref={ref} style={{ marginTop: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', textTransform: 'uppercase', marginBottom: 12 }}>Radar Comparativo</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {dims.ready && (
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
            {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill={i%2===0?'rgba(74,222,128,0.04)':'rgba(74,222,128,0.02)'} stroke="rgba(74,222,128,0.15)" strokeWidth="1"/>)}
            {biomas.map((b, i) => { const outer = pt(i, radius); const label = pt(i, radius+16); const dx = Math.cos(angle(i)); const anchor = Math.abs(dx)<0.2?'middle':dx>0?'start':'end'; return <g key={b.name}><line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/><text x={label.x} y={label.y+4} textAnchor={anchor} fontSize="10" fill="#ffffff">{b.name.split(' ')[0]}</text></g> })}
            <path d={areaD} fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" style={{ opacity: animated?1:0, transition: 'opacity 900ms ease' }}/>
            {areaPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={biomas[i].color} stroke="#0f1117" strokeWidth="2" style={{ opacity: animated?1:0, transition: `opacity 0.4s ease ${i*0.1}s` }}/>)}
          </svg>
        )}
      </div>
    </div>
  )
}

function AnimatedTimeline() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [svgPath, setSvgPath] = useState({ d: '', width: 0, height: 0 })
  const [lineAnimated, setLineAnimated] = useState(false)
  const containerRef = useRef(null)
  const dotRefs = useRef([])
  const items = [
    { year: '2005', title: 'Pampa sofre impactos crescentes', text: 'Expansão agropecuária avança sobre os campos nativos' },
    { year: '2010', title: 'Caatinga afetada', text: 'Caatinga tem 45% de sua área original desmatada' },
    { year: '2013', title: 'Novo Código Florestal', text: 'Brasil aprova novo Código Florestal com impacto nos biomas' },
    { year: '2015', title: 'Queimadas no Pantanal', text: 'Pantanal perde 12% de sua área para queimadas' },
    { year: '2018', title: 'Mata Atlântica reduzida', text: 'Mata Atlântica tem apenas 12,4% de sua cobertura original' },
    { year: '2020', title: 'Perdas no Cerrado', text: 'Cerrado perde 7.340 km² de vegetação nativa' },
    { year: '2022', title: 'Seca no Pantanal', text: 'Pantanal enfrenta pior seca em décadas' },
    { year: '2023', title: 'Recorde de desmatamento', text: 'Recorde de desmatamento na Amazônia: 11.568 km²' },
  ]
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { items.forEach((_, i) => setTimeout(() => setVisibleCount(p => Math.max(p, i+1)), i*80)); obs.disconnect() } }, { threshold: 0.05 })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])
  const buildConnector = useCallback(() => {
    if (!containerRef.current) return
    const dots = dotRefs.current.filter(Boolean)
    if (dots.length < 2) return
    const cRect = containerRef.current.getBoundingClientRect()
    const width = containerRef.current.scrollWidth
    const height = containerRef.current.scrollHeight
    const points = dots.map(d => { const r = d.getBoundingClientRect(); return { x: r.left + r.width/2 - cRect.left, y: r.top + r.height/2 - cRect.top } })
    let d = ''
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      if (i === 0) { d += `M ${p.x} ${p.y}` }
      else { const prev = points[i-1]; const midY = (prev.y + p.y)/2; d += ` C ${prev.x} ${midY} ${p.x} ${midY} ${p.x} ${p.y}` }
    }
    setSvgPath({ d, width, height })
    setTimeout(() => setLineAnimated(true), 100)
  }, [])
  useEffect(() => { if (visibleCount < items.length) return; const t = setTimeout(buildConnector, 200); return () => clearTimeout(t) }, [visibleCount, buildConnector])
  useEffect(() => { let t = null; const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(buildConnector, 120) }); if (containerRef.current) ro.observe(containerRef.current); return () => ro.disconnect() }, [buildConnector])
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {svgPath.d && (
        <svg viewBox={`0 0 ${svgPath.width} ${svgPath.height}`} preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: svgPath.height, pointerEvents: 'none', zIndex: 1 }}>
          <path d={svgPath.d} fill="none" stroke="rgba(74,222,128,0.12)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'blur(6px)', opacity: lineAnimated ? 0.9 : 0, transition: 'opacity 700ms ease' }}/>
          <path d={svgPath.d} fill="none" stroke="rgba(74,222,128,0.35)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: lineAnimated ? 1 : 0, transition: 'opacity 600ms ease 80ms' }}/>
        </svg>
      )}
      {items.map((item, i) => {
        const isLeft = i % 2 === 0
        return (
          <div key={item.year} style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 20, minHeight: 70, zIndex: 2 }}>
            <div style={{ flex: 1, paddingRight: 20, textAlign: 'right', opacity: visibleCount > i ? 1 : 0, transform: visibleCount > i ? 'translateX(0)' : 'translateX(-20px)', transition: `opacity 400ms ease ${i*80}ms, transform 400ms ease ${i*80}ms` }}>
              {isLeft && <>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', marginBottom: 2 }}>{item.year}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#ffffff', marginTop: 2 }}>{item.text}</div>
              </>}
            </div>
            <div ref={el => dotRefs.current[i] = el} style={{ width: 16, height: 16, borderRadius: '50%', background: '#16a34a', border: '2px solid #0f1117', boxShadow: '0 0 0 2px #4ade80', flexShrink: 0, zIndex: 3, opacity: visibleCount > i ? 1 : 0, transform: visibleCount > i ? 'scale(1)' : 'scale(0)', transition: `opacity 300ms ease ${i*80}ms, transform 300ms ease ${i*80}ms` }} />
            <div style={{ flex: 1, paddingLeft: 20, textAlign: 'left', opacity: visibleCount > i ? 1 : 0, transform: visibleCount > i ? 'translateX(0)' : 'translateX(20px)', transition: `opacity 400ms ease ${i*80}ms, transform 400ms ease ${i*80}ms` }}>
              {!isLeft && <>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', marginBottom: 2 }}>{item.year}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#ffffff', marginTop: 2 }}>{item.text}</div>
              </>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Home({ user, onLoginRequest }) {
  const navigate = useNavigate()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const timerRef = useRef(null)

  const slides = [
    { url: 'https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/onca-pintada.png', label: 'Onça-pintada' },
    { url: 'https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/arara-azul-de-lear_01_0.png', label: 'Arara-azul' },
    { url: 'https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/lobo-guara.png', label: 'Lobo-guará' },
    { url: 'https://wqvxjttidoxcblkfjoaf.supabase.co/storage/v1/object/public/animals/micoleao-cke.png', label: 'Mico-leão-dourado' },
  ]

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.pageYOffset > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [paused])

  useEffect(() => {
    if (!document.getElementById('maplibre-css')) {
      const link = document.createElement('link'); link.id = 'maplibre-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.css'; document.head.appendChild(link)
    }
    const load = () => new Promise(resolve => { if (window.maplibregl) { resolve(); return }; const s = document.createElement('script'); s.src = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.js'; s.onload = resolve; document.body.appendChild(s) })
    load().then(() => {
      if (!document.getElementById('mapPreview')) return
      const map = new window.maplibregl.Map({ container: 'mapPreview', style: 'https://demotiles.maplibre.org/style.json', center: [-52.8, -14.2], zoom: 3.5, minZoom: 2, maxZoom: 10 })
      map.on('load', () => {
        map.addSource('desmatamento', { type: 'geojson', data: '/meuarquivo4.json' })
        map.addLayer({ id: 'areas-extrusao', type: 'fill-extrusion', source: 'desmatamento', paint: { 'fill-extrusion-color': '#ef4444', 'fill-extrusion-opacity': 0.85, 'fill-extrusion-height': 500000 } })
        map.addLayer({ id: 'areas-borda', type: 'line', source: 'desmatamento', paint: { 'line-color': '#dc2626', 'line-width': 5.5 } })
        map.on('click', 'areas-extrusao', e => { const props = e.features[0].properties; new window.maplibregl.Popup().setLngLat(e.lngLat).setHTML(Object.entries(props).map(([k,v]) => `<b>${k}</b>: ${v}`).join('<br>')).addTo(map) })
      })
    })
  }, [])

  const goToSlide = i => { setCurrentSlide(i); clearInterval(timerRef.current); setPaused(false) }
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }
  const navLinks = [['mapa','Mapa'],['animais','Animais'],['dados','Dados'],['solucoes','Soluções'],['equipe','Equipe'],['avaliacoes','Avaliações']]

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#fff' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .nav-link { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500; padding: 6px 0; transition: color 0.2s; }
        .nav-link:hover { color: #4ade80; }
        .animal-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .animal-card:hover { transform: translateY(-8px); box-shadow: 0 24px 40px rgba(0,0,0,0.15); }
        .solution-card { transition: background 0.2s, transform 0.2s; }
        .solution-card:hover { background: rgba(74,222,128,0.08) !important; transform: translateY(-4px); }
        .team-card { transition: transform 0.2s, box-shadow 0.2s; }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(0,0,0,0.3); }
        .hidden-mobile { display: flex; }
        .show-mobile { display: none !important; }

        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          .section-pad { padding: 48px 16px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .animals-grid { grid-template-columns: 1fr !important; }
          .solutions-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr 1fr !important; }
          .dados-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .cta-buttons { flex-direction: column !important; align-items: center !important; }
          .feedback-form { flex-direction: column !important; }
          .feedback-form input { width: 100% !important; min-width: unset !important; box-sizing: border-box !important; }
          .footer-bottom { flex-direction: column !important; text-align: center !important; }
          .regional-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 480px) {
          .section-pad { padding: 36px 12px !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .regional-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(21,128,61,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logo} alt="EcoMapBrasil" style={{ height: 40, width: 'auto' }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>EcoMapBrasil</span>
          </div>
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden-mobile">
            {navLinks.map(([id, label]) => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {user.photoURL && <img src={user.photoURL} alt={user.displayName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4ade80' }} />}
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{user.displayName || user.email}</span>
                <button onClick={() => signOut(auth)} className="nav-link" style={{ color: '#fca5a5' }}>Sair</button>
              </div>
            ) : (
              <button onClick={onLoginRequest} style={{ background: '#4ade80', color: '#14532d', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
            )}
          </nav>
          <button onClick={() => setMenuOpen(p => !p)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }} className="show-mobile">
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: '#166534', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 24px' }}>
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ display: 'block', background: 'none', border: 'none', color: '#d1d5db', fontSize: 15, padding: '10px 0', cursor: 'pointer', width: '100%', textAlign: 'left' }}>{label}</button>
            ))}
            {user ? (
             <button 
  onClick={() => signOut(auth)} 
  onTouchEnd={() => signOut(auth)}
  style={{ display: 'block', background: 'none', border: 'none', color: '#fca5a5', fontSize: 15, padding: '10px 0', cursor: 'pointer', width: '100%', textAlign: 'left' }}
>
  Sair
</button>
            ) : (
             <button 
  onClick={() => { onLoginRequest(); setMenuOpen(false) }} 
  onTouchEnd={() => { onLoginRequest(); setMenuOpen(false) }}
  style={{ display: 'block', background: 'none', border: 'none', color: '#4ade80', fontSize: 15, padding: '10px 0', cursor: 'pointer', width: '100%', textAlign: 'left' }}
>
  Entrar
</button>
            )}
          </div>
        )}
      </header>

      {/* ── SLIDESHOW ── */}
      <section style={{ position: 'relative', height: 'calc(100vh - 64px)' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {slides.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.url}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: currentSlide === i ? 1 : 0, transition: 'opacity 1s ease-in-out' }} />
        ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,46,22,0.65) 0%, rgba(0,0,0,0.3) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600, letterSpacing: 0.5 }}>Monitoramento em tempo real</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 20, maxWidth: 700, lineHeight: 1.2 }}>
            O Desmatamento no Brasil é maior do que você imagina
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: 'rgba(255,255,255,0.75)', marginBottom: 36, maxWidth: 560 }}>
            Descubra como a perda de habitat está afetando nossa biodiversidade em todas as regiões do país.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => scrollTo('mapa')} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#15803d'} onMouseLeave={e => e.currentTarget.style.background='#16a34a'}>
              <i className="fas fa-map-marked-alt" /> Ver Mapa
            </button>
            <button onClick={() => scrollTo('animais')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <i className="fas fa-paw" /> Espécies Ameaçadas
            </button>
          </div>
        </div>
        <button onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 42, height: 42, color: '#fff', cursor: 'pointer', fontSize: 14 }}>
          <i className="fas fa-chevron-left" />
        </button>
        <button onClick={() => goToSlide((currentSlide + 1) % slides.length)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 42, height: 42, color: '#fff', cursor: 'pointer', fontSize: 14 }}>
          <i className="fas fa-chevron-right" />
        </button>
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 8 }}>
          {slides.map((_, i) => <button key={i} onClick={() => goToSlide(i)} style={{ width: currentSlide===i?24:8, height: 8, borderRadius: 4, background: currentSlide===i?'#4ade80':'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />)}
        </div>
      </section>

      {/* ── CRÉDITOS ── */}
      <div style={{ background: '#14532d', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 24px', textAlign: 'center', fontSize: 12, color: '#f1f1f1' }}>
        © 2025 EcoMapBrasil — Dados obtidos de fontes públicas como INPE, IBGE e MapBiomas Alerta.
      </div>

      {/* ── STATS ── */}
      <section className="section-pad" style={{ background: '#fff', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#16a34a', textTransform: 'uppercase', marginBottom: 12 }}>Impacto Real</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#111', marginBottom: 48 }}>O Desmatamento em Números</h2>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {stats.map(s => (
              <div key={s.value} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '28px 24px', textAlign: 'center', transition: 'border-color 0.2s, transform 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.transform = 'translateY(-4px)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#bbf7d0'; e.currentTarget.style.transform = '' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${s.accent}18`, border: `1px solid ${s.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <i className={`fas ${s.icon}`} style={{ fontSize: 22, color: s.accent }} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#111', marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAPA ── */}
      <section id="mapa" className="section-pad" style={{ background: '#fff', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#16a34a', textTransform: 'uppercase', marginBottom: 12 }}>Visualização</p>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#111', marginBottom: 12 }}>Mapa do Desmatamento</h2>
          <p style={{ color: '#6b7280', maxWidth: 560, margin: '0 auto 32px' }}>Explore as áreas mais afetadas pelo desmatamento em todas as regiões do Brasil.</p>
          <button onClick={() => navigate('/mapa')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#15803d'} onMouseLeave={e => e.currentTarget.style.background='#16a34a'}>
            <i className="fas fa-map-marked-alt" /> Ver mapa do Desmatamento
          </button>
        </div>
      </section>

      {/* ── ANIMAIS ── */}
      <section id="animais" className="section-pad" style={{ background: '#f8fafc', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#16a34a', textTransform: 'uppercase', marginBottom: 12 }}>Biodiversidade</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#111', marginBottom: 12 }}>Espécies Ameaçadas</h2>
          <p style={{ textAlign: 'center', color: '#4b5563', maxWidth: 560, margin: '0 auto 48px' }}>Conheça as espécies que estão perdendo seu habitat natural.</p>
          <div className="animals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {animals.map(a => (
              <div key={a.name} className="animal-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                  <img src={a.img} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}/>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: a.statusBg, color: a.statusColor, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{a.status}</div>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>{a.name}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>{a.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}><i className="fas fa-map-marker-alt" style={{ color: '#4ade80' }} /> {a.biome}</span>
                    <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><i className="fas fa-arrow-down" /> {a.population} pop.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={() => navigate('/animais')} style={{ background: 'none', border: '1px solid #16a34a', color: '#16a34a', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#f0fdf4'} onMouseLeave={e => e.currentTarget.style.background='none'}>
              <i className="fas fa-book mr-2" /> Ver Lista Completa
            </button>
          </div>
        </div>
      </section>

      {/* ── DADOS ── */}
      <section id="dados" className="section-pad" style={{ background: '#f0fdf4', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#16a34a', textTransform: 'uppercase', marginBottom: 12 }}>Análise</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#111', marginBottom: 12 }}>Evolução do Desmatamento</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', maxWidth: 560, margin: '0 auto 48px' }}>Veja como o desmatamento evoluiu ao longo dos anos nos biomas brasileiros.</p>
         <div className="dados-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', textTransform: 'uppercase', marginBottom: 16 }}>Área Desmatada por Bioma</p>
              <AnimatedBars />
              <DonutChart />
              <LineChart />
              <RadarChart />
            </div>
            <div style={{ background: '#14532d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '28px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff', textTransform: 'uppercase', marginBottom: 24 }}>Linha do Tempo</p>
              <AnimatedTimeline />
            </div>
          </div>
          <div style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px', marginTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', textTransform: 'uppercase', marginBottom: 20 }}>Comparação Regional</p>
            <div className="regional-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20 }}>
              {[
                { label: 'Norte (Amazônia)',                   pct: 78, color: '#16a34a' },
                { label: 'Centro-Oeste (Cerrado/Pantanal)',    pct: 45, color: '#ca8a04' },
                { label: 'Nordeste (Caatinga)',                pct: 15, color: '#f97316' },
                { label: 'Sudeste/Sul (Mata Atlântica/Pampa)', pct: 32, color: '#3b82f6' },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#ffffff' }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#1a1f2e', borderRadius: 4 }}>
                    <div style={{ height: 8, borderRadius: 4, background: r.color, width: `${r.pct}%`, transition: 'width 900ms ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUÇÕES ── */}
      <section id="solucoes" className="section-pad" style={{ background: '#15803d', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf7d0', textTransform: 'uppercase', marginBottom: 12 }}>Ação</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>O que podemos fazer?</h2>
          <p style={{ textAlign: 'center', color: '#fff', maxWidth: 560, margin: '0 auto 48px' }}>Ações individuais e coletivas para combater o desmatamento.</p>
          <div className="solutions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 16 }}>
            {solutions.map(s => (
              <div key={s.title} className="solution-card" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '24px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className={`fas ${s.icon}`} style={{ fontSize: 20, color: '#4ade80' }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#d1fae5', lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPE ── */}
      <section id="equipe" className="section-pad" style={{ background: '#fff', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#16a34a', textTransform: 'uppercase', marginBottom: 12 }}>Pessoas</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#111', marginBottom: 12 }}>Nossa Equipe</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', maxWidth: 560, margin: '0 auto 48px' }}>O time por trás deste projeto de educação ambiental.</p>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {teamMembers.map(m => (
              <div key={m.name} className="team-card" style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 20, padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '3px solid #fff', boxShadow: '0 4px 12px rgba(22,163,74,0.2)' }}>
                  {m.photo ? <img src={m.photo} alt={m.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} /> : <i className="fas fa-user" style={{ fontSize: 28, color: '#16a34a' }} />}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 10 }}>{m.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <a href="#" style={{ color: '#9ca3af', fontSize: 16, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#16a34a'} onMouseLeave={e => e.currentTarget.style.color='#9ca3af'}><i className="fab fa-linkedin" /></a>
                  <a href="#" style={{ color: '#9ca3af', fontSize: 16, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#16a34a'} onMouseLeave={e => e.currentTarget.style.color='#9ca3af'}><i className="fab fa-github" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVALIAÇÕES ── */}
      <div id="avaliacoes">
        <Reviews user={user} onLoginRequest={onLoginRequest} />
      </div>

      {/* ── CTA ── */}
      <section className="section-pad" style={{ background: '#14532d', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>Juntos podemos fazer a Diferença</h2>
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 36 }}>O desmatamento é um problema de todos nós. Compartilhe e ajude a conscientizar.</p>
          <div className="cta-buttons" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ background: '#fff', color: '#0f1117', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background='#fff'}>
              <i className="fas fa-share-alt" /> Compartilhar
            </button>
            <a href="dashboard_alerts-shapefile.zip" style={{ background: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background='none'}>
              <i className="fas fa-download" /> Baixar Dados
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#052e16', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '56px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <img src={logo} alt="EcoMapBrasil" style={{ height: 32 }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>EcoMapBrasil</span>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginBottom: 16 }}>Educando e conscientizando sobre os impactos do desmatamento na biodiversidade brasileira.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['fa-facebook-f','fa-twitter','fa-instagram','fa-linkedin-in'].map(ic => <a key={ic} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 13, transition: 'color 0.2s, background 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color='#4ade80'; e.currentTarget.style.background='rgba(74,222,128,0.1)' }} onMouseLeave={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.background='rgba(255,255,255,0.06)' }}><i className={`fab ${ic}`}/></a>)}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Links</h4>
              {[['mapa','Mapa Interativo'],['animais','Espécies Ameaçadas'],['dados','Dados'],['solucoes','Como Ajudar']].map(([id, label]) => <button key={id} onClick={() => scrollTo(id)} style={{ display: 'block', background: 'none', border: 'none', color: '#4b5563', fontSize: 13, padding: '5px 0', cursor: 'pointer', transition: 'color 0.2s', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.color='#4ade80'} onMouseLeave={e => e.currentTarget.style.color='#4b5563'}>{label}</button>)}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Recursos</h4>
              {[['https://alerta.mapbiomas.org/relatorio/','Relatórios'],['https://g1.globo.com/busca/?q=desmatamento','Artigos'],['https://www.ibflorestas.org.br/conteudo/leis-ambientais','Legislação'],['#','FAQ']].map(([href, label]) => <a key={label} href={href} style={{ display: 'block', color: '#4b5563', fontSize: 13, padding: '5px 0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#4ade80'} onMouseLeave={e => e.currentTarget.style.color='#4b5563'}>{label}</a>)}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Contato</h4>
              {[['fa-envelope','exemplo@email.com'],['fa-phone-alt','(xx) xxxxx-xxxx'],['fa-map-marker-alt','Matão, São Paulo, Brasil']].map(([ic, text]) => <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#4b5563', fontSize: 13 }}><i className={`fas ${ic}`} style={{ color: '#4ade80', width: 14 }} />{text}</div>)}
            </div>
          </div>
          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12, color: '#374151' }}>
            <span>© 2025 Brasil em Alerta. Todos os direitos reservados.</span>
            <span>Desenvolvido com ❤️ pela equipe Vida Terrestre</span>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP ── */}
      {showBackToTop && (
        <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 28, right: 28, width: 44, height: 44, borderRadius: '50%', background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, boxShadow: '0 4px 16px rgba(22,163,74,0.4)', transition: 'background 0.2s, transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40 }} onMouseEnter={e => { e.currentTarget.style.background='#15803d'; e.currentTarget.style.transform='translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background='#16a34a'; e.currentTarget.style.transform='' }}>
          <i className="fas fa-arrow-up" />
        </button>
      )}
    </div>
  )
}
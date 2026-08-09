import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: readonly ? 16 : 28,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.15s',
            userSelect: 'none'
          }}
        >★</span>
      ))}
    </div>
  )
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'agora mesmo'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `há ${weeks} semana${weeks > 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  if (months < 12) return `há ${months} ${months > 1 ? 'meses' : 'mês'}`
  return `há ${Math.floor(months / 12)} ano${Math.floor(months / 12) > 1 ? 's' : ''}`
}

export default function Reviews({ user, onLoginRequest }) {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [mostrarTodas, setMostrarTodas] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'avaliacoes'), orderBy('criadoEm', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setAvaliacoes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const mediaNotas = avaliacoes.length
    ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1)
    : null

  const avaliacoesVisiveis = mostrarTodas ? avaliacoes : avaliacoes.slice(0, 6)

  async function enviarAvaliacao() {
    setErro('')
    if (!user) { onLoginRequest(); return }
    if (nota === 0) { setErro('Selecione uma nota de 1 a 5 estrelas.'); return }
    if (!comentario.trim()) { setErro('Escreva um comentário.'); return }
    setEnviando(true)
    await addDoc(collection(db, 'avaliacoes'), {
      uid: user.uid,
      nome: user.displayName || 'Usuário',
      photoURL: user.photoURL || '',
      nota,
      comentario: comentario.trim(),
      criadoEm: new Date()
    })
    setNota(0)
    setComentario('')
    setSucesso(true)
    setTimeout(() => setSucesso(false), 3000)
    setEnviando(false)
  }

  return (
    <section style={{ background: '#f8fafc', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#16a34a', textTransform: 'uppercase', marginBottom: 12 }}>Comunidade</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#111', marginBottom: 8 }}>Avaliações do Site</h2>

        {mediaNotas && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#111' }}>{mediaNotas}</span>
              <div>
                <StarRating value={Math.round(mediaNotas)} readonly />
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Classificação do site • {avaliacoes.length} avaliações</p>
              </div>
            </div>
          </div>
        )}

        {!mediaNotas && <div style={{ marginBottom: 48 }} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
          {avaliacoesVisiveis.map(av => (
            <div key={av.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {av.photoURL
                    ? <img src={av.photoURL} alt={av.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{av.nome.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{av.nome}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating value={av.nota} readonly />
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {av.criadoEm?.toDate ? timeAgo(av.criadoEm.toDate()) : 'agora mesmo'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{av.comentario}</p>
            </div>
          ))}
        </div>

        {avaliacoes.length > 6 && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <button
              onClick={() => setMostrarTodas(p => !p)}
              style={{ background: 'none', border: '1px solid #16a34a', color: '#16a34a', borderRadius: 10, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {mostrarTodas ? 'Mostrar menos' : `Mostrar mais (${avaliacoes.length - 6} restantes)`}
            </button>
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '32px', maxWidth: 600, margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 20 }}>
            {user ? 'Deixe sua avaliação' : 'Faça login para avaliar'}
          </h3>

          {sucesso && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
              ✓ Avaliação enviada com sucesso!
            </div>
          )}

          {erro && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
              {erro}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Sua nota:</p>
            <StarRating value={nota} onChange={setNota} />
          </div>

          <textarea
            placeholder={user ? 'Escreva seu comentário sobre o site...' : 'Faça login para deixar um comentário...'}
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            disabled={!user}
            rows={4}
            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: user ? '#fff' : '#f9fafb', color: '#374151', marginBottom: 14 }}
          />

          <button
            onClick={enviarAvaliacao}
            onTouchEnd={(e) => { e.preventDefault(); enviarAvaliacao() }}
            disabled={enviando}
            style={{ width: '100%', padding: '12px', background: enviando ? '#86efac' : '#16a34a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: enviando ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {!user ? 'Entrar para avaliar' : enviando ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </div>
      </div>
    </section>
  )
}
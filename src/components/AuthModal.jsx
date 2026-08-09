import { useState, useRef } from 'react'
import { auth, db } from '../firebase'
import { supabase } from '../supabase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function AuthModal({ onClose }) {
  const [modo, setModo] = useState('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const inputFotoRef = useRef(null)

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setFoto(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    setErro('')
    if (!email.trim() || !senha.trim()) { setErro('Preencha email e senha.'); return }
    if (modo === 'cadastro' && !nome.trim()) { setErro('Preencha seu nome.'); return }
    setLoading(true)
    try {
      if (modo === 'cadastro') {
        const cred = await createUserWithEmailAndPassword(auth, email, senha)
        let photoURL = ''
        if (foto) {
          const ext = foto.name.split('.').pop()
          const path = `${cred.user.uid}.${ext}`
          const { error } = await supabase.storage.from('avatars').upload(path, foto, { upsert: true })
          if (!error) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(path)
            photoURL = data.publicUrl
          }
        }
        await updateProfile(cred.user, { displayName: nome, photoURL })
        await cred.user.reload()
        await setDoc(doc(db, 'usuarios', cred.user.uid), {
          nome,
          email,
          photoURL,
          criadoEm: new Date()
        })
      } else {
        await signInWithEmailAndPassword(auth, email, senha)
      }
      onClose()
    } catch (e) {
      const msgs = {
        'auth/email-already-in-use': 'Este email já está em uso.',
        'auth/invalid-email': 'Email inválido.',
        'auth/weak-password': 'Senha deve ter ao menos 6 caracteres.',
        'auth/invalid-credential': 'Email ou senha incorretos.',
      }
      setErro(msgs[e.code] || e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420, position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 6 }}>
          {modo === 'login' ? 'Entrar na conta' : 'Criar conta'}
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
          {modo === 'login' ? 'Acesse para deixar sua avaliação.' : 'Cadastre-se para participar da comunidade.'}
        </p>

        {erro && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
            {erro}
          </div>
        )}

        {modo === 'cadastro' && (
          <>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              style={inputStyle}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
              <div
                onClick={() => inputFotoRef.current.click()}
                style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', border: '2px dashed #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', marginBottom: 8 }}
              >
                {fotoPreview
                  ? <img src={fotoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <i className="fas fa-camera" style={{ fontSize: 24, color: '#16a34a' }} />
                }
              </div>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Foto de perfil (opcional)</span>
              <input ref={inputFotoRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
            </div>
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} style={inputStyle} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? '#86efac' : '#16a34a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 12, transition: 'background 0.2s' }}
        >
          {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro('') }}
          style={{ width: '100%', background: 'none', border: 'none', color: '#16a34a', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: 10,
  fontSize: 14,
  marginBottom: 12,
  outline: 'none',
  display: 'block',
  boxSizing: 'border-box',
  color: '#fff'
}
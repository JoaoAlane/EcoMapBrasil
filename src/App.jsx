import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Animais from './pages/Animais'
import './App.css'

function AnimatedRoutes({ user, onLoginRequest }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [stage, setStage] = useState('visible')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('fadeOut')
    }
  }, [location])

  return (
    <div
      style={{ opacity: stage === 'fadeOut' ? 0 : 1, transition: 'opacity 300ms ease' }}
      onTransitionEnd={() => {
        if (stage === 'fadeOut') {
          setDisplayLocation(location)
          setStage('fadeIn')
          setTimeout(() => setStage('visible'), 300)
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<Home user={user} onLoginRequest={onLoginRequest} />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/animais" element={<Animais />} />
      </Routes>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(undefined)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u || null))
    return () => unsub()
  }, [])

  if (user === undefined) return null

  return (
    <>
      <AnimatedRoutes user={user} onLoginRequest={() => setShowAuth(true)} />
      {showAuth && (
        <LazyAuthModal onClose={() => setShowAuth(false)} />
      )}
    </>
  )
}

function LazyAuthModal({ onClose }) {
  const [Comp, setComp] = useState(null)
  useEffect(() => {
    import('./components/AuthModal').then(m => setComp(() => m.default))
  }, [])
  if (!Comp) return null
  return <Comp onClose={onClose} />
}

export default App

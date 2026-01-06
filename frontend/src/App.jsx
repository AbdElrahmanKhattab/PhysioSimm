import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import MembershipPage from './pages/MembershipPage'
import AboutPage from './pages/AboutPage'
import CasesPage from './pages/CasesPage'
import CaseRunnerPage from './pages/CaseRunnerPage'
import AdminDashboard from './pages/AdminDashboard'
import CaseEditorPage from './pages/CaseEditorPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import API_URL from './config'

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (auth) localStorage.setItem('auth', JSON.stringify(auth))
    else localStorage.removeItem('auth')
  }, [auth])

  const logout = () => setAuth(null)

  const isAdmin = auth?.user?.role === 'admin'

  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <div className="logo">PhysioCaseLab</div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/membership">Membership</Link>
            <Link to="/about">About</Link>
            {auth && <Link to="/cases">Cases</Link>}
            {auth && <Link to="/leaderboard">Leaderboard</Link>}
            {isAdmin && <Link to="/admin">Admin</Link>}
          </nav>
          <div className="auth-area">
            {auth ? (
              <>
                <Link to="/profile" style={{ marginRight: '0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
                  Profile
                </Link>
                <span className="auth-email">{auth.user.email}</span>
                <button className="btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <AuthControls setAuth={setAuth} />
            )}
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/cases"
              element={auth ? <CasesPage auth={auth} /> : <Navigate to="/" />}
            />
            <Route
              path="/cases/:id"
              element={auth ? <CaseRunnerPage auth={auth} /> : <Navigate to="/" />}
            />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard auth={auth} /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/cases/new"
              element={isAdmin ? <CaseEditorPage auth={auth} /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/cases/:id/edit"
              element={isAdmin ? <CaseEditorPage auth={auth} /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={auth ? <ProfilePage auth={auth} /> : <Navigate to="/" />}
            />
            <Route
              path="/leaderboard"
              element={auth ? <LeaderboardPage auth={auth} /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function AuthControls({ setAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/auth/` + (mode === 'login' ? 'login' : 'register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Authentication failed')
      }
      const data = await res.json()
      setAuth(data)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-controls">
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error-text">{error}</div>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? '...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        className="link-button"
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? 'Create account' : 'Have an account? Login'}
      </button>
    </div>
  )
}

export default App

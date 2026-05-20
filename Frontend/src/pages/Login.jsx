import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { loginUser } from '../services/authService'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginUser(formData)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      login(data)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f4f8 50%, #faf5ff 100%)'
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)'
      }}>
        <div style={{ maxWidth: '380px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700 }}>MediTrack</div>
          </div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '32px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
            Your Health, <br />Our Priority
          </h2>
          <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: 1.6 }}>
            AI-powered healthcare platform for medical report analysis, health tracking, and personalized insights.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['📊 AI Medical Report Analysis', '💊 Medicine & Condition Tracking', '🤖 24/7 AI Health Chatbot'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.9, fontSize: '14px' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Sign in
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
            Welcome back! Enter your credentials to continue.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email" name="email" placeholder="you@example.com"
                onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                  outline: 'none', background: 'white', color: '#0f172a', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password" name="password" placeholder="••••••••"
                onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                  outline: 'none', background: 'white', color: '#0f172a', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? '#93c5fd' : '#2563eb', color: 'white',
              border: 'none', borderRadius: '10px', fontSize: '15px',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif', marginTop: '4px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

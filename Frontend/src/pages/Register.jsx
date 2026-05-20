import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: '', phone: '', bloodGroup: '', city: ''
  })
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
      await registerUser(formData)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
    outline: 'none', background: 'white', color: '#0f172a', boxSizing: 'border-box'
  }

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', label: 'Full Name' },
    { name: 'email', type: 'email', placeholder: 'Email Address', label: 'Email' },
    { name: 'password', type: 'password', placeholder: '••••••••', label: 'Password' },
    { name: 'age', type: 'number', placeholder: 'Age', label: 'Age' },
    { name: 'gender', type: 'select', placeholder: 'Male / Female / Other', label: 'Gender' },
    { name: 'phone', type: 'text', placeholder: '+91 XXXXX XXXXX', label: 'Phone' },
    { name: 'bloodGroup', type: 'text', placeholder: 'e.g. O+', label: 'Blood Group' },
    { name: 'city', type: 'text', placeholder: 'City', label: 'City' },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f4f8 50%, #faf5ff 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '26px', fontWeight: 700, color: '#0f172a' }}>
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
            Join MediTrack and take control of your health
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              {fields.map(field => (
                <div key={field.name} style={{ gridColumn: field.name === 'email' || field.name === 'password' ? '1 / -1' : 'auto' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                    {field.label}
                  </label>
                  {field.name === 'gender' ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <input
                      type={field.type} name={field.name} placeholder={field.placeholder}
                      onChange={handleChange} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  )}
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? '#93c5fd' : '#2563eb', color: 'white',
              border: 'none', borderRadius: '10px', fontSize: '15px',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

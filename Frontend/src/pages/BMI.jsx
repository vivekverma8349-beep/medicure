import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'

const BMI = () => {
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(65)
  const [bmi, setBmi] = useState(22.5)

  const calculate = () => {
    const h = height / 100
    const result = (weight / (h * h)).toFixed(1)
    setBmi(parseFloat(result))
  }

  const getCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: '#eff6ff' }
    if (bmi < 25) return { label: 'Normal Weight', color: '#22c55e', bg: '#f0fdf4' }
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b', bg: '#fffbeb' }
    return { label: 'Obese', color: '#ef4444', bg: '#fef2f2' }
  }

  const { label, color, bg } = getCategory(bmi)
  const angle = -135 + (Math.min(Math.max((bmi - 10) / 30 * 100, 0), 100) / 100) * 270

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>BMI Calculator</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Calculate your Body Mass Index</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Enter Details</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Height: <span style={{ color: '#2563eb' }}>{height} cm</span>
            </label>
            <input type="range" min="100" max="250" value={height} onChange={e => setHeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Weight: <span style={{ color: '#2563eb' }}>{weight} kg</span>
            </label>
            <input type="range" min="30" max="200" value={weight} onChange={e => setWeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <button onClick={calculate} style={{
            width: '100%', padding: '13px', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontSize: '15px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
          }}>
            Calculate BMI
          </button>
        </div>

        <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Your Result</h2>

          <svg width="200" height="120" viewBox="0 0 200 120" style={{ margin: '0 auto', display: 'block' }}>
            <path d="M 20 100 A 80 80 0 0 1 55 28" stroke="#3b82f6" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 55 28 A 80 80 0 0 1 100 18" stroke="#22c55e" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 100 18 A 80 80 0 0 1 145 28" stroke="#f59e0b" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 145 28 A 80 80 0 0 1 180 100" stroke="#ef4444" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.8" />
            <g transform={`rotate(${angle}, 100, 100)`}>
              <line x1="100" y1="100" x2="100" y2="30" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="100" cy="100" r="6" fill="#1e293b" />
          </svg>

          <div style={{ fontSize: '42px', fontWeight: 800, color: '#0f172a', fontFamily: 'Sora, sans-serif', marginTop: '8px' }}>
            {bmi}
          </div>
          <div style={{ display: 'inline-block', background: bg, color, fontWeight: 700, fontSize: '14px', padding: '6px 18px', borderRadius: '100px', marginTop: '8px' }}>
            {label}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            {[
              { range: '< 18.5', label: 'Under', color: '#3b82f6', bg: '#eff6ff' },
              { range: '18.5–24.9', label: 'Normal', color: '#22c55e', bg: '#f0fdf4' },
              { range: '25–29.9', label: 'Over', color: '#f59e0b', bg: '#fffbeb' },
              { range: '≥ 30', label: 'Obese', color: '#ef4444', bg: '#fef2f2' },
            ].map(item => (
              <div key={item.label} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: item.bg, textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: item.color, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: '9px', color: item.color, opacity: 0.8 }}>{item.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default BMI

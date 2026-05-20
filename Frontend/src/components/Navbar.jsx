import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user } = useContext(AuthContext)

  return (
    <header style={{
      height: '64px',
      background: 'white',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 28px',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Notification Bell */}
      <button style={{
        position: 'relative', width: '38px', height: '38px', borderRadius: '10px',
        background: '#f8fafc', border: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#64748b'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '8px', height: '8px', background: '#ef4444',
          borderRadius: '50%', border: '1.5px solid white'
        }} />
      </button>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 600, fontSize: '14px'
        }}>
          {user?.name ? user.name[0].toUpperCase() : 'J'}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
            {user?.name || 'John Doe'}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </header>
  )
}

export default Navbar

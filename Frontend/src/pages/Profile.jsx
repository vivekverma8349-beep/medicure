import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || '',
    city: user?.city || ''
  })

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>My Profile</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage your personal information</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Avatar card */}
        <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600" style={{ margin: '0 auto 14px' }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{profile.name}</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{profile.email}</div>
          <div style={{
            marginTop: '16px', padding: '8px 16px', background: '#f0fdf4',
            borderRadius: '100px', display: 'inline-block', fontSize: '12px',
            fontWeight: 600, color: '#16a34a'
          }}>
            Active Member
          </div>
        </div>

        {/* Details */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Personal Information</h2>
            <button onClick={() => setEditing(!editing)} style={{
              padding: '8px 18px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
              background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              color: '#475569', fontFamily: 'DM Sans, sans-serif'
            }}>
              {editing ? 'Save' : 'Edit Profile'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {Object.entries(profile).map(([key, value]) => (
              <div key={key}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {editing ? (
                  <input value={value} onChange={e => setProfile({ ...profile, [key]: e.target.value })} style={{
                    width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                    borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                    {value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  )
}

export default Profile

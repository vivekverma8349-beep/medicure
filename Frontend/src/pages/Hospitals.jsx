import MainLayout from '../layouts/MainLayout'

const HOSPITALS = [
  { _id: '1', name: 'City Hospital', city: 'Mumbai', type: 'Multi-specialty', phone: '+91 22 1234 5678', address: 'Andheri West, Mumbai', rating: 4.5 },
  { _id: '2', name: 'HealthCare Clinic', city: 'Mumbai', type: 'Clinic', phone: '+91 22 9876 5432', address: 'Bandra East, Mumbai', rating: 4.2 },
  { _id: '3', name: 'Apollo Hospital', city: 'Mumbai', type: 'Super-specialty', phone: '+91 22 4567 8901', address: 'Navi Mumbai', rating: 4.8 },
]

const Hospitals = () => (
  <MainLayout>
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Hospitals</h1>
      <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Your associated healthcare facilities</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {HOSPITALS.map(h => (
        <div key={h._id} className="card" style={{ padding: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{h.name}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>{h.type} · {h.city}</div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>📍 {h.address}</div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>📞 {h.phone}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {'★'.repeat(Math.floor(h.rating)).split('').map((s, i) => (
              <span key={i} style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
            ))}
            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>{h.rating}</span>
          </div>
        </div>
      ))}
    </div>
  </MainLayout>
)

export default Hospitals

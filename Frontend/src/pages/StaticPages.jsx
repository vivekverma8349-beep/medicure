import MainLayout from '../layouts/MainLayout'

export const About = () => (
  <MainLayout>
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>About MediTrack</h1>
    </div>
    <div className="card" style={{ padding: '28px', maxWidth: '700px' }}>
      <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
        MediTrack is an AI-powered healthcare platform designed to help you manage your health data intelligently.
        From medical report analysis to medicine tracking and AI chat support — your health is in good hands.
      </p>
    </div>
  </MainLayout>
)

export const Services = () => (
  <MainLayout>
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Services</h1>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {['AI Medical Chatbot', 'Medical Report Analysis', 'Medicine Tracking', 'Test Monitoring', 'BMI Calculator', 'Health Summary'].map(s => (
        <div key={s} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{s}</span>
        </div>
      ))}
    </div>
  </MainLayout>
)

export const Contact = () => (
  <MainLayout>
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Contact Us</h1>
    </div>
    <div className="card" style={{ padding: '28px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#475569' }}>
        <div>📧 support@medicure.com</div>
        <div>📞 +91 9876543210</div>
        <div>📍 Mumbai, Maharashtra</div>
      </div>
    </div>
  </MainLayout>
)

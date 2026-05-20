import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const Toggle = ({ value, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />

      <div className="
        w-11
        h-6
        bg-gray-200
        rounded-full
        peer
        peer-checked:bg-blue-600
        after:content-['']
        after:absolute
        after:top-[2px]
        after:left-[2px]
        after:bg-white
        after:rounded-full
        after:h-5
        after:w-5
        after:transition-all
        peer-checked:after:translate-x-full
      "></div>
    </label>
  )

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Settings</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage your preferences</p>
      </div>

      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'Push Notifications', desc: 'Receive health reminders and alerts', value: notifications, onChange: setNotifications },
          { label: 'Email Alerts', desc: 'Get reports and summaries via email', value: emailAlerts, onChange: setEmailAlerts },
          { label: 'Dark Mode', desc: 'Switch to dark theme (coming soon)', value: darkMode, onChange: setDarkMode },
        ].map(setting => (
          <div key={setting.label} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{setting.label}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{setting.desc}</div>
            </div>
            <Toggle value={setting.value} onChange={setting.onChange} />
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

export default Settings

import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'
import SourceReportsModal from '../components/SourceReportsModal'

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[key])) return data[key]
  return []
}

const ConfirmModal = ({ onConfirm, onCancel, name }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{
      background: 'white', borderRadius: '16px', padding: '28px 32px',
      maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '12px' }}>🗑️</div>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Delete Test</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '8px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#374151', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: '8px 20px', border: 'none', borderRadius: '8px', background: '#ef4444', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
      </div>
    </div>
  </div>
)

const Toast = ({ message, type }) => (
  <div style={{
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000,
    background: type === 'success' ? '#22c55e' : '#ef4444',
    color: 'white', padding: '12px 20px', borderRadius: '10px',
    fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  }}>
    {type === 'success' ? '✓' : '✗'} {message}
  </div>
)

const Test = () => {
  const [tests, setTests] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get('/tests')
        setTests(normalizeList(data, 'tests'))
      } catch (error) {
        console.log(error)
      }
    }
    fetchTests()
  }, [])

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/tests/${deleteTarget._id}`)
      setTests(prev => prev.filter(t => t._id !== deleteTarget._id))
      showToast('Test deleted successfully')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Delete failed', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <MainLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {selectedItem && (
        <SourceReportsModal
          item={selectedItem}
          type="Test"
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medical Tests</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Lab tests extracted from your medical reports</p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Test Name', 'Type', 'Reports', 'Added On', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', letterSpacing: '0.02em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  No tests found. Upload a medical report to see tests here.
                </td>
              </tr>
            ) : tests.map((test, i) => (
              <tr
                key={test._id || test.name}
                style={{ borderBottom: i < tests.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}
                onClick={() => setSelectedItem(test)}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Test name */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🧪</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{test.name}</span>
                  </div>
                </td>

                {/* Type */}
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                  {test.type || '—'}
                </td>

                {/* Reports linked */}
                <td style={{ padding: '14px 16px' }}>
                  {test.reports?.length > 0 ? (
                    <span style={{
                      background: '#f0fdf4', color: '#15803d',
                      border: '1px solid #bbf7d0',
                      padding: '3px 10px', borderRadius: '999px',
                      fontSize: '12px', fontWeight: 700
                    }}>
                      {test.reports.length} report{test.reports.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#cbd5e1' }}>—</span>
                  )}
                </td>

                {/* Date */}
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                  {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : '—'}
                </td>

                {/* Delete */}
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteTarget(test) }}
                    title="Delete test"
                    style={{ border: 'none', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}

export default Test

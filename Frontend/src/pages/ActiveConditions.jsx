import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'

const statusStyle = {
  Active: 'badge-active',
  Monitoring: 'badge-monitoring',
  Resolved: 'badge-inactive',
}

// NEW FEATURE: Confirmation Modal Component
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
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
        Delete Condition
      </h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          padding: '8px 20px', border: '1px solid #e2e8f0', borderRadius: '8px',
          background: 'white', color: '#374151', fontSize: '14px', cursor: 'pointer', fontWeight: 600
        }}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{
          padding: '8px 20px', border: 'none', borderRadius: '8px',
          background: '#ef4444', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 600
        }}>
          Delete
        </button>
      </div>
    </div>
  </div>
)

// NEW FEATURE: Simple toast notification
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

const ActiveConditions = () => {
  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)
  // NEW FEATURE: State for delete modal and toast
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchDiseases = async () => {
    try {
      const { data } = await API.get('/diseases')
      setConditions(data?.diseases || [])
    } catch (error) {
      console.log('Disease fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiseases()
  }, [])

  // NEW FEATURE: Handle delete with confirmation
  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/diseases/${deleteTarget._id}`)
      setConditions(prev => prev.filter(c => c._id !== deleteTarget._id))
      showToast('Condition deleted successfully')
    } catch (error) {
      showToast(error?.response?.data?.message || 'Delete failed', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <MainLayout>
      {/* NEW FEATURE: Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* NEW FEATURE: Confirm modal */}
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>
          Active Conditions
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Track and manage your medical conditions
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Loading conditions...
        </div>
      ) : conditions.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          No diseases found
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {conditions.map((c) => {
            const status = c.status || 'Active'
            return (
              <div key={c._id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: status === 'Active' ? '#f0fdf4' : status === 'Monitoring' ? '#fffbeb' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={status === 'Active' ? '#22c55e' : status === 'Monitoring' ? '#f59e0b' : '#94a3b8'}
                        strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                        {c.name || 'Unknown Disease'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {c.severity || 'Medical Condition'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={statusStyle[status]}>{status}</span>

                    {/* NEW FEATURE: Delete button */}
                    <button
                      onClick={() => setDeleteTarget(c)}
                      title="Delete condition"
                      style={{
                        border: 'none', background: '#fef2f2', color: '#ef4444',
                        borderRadius: '8px', padding: '5px 8px', cursor: 'pointer',
                        fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Diagnosed on</span>
                    <span style={{ fontWeight: 600, color: '#374151' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '--'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Reports Linked</span>
                    <span style={{ fontWeight: 600, color: '#374151' }}>
                      {c.reports?.length || 0}
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '12px', padding: '10px', background: '#f8fafc',
                  borderRadius: '8px', fontSize: '12px', color: '#64748b',
                }}>
                  📋 {c.description || c.notes || 'Condition detected from medical analysis'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </MainLayout>
  )
}

export default ActiveConditions

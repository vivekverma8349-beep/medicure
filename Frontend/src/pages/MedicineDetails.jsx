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
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
        Delete Medicine
      </h3>
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

const MedicineDetails = () => {
  const [medicines, setMedicines] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await API.get('/medicines')
        setMedicines(normalizeList(data, 'medicines'))
      } catch (error) {
        console.log(error)
      }
    }
    fetchMedicines()
  }, [])

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/medicines/${deleteTarget._id}`)
      setMedicines(prev => prev.filter(m => m._id !== deleteTarget._id))
      showToast('Medicine deleted successfully')
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
          type="Medicine"
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medicines</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track your medications and dosages</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
        {medicines.map(medicine => (
          <div
            key={medicine._id || medicine.name}
            className="card"
            style={{ padding: '20px', cursor: 'pointer' }}
            onClick={() => setSelectedItem(medicine)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '20px' }}>💊</span>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, textTransform: 'capitalize' }}>
                    {medicine.name}
                  </h3>
                </div>
                {medicine.dosage && (
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{medicine.dosage}</p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                {/* Reports badge */}
                {medicine.reports?.length > 0 && (
                  <span style={{
                    background: '#eff6ff', color: '#2563eb',
                    padding: '3px 9px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 700
                  }}>
                    {medicine.reports.length} report{medicine.reports.length !== 1 ? 's' : ''}
                  </span>
                )}
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); setDeleteTarget(medicine) }}
                  title="Delete medicine"
                  style={{ border: 'none', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#64748b' }}>
              {medicine.timing && <span>⏰ {medicine.timing}</span>}
              {medicine.duration && <span>📆 {medicine.duration}</span>}
              {medicine.purpose && <span>🎯 {medicine.purpose}</span>}
            </div>

            {medicine.reports?.length > 0 && (
              <div style={{
                marginTop: '12px', padding: '8px 12px',
                background: '#f0f9ff', borderRadius: '8px',
                fontSize: '12px', color: '#0369a1', fontWeight: 500
              }}>
                📋 From {medicine.reports.length} report{medicine.reports.length !== 1 ? 's' : ''} — click to view
              </div>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

export default MedicineDetails

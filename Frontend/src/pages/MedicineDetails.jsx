import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[key])) return data[key]
  return []
}

// NEW FEATURE: Reusable confirmation modal
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
        <button onClick={onCancel} style={{
          padding: '8px 20px', border: '1px solid #e2e8f0', borderRadius: '8px',
          background: 'white', color: '#374151', fontSize: '14px', cursor: 'pointer', fontWeight: 600
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          padding: '8px 20px', border: 'none', borderRadius: '8px',
          background: '#ef4444', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 600
        }}>Delete</button>
      </div>
    </div>
  </div>
)

// NEW FEATURE: Toast notification
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
  // NEW FEATURE: Delete state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

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

  // NEW FEATURE: Delete handler
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

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medicines</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track your medications and dosages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {medicines.map(medicine => (
          <div key={medicine._id || medicine.id || medicine.name}
            className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{medicine.name}</h3>
                <p className="text-gray-500">{medicine.dosage}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {medicine.status || 'Active'}
                </span>
                {/* NEW FEATURE: Delete button */}
                <button
                  onClick={() => setDeleteTarget(medicine)}
                  title="Delete medicine"
                  style={{
                    border: 'none', background: '#fef2f2', color: '#ef4444',
                    borderRadius: '8px', padding: '5px 8px', cursor: 'pointer'
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
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>Timing: {medicine.timing || 'Not specified'}</p>
              <p>Duration: {medicine.duration || 'Not specified'}</p>
              {/* NEW FEATURE: Show reports linked count */}
              <p style={{ color: '#94a3b8' }}>Reports linked: {medicine.reports?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

export default MedicineDetails

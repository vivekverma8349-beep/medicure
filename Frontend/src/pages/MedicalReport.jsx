import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'
import { analyzeReport } from '../services/reportService'
import Loader from '../components/Loader'
import ReportCard from '../components/ReportCard'
import ReportModal from '../components/ReportModal'

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[key])) return data[key]
  return []
}

// NEW FEATURE: Confirmation modal for report delete
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
        Delete Report
      </h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        Are you sure you want to delete <strong>{name}</strong>? This will remove all associated data. This cannot be undone.
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

// NEW FEATURE: Report file viewer modal (Feature 4)
const ReportFileViewer = ({ report, onClose }) => {
  if (!report) return null
  const isPdf = report.reportFileName?.toLowerCase().endsWith('.pdf') ||
    report.reportFileUrl?.includes('.pdf')

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '0',
        width: '90%', maxWidth: '900px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              📄 {report.reportFileName || 'Medical Report'}
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Uploaded: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '--'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={report.reportFileUrl} target="_blank" rel="noreferrer"
              style={{
                padding: '7px 14px', background: '#eff6ff', color: '#2563eb',
                borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600
              }}>
              Open in Tab
            </a>
            <a href={report.reportFileUrl} download
              style={{
                padding: '7px 14px', background: '#2563eb', color: 'white',
                borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600
              }}>
              Download
            </a>
            <button onClick={onClose} style={{
              border: 'none', background: '#f1f5f9', color: '#64748b',
              borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', fontSize: '16px'
            }}>✕</button>
          </div>
        </div>

        {/* File Preview */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0', minHeight: '400px' }}>
          {isPdf ? (
            <iframe
              src={report.reportFileUrl}
              style={{ width: '100%', height: '600px', border: 'none' }}
              title="Report PDF"
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <img
                src={report.reportFileUrl}
                alt="Medical Report"
                style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Summary footer */}
        {report.shortSummary && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #e2e8f0',
            background: '#f8fafc', fontSize: '13px', color: '#475569'
          }}>
            <strong>Summary:</strong> {report.shortSummary}
          </div>
        )}
      </div>
    </div>
  )
}

const MedicalReport = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  // NEW FEATURE: File viewer state + delete state + toast
  const [viewerReport, setViewerReport] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/reports')
      setReports(normalizeList(data, 'reports'))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setAnalyzing(true)
    setError(null)
    try {
      const data = await analyzeReport(file)
      setResult(data)
      await fetchReports()
      showToast('Report analyzed and saved successfully!')
    } catch (e) {
      // NEW FEATURE: Show validation error for non-medical files
      const errMsg = e?.response?.data?.message || 'Analysis failed. Check backend connection.'
      setError(errMsg)
      setResult({ error: errMsg })
    } finally {
      setAnalyzing(false)
    }
  }

  // NEW FEATURE: Delete report handler
  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/reports/${deleteTarget._id}`)
      setReports(prev => prev.filter(r => r._id !== deleteTarget._id))
      showToast('Report deleted successfully')
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
          name={deleteTarget.reportFileName || deleteTarget.patientName || 'this report'}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {/* NEW FEATURE: File viewer modal */}
      {viewerReport && (
        <ReportFileViewer report={viewerReport} onClose={() => setViewerReport(null)} />
      )}

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medical Reports</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Upload and analyze your medical reports with AI</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Upload Report
            </h2>

            <div
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragging(false); setError(null) }}
              style={{
                border: `2px dashed ${dragging ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: '12px', padding: '32px', textAlign: 'center',
                background: dragging ? '#eff6ff' : '#f8fafc', cursor: 'pointer',
                marginBottom: '16px', transition: 'all 0.2s'
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                {file ? file.name : 'Drop file or click to upload'}
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>PDF, JPG, PNG up to 10MB</p>
              <input
                id="fileInput" type="file" style={{ display: 'none' }}
                onChange={e => { setFile(e.target.files[0]); setError(null) }}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            {/* NEW FEATURE: Show validation error message */}
            {error && (
              <div style={{
                marginBottom: '12px', padding: '12px 16px',
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: '10px', fontSize: '13px', color: '#dc2626', fontWeight: 500
              }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={!file || analyzing} style={{
              width: '100%', padding: '12px',
              background: !file || analyzing ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', borderRadius: '10px',
              cursor: !file || analyzing ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
            }}>
              {analyzing ? 'Analyzing...' : 'Analyze Report'}
            </button>

            {result && !result.error && (
              <div style={{
                marginTop: '16px', background: '#ffffff',
                border: '1px solid #e2e8f0', borderRadius: '16px',
                padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      AI Analysis Result
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      Medical report analyzed successfully
                    </p>
                    {/* NEW FEATURE: Show handwriting confidence */}
                    {result.handwritingInfo?.isHandwritten && (
                      <p style={{
                        fontSize: '12px', marginTop: '4px',
                        color: result.handwritingInfo.confidence === 'low' ? '#f59e0b' : '#22c55e',
                        fontWeight: 600
                      }}>
                        ✍️ Handwritten prescription — Confidence: {result.handwritingInfo.confidence}
                      </p>
                    )}
                  </div>
                  <span style={{
                    background: '#dcfce7', color: '#15803d', fontSize: '12px',
                    padding: '6px 12px', borderRadius: '999px', fontWeight: '600'
                  }}>
                    Completed
                  </span>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Summary</h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#475569' }}>
                    {result?.sections?.find(s => s.type === 'summary')?.content || 'Analysis completed.'}
                  </p>
                </div>

                {result?.sections?.find(s => s.type === 'patient') && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Patient Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {result.sections.find(s => s.type === 'patient')?.content?.map((item, index) => (
                        <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{item.label}</p>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.value || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diseases */}
                {result?.sections?.find(s => s.type === 'diseases')?.content?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626', marginBottom: '12px' }}>Diseases</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {result.sections.find(s => s.type === 'diseases').content.map((d, i) => (
                        <span key={i} style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 14px', borderRadius: '999px', fontSize: '14px', fontWeight: '500' }}>
                          {typeof d === 'object' ? d.name : d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medicines */}
                {result?.sections?.find(s => s.type === 'medicines')?.content?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb', marginBottom: '12px' }}>Medicines</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {result.sections.find(s => s.type === 'medicines').content.map((m, i) => (
                        <span key={i} style={{ background: '#dbeafe', color: '#2563eb', padding: '8px 14px', borderRadius: '999px', fontSize: '14px', fontWeight: '500' }}>
                          {typeof m === 'object' ? m.name : m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tests */}
                {result?.sections?.find(s => s.type === 'tests')?.content?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#15803d', marginBottom: '12px' }}>Tests</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {result.sections.find(s => s.type === 'tests').content.map((t, i) => (
                        <span key={i} style={{ background: '#dcfce7', color: '#15803d', padding: '8px 14px', borderRadius: '999px', fontSize: '14px', fontWeight: '500' }}>
                          {typeof t === 'object' ? t.name : t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            All Reports
          </h2>

          {loading ? (
            <Loader />
          ) : reports.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-600">No Reports Found</h3>
              <p className="text-gray-400 mt-2">Upload a medical report to begin analysis.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {reports.map(report => (
                <div key={report._id || report.id || report.fileName} style={{ position: 'relative' }}>
                  <ReportCard report={report} onClick={setSelectedReport} />

                  {/* NEW FEATURE: Action buttons on each report card */}
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    display: 'flex', gap: '6px'
                  }}>
                    {/* View file button */}
                    {report.reportFileUrl && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setViewerReport(report) }}
                        title="View file"
                        style={{
                          border: 'none', background: '#eff6ff', color: '#2563eb',
                          borderRadius: '7px', padding: '5px 8px', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 600
                        }}
                      >
                        👁
                      </button>
                    )}
                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(report) }}
                      title="Delete report"
                      style={{
                        border: 'none', background: '#fef2f2', color: '#ef4444',
                        borderRadius: '7px', padding: '5px 8px', cursor: 'pointer'
                      }}
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
              ))}
            </div>
          )}
        </div>
      </div>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </MainLayout>
  )
}

export default MedicalReport

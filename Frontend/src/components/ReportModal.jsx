import React from 'react'

const ReportModal = ({ report, onClose }) => {
  if (!report) return null

  const renderTags = (items, bg, color, border) => {
    if (!items || items.length === 0)
      return <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>None recorded</p>
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {items.map((item, i) => (
          <span key={item._id || i} style={{
            background: bg, color: color,
            border: `1px solid ${border}`,
            padding: '5px 14px', borderRadius: '999px',
            fontSize: '13px', fontWeight: 600
          }}>
            {typeof item === 'object' ? item.name : item}
          </span>
        ))}
      </div>
    )
  }

  const renderLabResults = (items) => {
    if (!items || items.length === 0) return null
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: '#fefce8', border: '1px solid #fde68a',
            borderRadius: '8px', padding: '8px 14px',
            fontSize: '13px', color: '#92400e', fontWeight: 500
          }}>
            🔬 {item}
          </div>
        ))}
      </div>
    )
  }

  const detail = (label, value) => {
    if (!value) return null
    return (
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: '12px', padding: '14px 16px'
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>
          {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
          {value}
        </p>
      </div>
    )
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '24px',
          width: '100%', maxWidth: '840px',
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)'
        }}
      >

        {/* ══ BLUE BANNER HEADER ══ */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 24px 20px',
          position: 'relative'
        }}>
          {/* decorative bg circles */}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '60px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          {/* top row: title + close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
              }}>📋</div>
              <div>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '17px', fontWeight: 700, color: 'white', margin: 0 }}>
                  {report.reportFileName || report.fileName || report.name || 'Medical Report'}
                </h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: '3px 0 0' }}>
                  {[report.hospitalName, report.department].filter(Boolean).join(' · ') || 'Medical Report'}
                </p>
              </div>
            </div>

            <button onClick={onClose} style={{
              border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: '8px', width: '32px', height: '32px',
              cursor: 'pointer', fontSize: '16px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          </div>

          {/* meta pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
            {report.patientName && <span style={pill}>👤 {report.patientName}</span>}
            {report.age && <span style={pill}>🎂 {report.age} yrs</span>}
            {report.gender && <span style={pill}>⚧ {report.gender}</span>}
            {(report.visitDate || report.dateOfVisit) && <span style={pill}>📅 {report.visitDate || report.dateOfVisit}</span>}
            {report.doctorName && <span style={pill}>🩺 {report.doctorName}</span>}
            {report.isHandwritten && (
              <span style={{ ...pill, background: 'rgba(251,191,36,0.2)', color: '#fde68a' }}>
                ✍️ Handwritten · {report.handwritingConfidence}
              </span>
            )}
          </div>

          {/* VIEW ORIGINAL REPORT BUTTON */}
          <div style={{ marginTop: '16px' }}>
            {report.reportFileUrl ? (
              <a
                href={report.reportFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px',
                  background: 'white', color: '#1e40af',
                  borderRadius: '10px', textDecoration: 'none',
                  fontSize: '13px', fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Original Report
              </a>
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', fontSize: '12px',
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)',
                borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.25)'
              }}>
                ⚠️ File URL not available
              </span>
            )}
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Summary */}
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '16px 18px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>📝 Summary</p>
            <p style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: 1.85, margin: 0 }}>
              {report.shortSummary || report.summary || report.reportParagraph || 'No summary available.'}
            </p>
          </div>

          {/* Diseases / Medicines / Tests */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '14px', padding: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>🦠 Diseases</p>
              {renderTags(report.diseases, '#fee2e2', '#dc2626', '#fca5a5')}
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>💊 Medicines</p>
              {renderTags(report.medicines, '#dbeafe', '#1d4ed8', '#93c5fd')}
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>🧪 Tests</p>
              {renderTags(report.tests, '#dcfce7', '#15803d', '#86efac')}
            </div>
          </div>

          {/* Lab Results */}
          {report.reportsIncluded?.length > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px 18px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>🔬 Lab Results</p>
              {renderLabResults(report.reportsIncluded)}
            </div>
          )}

          {/* Detailed Analysis */}
          {report.reportParagraph && (
            <div style={{ background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>🔍 Detailed Analysis</p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.85, margin: 0 }}>{report.reportParagraph}</p>
            </div>
          )}

          {/* Patient Details */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Patient Details</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {detail('Patient Name', report.patientName)}
              {detail('Age', report.age)}
              {detail('Gender', report.gender)}
              {detail('Doctor', report.doctorName)}
              {detail('Hospital', report.hospitalName)}
              {detail('Department', report.department)}
              {detail('Visit Date', report.visitDate || report.dateOfVisit)}
              {detail('Next Visit', report.nextVisitDate)}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// shared pill style
const pill = {
  background: 'rgba(255,255,255,0.15)', color: 'white',
  padding: '4px 11px', borderRadius: '999px',
  fontSize: '12px', fontWeight: 600
}

export default ReportModal
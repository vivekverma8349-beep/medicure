import React, { useState } from 'react'
import ReportModal from './ReportModal'

/**
 * SourceReportsModal
 * Shows the list of reports a disease / medicine / test came from.
 * Clicking a report card opens the full ReportModal.
 *
 * Props:
 *   item     – the disease / medicine / test object  (with .reports[] populated)
 *   type     – 'Disease' | 'Medicine' | 'Test'
 *   onClose  – function to close this modal
 */
const SourceReportsModal = ({ item, type, onClose }) => {
  const [selectedReport, setSelectedReport] = useState(null)

  if (!item) return null

  const reports = item.reports || []

  const accentMap = {
    Disease: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '🦠' },
    Medicine: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb', icon: '💊' },
    Test:     { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '🧪' },
  }
  const accent = accentMap[type] || accentMap.Disease

  return (
    <>
      {/* Source reports list modal */}
      {!selectedReport && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9990,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '20px',
              width: '100%', maxWidth: '560px',
              maxHeight: '85vh', overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 22px 16px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{
                    background: accent.bg, color: accent.color,
                    border: `1px solid ${accent.border}`,
                    padding: '4px 12px', borderRadius: '999px',
                    fontSize: '12px', fontWeight: 700
                  }}>
                    {accent.icon} {type}
                  </span>
                  <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {item.name}
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Found in <strong>{reports.length}</strong> report{reports.length !== 1 ? 's' : ''}
                  {reports.length > 0 ? ' — click a report to view details' : ''}
                </p>
              </div>
              <button onClick={onClose} style={{
                border: 'none', background: '#f1f5f9', color: '#64748b',
                borderRadius: '8px', width: '32px', height: '32px',
                cursor: 'pointer', fontSize: '16px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>✕</button>
            </div>

            {/* Reports list */}
            <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                  <p style={{ fontSize: '14px' }}>No linked reports yet</p>
                </div>
              ) : (
                reports.map((report, i) => (
                  <div
                    key={report._id || i}
                    onClick={() => setSelectedReport(report)}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px', padding: '14px 16px',
                      cursor: 'pointer', background: '#fafafa',
                      transition: 'all 0.15s',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f0f9ff'
                      e.currentTarget.style.borderColor = '#93c5fd'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fafafa'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    <div>
                      <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                        📋 {report.reportFileName || report.fileName || `Report ${i + 1}`}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {report.patientName && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>👤 {report.patientName}</span>
                        )}
                        {(report.visitDate || report.dateOfVisit) && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {report.visitDate || report.dateOfVisit}</span>
                        )}
                        {report.hospitalName && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>🏥 {report.hospitalName}</span>
                        )}
                      </div>
                      {report.shortSummary && (
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 }}>
                          {report.shortSummary.slice(0, 90)}{report.shortSummary.length > 90 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      background: '#eff6ff', color: '#2563eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', flexShrink: 0, marginLeft: '12px'
                    }}>→</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Report Modal */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  )
}

export default SourceReportsModal

import React from 'react'

const renderList = (items, color) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        No data available
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, index) => (
        <span
          key={item._id || index}
          className={`px-3 py-1 rounded-full text-sm ${color}`}
        >
          {typeof item === 'object'
            ? item.name
            : item}
        </span>
      ))}
    </div>
  )
}

const ReportModal = ({ report, onClose }) => {

  if (!report) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {report.fileName ||
                report.reportFileName ||
                report.name ||
                'Medical Report'}
            </h2>

            <p className="text-gray-500 mt-1">
              {report.hospitalName ||
                report.hospital ||
                'Unknown Hospital'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}

        <div className="p-6 space-y-6">

          {/* SUMMARY */}

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Summary
            </h3>

            <p className="text-gray-600 mt-2 leading-7">
              {report.shortSummary ||
                report.summary ||
                report.reportParagraph ||
                'No summary available'}
            </p>
          </div>

          {/* DISEASES */}

          <div>
            <h3 className="text-lg font-semibold text-red-700">
              Diseases
            </h3>

            {renderList(
              report.diseases,
              'bg-red-100 text-red-700'
            )}
          </div>

          {/* MEDICINES */}

          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Medicines
            </h3>

            {renderList(
              report.medicines,
              'bg-blue-100 text-blue-700'
            )}
          </div>

          {/* TESTS */}

          <div>
            <h3 className="text-lg font-semibold text-green-700">
              Tests
            </h3>

            {renderList(
              report.tests,
              'bg-green-100 text-green-700'
            )}
          </div>

          {/* REPORT DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Doctor
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {report.doctorName || 'Not Available'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {report.department || 'General'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Visit Date
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {report.dateOfVisit ||
                  report.createdAt ||
                  'Not Available'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Patient Name
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {report.patientName || 'Not Available'}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default ReportModal
const ReportCard = ({ report, onClick }) => (
  <div
    onClick={() => onClick(report)}
    className="
      bg-white
      rounded-2xl
      p-5
      shadow-md
      border
      border-gray-100
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
      duration-300
      cursor-pointer
    "
  >
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-2xl text-gray-800">
          {report.patientName ||
            report.name ||
            report.fileName ||
            "Medical Report"}
        </h3>
      </div>

      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
        Analyzed
      </span>
    </div>

    <p className="text-blue-600 font-medium mt-4 line-clamp-4">
      {report.shortSummary || report.summary
        ? (report.shortSummary || report.summary).slice(0, 120) + "..."
        : "Click to view complete medical report →"}
    </p>
  </div>
)

export default ReportCard

import MedicalReport from "../models/Report.js";
import Disease from '../models/Disease.js'
import Medicine from '../models/Medicine.js'
import Test from '../models/Test.js'


const getDashboardSummary = async (req, res) => {

  try {

    const userId = req.user._id

    // Counts

    const totalReports = await MedicalReport.countDocuments({
      user: userId
    })

    const totalDiseases = await Disease.countDocuments({
      user: userId
    })

    const totalMedicines = await Medicine.countDocuments({
      user: userId
    })

    const totalTests = await Test.countDocuments({
      user: userId
    })

    // Recent reports

    const reports = await MedicalReport.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .limit(5)

    const recentReports = reports.map(report => ({

      _id: report._id,

      name:
        report.reportFileName ||
        report.patientName ||
        'Medical Report',

      hospital:
        report.hospitalName || 'Unknown Hospital',

      department:
        report.department || 'General',

      date:
        new Date(report.createdAt)
          .toLocaleDateString(),

      summary:
        report.shortSummary || '',

    }))

    // Diseases list

    const diseases = await Disease.find({
      user: userId
    }).limit(6)

    const activeDiseasesList = diseases.map(disease => ({
      _id: disease._id,
      name: disease.name,
      status: disease.status || 'Active',
      diagnosedOn: disease.diagnosedOn
        ? new Date(disease.diagnosedOn).toLocaleDateString()
        : 'N/A'
    }))

    // FRONTEND FRIENDLY RESPONSE

    res.status(200).json({

      reportsCount: totalReports,

      diseasesCount: totalDiseases,

      medicinesCount: totalMedicines,

      testsCount: totalTests,

      recentReports,

      activeDiseasesList

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

}

const getUserProfile = async (req, res) => {

  try {

    const user = req.user

    res.status(200).json({

      id: user._id,

      name: user.name || '',

      email: user.email || '',

      age: user.age || '',

      gender: user.gender || '',

      phone: user.phone || '',

      bloodGroup: user.bloodGroup || '',

      city: user.city || '',

      profileImage: user.profileImage || '',

      memberSince: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }
        )
        : ''

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

}

export {
  getDashboardSummary,
  getUserProfile,
  
}


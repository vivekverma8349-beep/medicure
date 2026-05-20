
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'
import { getSummary, getProfile } from '../services/dashboardService'

const StatCard = ({ icon, count, label, color, bg, onClick }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1,
          }}
        >
          {count}
        </div>

        <div
          style={{
            fontSize: '13px',
            color: '#64748b',
            marginTop: '2px',
          }}
        >
          {label}
        </div>
      </div>
    </div>

    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
      <span
        style={{
          fontSize: '13px',
          color: color,
          fontWeight: 500,
        }}
      >
        View all →
      </span>
    </div>
  </div>
)

const Home = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState({})
  const [profile, setProfile] = useState({})
  const [reports, setReports] = useState([])
  const [diseases, setDiseases] = useState([])

  const fetchDashboard = async () => {
    try {
      const summaryData = await getSummary()
      const profileData = await getProfile()

      setDashboard(summaryData || {})
      setProfile(profileData || {})

      setReports(
        summaryData?.recentReports ||
          summaryData?.reports ||
          []
      )

      setDiseases(
        summaryData?.activeDiseasesList ||
          summaryData?.diseases ||
          []
      )
    } catch (error) {
      console.log('Dashboard Error:', error)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const reportsCount =
    dashboard?.reportsCount ||
    dashboard?.totalReports ||
    reports.length ||
    0

  const medicinesCount =
    dashboard?.medicinesCount ||
    dashboard?.medicines ||
    0

  const testsCount =
    dashboard?.testsCount ||
    dashboard?.tests ||
    0

  const diseasesCount =
    dashboard?.diseasesCount ||
    dashboard?.activeDiseases ||
    diseases.length ||
    0

  const firstName =
    user?.name?.split(' ')[0] ||
    profile?.name?.split(' ')[0] ||
    'User'

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          Welcome back, {firstName}! 👋
        </h1>

        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
            marginTop: '4px',
          }}
        >
          Here's your health overview
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              icon={<div>📄</div>}
              count={reportsCount}
              label="Reports"
              color="#3b82f6"
              bg="#eff6ff"
              onClick={() => navigate('/reports')}
            />

            <StatCard
              icon={<div>🩺</div>}
              count={diseasesCount}
              label="Diseases"
              color="#22c55e"
              bg="#f0fdf4"
              onClick={() => navigate('/conditions')}
            />

            <StatCard
              icon={<div>💊</div>}
              count={medicinesCount}
              label="Medicines"
              color="#a855f7"
              bg="#faf5ff"
              onClick={() => navigate('/medicines')}
            />

            <StatCard
              icon={<div>🧪</div>}
              count={testsCount}
              label="Tests"
              color="#f59e0b"
              bg="#fffbeb"
              onClick={() => navigate('/tests')}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div className="card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                  Recent Reports
                </h2>

                <button
                  onClick={() => navigate('/reports')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                  }}
                >
                  View all
                </button>
              </div>

              {reports.length > 0 ? (
                reports.map(report => (
                  <div
                    key={report._id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {report.name || report.title}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                      }}
                    >
                      {report.hospital || 'Hospital'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                  No reports found
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h2
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '15px',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                Active Diseases
              </h2>

              {diseases.length > 0 ? (
                diseases.map(disease => (
                  <div
                    key={disease._id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {disease.name}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginTop: '6px',
                      }}
                    >
                      {disease.status || 'Active'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                  No diseases found
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h2
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '15px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              My Profile
            </h2>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: 700,
                  margin: '0 auto',
                }}
              >
                {(user?.name || profile?.name || 'U')[0]}
              </div>

              <div
                style={{
                  marginTop: '10px',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {user?.name || profile?.name || 'Unknown User'}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginTop: '2px',
                }}
              >
                {user?.email || profile?.email || 'No Email'}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              {[
                { icon: '🎂', label: 'Age', value: profile?.age || '--' },
                { icon: '⚧', label: 'Gender', value: profile?.gender || '--' },
                { icon: '🩸', label: 'Blood Group', value: profile?.bloodGroup || '--' },
                { icon: '📞', label: 'Phone', value: profile?.phone || '--' },
                {
                  icon: '📅',
                  label: 'Member Since',
                  value: profile?.memberSince || '--',
                },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                    }}
                  >
                    {item.icon} {item.label}
                  </span>

                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/profile')}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#475569',
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Home


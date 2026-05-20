import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px' }} className="page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout

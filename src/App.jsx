import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewsDetail from './pages/NewsDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Router>
      <Routes>
        {/* 前臺路由 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="news/:id" element={<NewsDetail />} />
        </Route>

        {/* 後臺路由 */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App

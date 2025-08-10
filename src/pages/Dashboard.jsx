import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Plus, Settings, LogOut, Edit, Trash2, Eye } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import BlogEditor from '../components/BlogEditor'
import BlogList from '../components/BlogList'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalCategories: 0
  })
  const location = useLocation()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = () => {
    Cookies.remove('token')
    window.location.href = '/'
  }

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
          
          <nav className="mt-6">
            <Link
              to="/dashboard"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                location.pathname === '/dashboard' ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Overview
            </Link>
            
            <Link
              to="/dashboard/blogs"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive('blogs') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              All Blogs
            </Link>
            
            <Link
              to="/dashboard/blogs/new"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive('new') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
              }`}
            >
              <Plus className="h-5 w-5 mr-3" />
              Add New Blog
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview stats={stats} />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/new" element={<BlogEditor />} />
            <Route path="/blogs/edit/:id" element={<BlogEditor />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const DashboardOverview = ({ stats }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/dashboard/blogs/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-primary-500 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Create New Blog</h3>
              <p className="text-sm text-gray-600">Write and publish a new blog post</p>
            </div>
          </Link>
          
          <Link
            to="/dashboard/blogs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-8 w-8 text-primary-500 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Blogs</h3>
              <p className="text-sm text-gray-600">Edit or delete existing blog posts</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

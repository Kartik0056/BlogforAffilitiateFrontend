import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token')
      
      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        const response = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data.success) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          Cookies.remove('token')
        }
      } catch (error) {
        setIsAuthenticated(false)
        Cookies.remove('token')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute

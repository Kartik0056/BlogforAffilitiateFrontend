import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BlogDetail from './pages/BlogDetail'
import Category from './pages/Category'
import Search from './pages/Search'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Global GSAP animations
    gsap.fromTo('.animate-fade-in', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.animate-fade-in',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

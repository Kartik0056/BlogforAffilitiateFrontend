import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import Cookies from 'js-cookie'
import logo from "../assets/logo.png"

const categories = [
  'Mobiles',
  'Electronics',
  'Fashion',
  'Home Appliances',
  'Gaming',
  'Accessories'
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get('token')
    setIsLoggedIn(!!token)

    gsap.fromTo(
      '.navbar',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  useEffect(() => {
    if (isSearchOpen) {
      gsap.fromTo(
        searchRef.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [isSearchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className="navbar bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Dhamaka Deals Logo"
              className="w-[81px] h-[56px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-500">
              Home
            </Link>

            {/* Category dropdown - click based */}
            <div className="relative">
              <button
                onClick={() => setShowCategories((prev) => !prev)}
                className="flex items-center text-gray-700 hover:text-primary-500 focus:outline-none"
              >
                Category <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {showCategories && (
                <div
                  className="absolute top-full left-0 bg-white shadow-lg rounded-lg mt-1 w-48 py-2 z-50"
                  onMouseLeave={() => setShowCategories(false)}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/category/${cat.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setShowCategories(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Icon + Input */}
          <div className="hidden md:flex items-center relative">
            {!isSearchOpen && (
              <Search
                className="h-5 w-5 text-gray-600 cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
            )}
            {isSearchOpen && (
              <form
                ref={searchRef}
                onSubmit={handleSearch}
                className="flex items-center ml-2"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button type="submit" className="ml-2 text-primary-500">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-500"
                >
                  <User className="h-6 w-6" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-500"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

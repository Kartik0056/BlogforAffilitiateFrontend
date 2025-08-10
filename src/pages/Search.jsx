import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import { SearchIcon, Loader2 } from 'lucide-react'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const query = searchParams.get('q') || ''

  useEffect(() => {
    setSearchTerm(query)
    if (query) {
      searchBlogs(query)
    } else {
      setBlogs([])
      setLoading(false)
    }
  }, [query])

  const searchBlogs = async (term) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/blogs/search?q=${encodeURIComponent(term)}`)
      setBlogs(response.data.blogs || [])
    } catch (error) {
      console.error('Error searching blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for blogs, products, reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <SearchIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <p className="text-xl text-gray-600">
              {loading ? 'Searching...' : `Found ${blogs.length} results for "${query}"`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No results found for "{query}".
            </p>
            <p className="text-gray-400">
              Try searching with different keywords or browse our categories.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Search

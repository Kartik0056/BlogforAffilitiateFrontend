import { useState, useEffect } from 'react'
import axios from 'axios'
import FeaturedSlider from '../components/FeaturedSlider'
import BlogCard from '../components/BlogCard'
import { Loader2 } from 'lucide-react'

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Mobiles', 'Electronics', 'Fashion', 'Home Appliances', 'Gaming', 'Accessories']

  useEffect(() => {
    fetchBlogs()
  }, [selectedCategory])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === 'All' 
        ? 'http://localhost:5000/api/blogs' 
        : `http://localhost:5000/api/blogs/category/${selectedCategory.toLowerCase().replace(' ', '-')}`
      
      const response = await axios.get(url)
      setBlogs(response.data.blogs || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedSlider blogs={blogs} />
      </section>

      {/* Category Filter */}
      <section className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedCategory === 'All' ? 'Latest Reviews' : `${selectedCategory} Reviews`}
          </h2>
          <span className="text-gray-500">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </span>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found in this category.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home

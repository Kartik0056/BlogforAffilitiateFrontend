import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import { Loader2 } from 'lucide-react'

const Category = () => {
  const { category } = useParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategoryBlogs()
  }, [category])

  const fetchCategoryBlogs = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/blogs/category/${category}`)
      setBlogs(response.data.blogs || [])
    } catch (error) {
      console.error('Error fetching category blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryName} Reviews
          </h1>
          <p className="text-xl text-gray-600">
            Discover the best {categoryName.toLowerCase()} products with our detailed reviews
          </p>
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
            <p className="text-gray-500 text-lg">
              No blogs found in the {categoryName} category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Category

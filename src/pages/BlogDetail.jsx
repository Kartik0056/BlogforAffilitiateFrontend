import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Tag, ExternalLink, ArrowLeft, Share2 } from 'lucide-react'
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share'
import axios from 'axios'
import gsap from 'gsap'

const BlogDetail = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState([])

  useEffect(() => {
    fetchBlog()
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (blog) {
      // Animate blog content
      gsap.fromTo('.blog-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
      
      gsap.fromTo('.blog-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      )
    }
  }, [blog])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/blogs/slug/${slug}`)
      setBlog(response.data.blog)
      
      // Fetch related blogs
      if (response.data.blog) {
        const relatedResponse = await axios.get(`http://localhost:5000/api/blogs/category/${response.data.blog.category.toLowerCase().replace(' ', '-')}`)
        setRelatedBlogs(relatedResponse.data.blogs.filter(b => b._id !== response.data.blog._id).slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <Link to="/" className="text-primary-500 hover:text-primary-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const shareUrl = window.location.href
  const shareTitle = blog.title

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Blog Header */}
      <div className="blog-header max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={blog.image || '/placeholder.svg?height=400&width=800'}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-primary-500 text-white px-4 py-2 rounded-full font-medium">
                {blog.category}
              </span>
            </div>
            {blog.price && (
              <div className="absolute top-6 right-6">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  ${blog.price}
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {blog.description}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-700 font-medium flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share:
              </span>
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <div className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
              </WhatsappShareButton>
            </div>

            {/* Buy Now Button */}
            {blog.affiliateLink && (
              <a
                href={blog.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Buy Now - ${blog.price}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="blog-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div 
            className="prose prose-lg max-w-none blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <div key={relatedBlog._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={relatedBlog.image || '/placeholder.svg?height=200&width=400'}
                  alt={relatedBlog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      to={`/blog/${relatedBlog.slug}`}
                      className="hover:text-primary-500 transition-colors"
                    >
                      {relatedBlog.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {relatedBlog.description}
                  </p>
                  <Link
                    to={`/blog/${relatedBlog.slug}`}
                    className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogDetail

import { Link } from 'react-router-dom'
import { ExternalLink, Calendar, Tag } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const BlogCard = ({ blog }) => {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    
    const handleMouseEnter = () => {
      gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' })
    }
    
    const handleMouseLeave = () => {
      gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in"
    >
      <div className="relative">
        <img
          src={blog.image || '/placeholder.svg?height=200&width=400'}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {blog.category}
          </span>
        </div>
        {blog.price && (
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ${blog.price}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/blog/${blog.slug}`}
            className="hover:text-primary-500 transition-colors"
          >
            {blog.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.description}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link
            to={`/blog/${blog.slug}`}
            className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
          >
            Read More →
          </Link>
          
          {blog.affiliateLink && (
            <a
              href={blog.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Buy Now
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogCard

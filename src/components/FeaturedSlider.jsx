import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import gsap from 'gsap'

const FeaturedSlider = ({ blogs }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const featuredBlogs = blogs.slice(0, 5) // Show first 5 blogs as featured

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredBlogs.length])

  useEffect(() => {
    gsap.fromTo('.slide-content',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
    )
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBlogs.length) % featuredBlogs.length)
  }

  if (!featuredBlogs.length) return null

  const currentBlog = featuredBlogs[currentSlide]

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mb-12">
      <div className="absolute inset-0">
        <img
          src={currentBlog.image || '/placeholder.svg?height=500&width=1200'}
          alt={currentBlog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="slide-content max-w-2xl">
            <span className="inline-block bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              {currentBlog.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {currentBlog.title}
            </h1>
            
            <p className="text-lg text-gray-200 mb-6 line-clamp-3">
              {currentBlog.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/blog/${currentBlog.slug}`}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
              >
                Read Full Review
              </Link>
              
              {currentBlog.affiliateLink && (
                <a
                  href={currentBlog.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Buy Now - ${currentBlog.price}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredBlogs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedSlider

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Upload, X } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

const BlogEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    price: '',
    affiliateLink: '',
    tags: [],
    image: null
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const categories = [
    'Mobiles',
    'Electronics',
    'Fashion',
    'Home Appliances',
    'Gaming',
    'Accessories'
  ]

  useEffect(() => {
    if (isEditing) {
      fetchBlog()
    }
  }, [id, isEditing])

  const fetchBlog = async () => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get(`/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const blog = response.data.blog
      setFormData({
        title: blog.title,
        description: blog.description,
        content: blog.content,
        category: blog.category,
        price: blog.price || '',
        affiliateLink: blog.affiliateLink || '',
        tags: blog.tags || [],
        image: null
      })
      setImagePreview(blog.image)
    } catch (error) {
      toast.error('Error fetching blog')
      navigate('/dashboard/blogs')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = Cookies.get('token')
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]))
        } else if (key === 'image' && formData[key]) {
          submitData.append(key, formData[key])
        } else if (key !== 'image') {
          submitData.append(key, formData[key])
        }
      })

      const url = isEditing ? `/api/admin/blogs/${id}` : '/api/admin/blogs'
      const method = isEditing ? 'put' : 'post'

      const response = await axios[method](url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`)
        navigate('/dashboard/blogs')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving blog')
    } finally {
      setLoading(false)
    }
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard/blogs')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Product price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affiliate Link
              </label>
              <input
                type="url"
                name="affiliateLink"
                value={formData.affiliateLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/product"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description of the blog post"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </label>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setFormData(prev => ({ ...prev, image: null }))
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary-500 text-white rounded-r-lg hover:bg-primary-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Content *</h2>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={quillModules}
            className="h-64 mb-12"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/blogs')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BlogEditor

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './BlogList.css'

function BlogList() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchPosts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="blog-list">
      <div className="container">
        <h1>所有文章</h1>
        
        <div className="filters">
          <button
            className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : posts.length === 0 ? (
          <div className="empty">暂无文章</div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post.id} className="post-item">
                <div className="post-header">
                  <span className="category-badge">
                    {post.categories?.name || '未分类'}
                  </span>
                  <span className="date">{formatDate(post.created_at)}</span>
                </div>
                <h2>
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                {post.excerpt && (
                  <p className="excerpt">{post.excerpt}</p>
                )}
                <div className="post-meta">
                  <span className="author">作者: {post.author}</span>
                  <span className="views">阅读: {post.view_count || 0}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Home.css'

function Home() {
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setRecentPosts(data || [])
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
    <div className="home">
      <div className="container">
        <section className="hero">
          <h1>欢迎来到我的博客</h1>
          <p>分享技术、记录生活、传递思考</p>
        </section>

        <section className="recent-posts">
          <h2>最新文章</h2>
          {loading ? (
            <div className="loading">加载中...</div>
          ) : recentPosts.length === 0 ? (
            <div className="empty">暂无文章</div>
          ) : (
            <div className="posts-grid">
              {recentPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-meta">
                    <span className="category">
                      {post.categories?.name || '未分类'}
                    </span>
                    <span className="date">{formatDate(post.created_at)}</span>
                  </div>
                  <h3>
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="excerpt">{post.excerpt}</p>
                  )}
                  <div className="post-footer">
                    <span className="author">作者: {post.author}</span>
                    <span className="views">阅读: {post.view_count || 0}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/blog" className="btn-primary">查看所有文章</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home


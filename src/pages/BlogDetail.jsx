import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './BlogDetail.css'

function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    author: '',
    email: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost()
      fetchComments()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      // 增加阅读量
      await supabase.rpc('increment_view_count', { post_id: id })

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('获取评论失败:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          author: commentForm.author,
          email: commentForm.email,
          content: commentForm.content,
          approved: false // 新评论需要审核
        })

      if (error) throw error

      alert('评论已提交，等待审核后显示')
      setCommentForm({ author: '', email: '', content: '' })
    } catch (error) {
      console.error('提交评论失败:', error)
      alert('提交评论失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="blog-detail">
        <div className="container">
          <div className="loading">加载中...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-detail">
        <div className="container">
          <div className="error">文章不存在</div>
          <Link to="/blog" className="back-link">返回博客列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-detail">
      <div className="container">
        <Link to="/blog" className="back-link">← 返回列表</Link>
        
        <article className="post-content">
          <div className="post-header">
            <span className="category-badge">
              {post.categories?.name || '未分类'}
            </span>
            <span className="date">{formatDate(post.created_at)}</span>
          </div>
          
          <h1>{post.title}</h1>
          
          <div className="post-meta">
            <span>作者: {post.author}</span>
            <span>阅读: {post.view_count || 0}</span>
          </div>

          <div 
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
          />

          {post.excerpt && (
            <div className="excerpt">
              <strong>摘要：</strong>{post.excerpt}
            </div>
          )}
        </article>

        <section className="comments-section">
          <h2>评论 ({comments.length})</h2>
          
          {comments.length === 0 ? (
            <div className="no-comments">暂无评论，快来发表第一条吧！</div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.author}</strong>
                    <span className="comment-date">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))}
            </div>
          )}

          <form className="comment-form" onSubmit={handleSubmitComment}>
            <h3>发表评论</h3>
            <div className="form-group">
              <label>姓名 *</label>
              <input
                type="text"
                required
                value={commentForm.author}
                onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>邮箱 *</label>
              <input
                type="email"
                required
                value={commentForm.email}
                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>评论内容 *</label>
              <textarea
                required
                rows="5"
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              />
            </div>
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? '提交中...' : '提交评论'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default BlogDetail


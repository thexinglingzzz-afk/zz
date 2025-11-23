import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="logo">
              <h1>我的博客</h1>
            </Link>
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={location.pathname.startsWith('/blog') ? 'active' : ''}
                >
                  博客
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="main">
        {children}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 个人博客. 使用 Supabase 和 Netlify 构建</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout


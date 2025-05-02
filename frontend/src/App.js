import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaMusic, FaStore, FaBook, FaUsers, FaUserCircle, FaSignInAlt } from 'react-icons/fa';

// 导入页面组件
import HomePage from './pages/home';
import MusicPage from './pages/music';
import MarketplacePage from './pages/marketplace';
import KnowledgePage from './pages/knowledge';
import CollaborationPage from './pages/collaboration';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // 检查登录状态
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-purple-700 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-xl font-bold">SoundSphere</Link>
              
              <div className="flex space-x-1 md:space-x-4">
                <Link to="/music" className="px-2 py-1 rounded hover:bg-purple-600 flex items-center">
                  <FaMusic className="mr-1" />
                  <span className="hidden md:inline">音乐</span>
                </Link>
                <Link to="/marketplace" className="px-2 py-1 rounded hover:bg-purple-600 flex items-center">
                  <FaStore className="mr-1" />
                  <span className="hidden md:inline">市场</span>
                </Link>
                <Link to="/knowledge" className="px-2 py-1 rounded hover:bg-purple-600 flex items-center">
                  <FaBook className="mr-1" />
                  <span className="hidden md:inline">知识</span>
                </Link>
                <Link to="/collaboration" className="px-2 py-1 rounded hover:bg-purple-600 flex items-center">
                  <FaUsers className="mr-1" />
                  <span className="hidden md:inline">协作</span>
                </Link>
                
                {isLoggedIn ? (
                  <div className="relative group">
                    <button className="px-2 py-1 rounded hover:bg-purple-600 flex items-center">
                      <FaUserCircle className="mr-1" />
                      <span className="hidden md:inline">个人中心</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                      <div className="py-2">
                        <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">个人资料</Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100"
                        >
                          退出登录
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="px-2 py-1 rounded hover:bg-purple-600 flex items-center">
                    <FaSignInAlt className="mr-1" />
                    <span className="hidden md:inline">登录</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        {/* 主要内容 */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            {/* 可以添加更多路由 */}
          </Routes>
        </div>
        
        {/* 页脚 */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">SoundSphere</h3>
                <p className="text-sm text-gray-400">音乐创作者的在线社区平台</p>
              </div>
              
              <div className="flex space-x-4">
                <Link to="/about" className="text-gray-400 hover:text-white">关于我们</Link>
                <Link to="/privacy" className="text-gray-400 hover:text-white">隐私政策</Link>
                <Link to="/terms" className="text-gray-400 hover:text-white">服务条款</Link>
                <Link to="/contact" className="text-gray-400 hover:text-white">联系我们</Link>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SoundSphere. 保留所有权利。
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App; 
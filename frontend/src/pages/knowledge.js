import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaHeart, FaRegHeart, FaSearch, FaTags } from 'react-icons/fa';

// 文章编辑器组件
const ArticleEditor = ({ initialData = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      // 准备提交数据
      const articleData = {
        title,
        content,
        tags: formattedTags
      };
      
      // 提交到父组件处理
      await onSubmit(articleData, cover);
      
    } catch (err) {
      setError(err.message || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{initialData.id ? '编辑文章' : '创建文章'}</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          取消
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows="12"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">标签 (用逗号分隔)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例如: 音乐理论, 制作技巧, 编曲"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">封面图片 (可选)</label>
          <input
            type="file"
            onChange={(e) => setCover(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
          />
          {initialData.coverPath && !cover && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">当前封面:</p>
              <img 
                src={`http://localhost:3000/uploads/article-covers/${initialData.coverPath}`} 
                alt="当前封面" 
                className="mt-1 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          disabled={loading}
        >
          {loading ? '提交中...' : (initialData.id ? '更新文章' : '发布文章')}
        </button>
      </form>
    </div>
  );
};

// 文章卡片组件
const ArticleCard = ({ article, isOwner, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleView = () => {
    navigate(`/knowledge/articles/${article.id}`);
    // 记录查看次数
    axios.post(`http://localhost:3000/api/knowledge/articles/${article.id}/view`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/api/knowledge/articles/${article.id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (article.onLike) article.onLike();
    } catch (err) {
      console.error('点赞失败', err);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(article);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/knowledge/articles/${article.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (onDelete) onDelete();
      } catch (err) {
        console.error('删除失败', err);
      }
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition mb-6"
      onClick={handleView}
    >
      {article.coverPath && (
        <div className="h-48 bg-gray-200 relative">
          <img 
            src={`http://localhost:3000/uploads/article-covers/${article.coverPath}`} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{article.title}</h3>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <FaEye className="mr-1" />
              <span>{article.views || 0}</span>
            </div>
            <div 
              className="flex items-center cursor-pointer"
              onClick={handleLike}
            >
              {article.isLiked ? (
                <FaHeart className="mr-1 text-red-500" />
              ) : (
                <FaRegHeart className="mr-1" />
              )}
              <span>{article.likes || 0}</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button 
                onClick={handleEdit}
                className="p-1.5 bg-blue-500 text-white rounded-md"
              >
                <FaEdit size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-red-500 text-white rounded-md"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 主知识页面
const KnowledgePage = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  
  const navigate = useNavigate();

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 获取所有标签
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/knowledge/tags');
      setTags(response.data || []);
    } catch (err) {
      console.error('获取标签失败', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // 获取所有文章
  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/knowledge/articles?page=${page}&limit=10`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }
      
      const response = await axios.get(url);
      setArticles(response.data.items || []);
    } catch (err) {
      console.error('获取文章失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的文章
  const fetchMyArticles = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/knowledge/articles/my?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyArticles(response.data.items || []);
    } catch (err) {
      console.error('获取我的文章失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理标签切换
  useEffect(() => {
    if (activeTab === 'articles') {
      fetchArticles();
    } else if (activeTab === 'myArticles' && isLoggedIn) {
      fetchMyArticles();
    }
  }, [activeTab, page, isLoggedIn, searchTerm, selectedTag]);

  // 处理文章提交
  const handleArticleSubmit = async (articleData, coverFile) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (editingArticle) {
        // 更新文章
        response = await axios.patch(
          `http://localhost:3000/api/knowledge/articles/${editingArticle.id}`, 
          articleData, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        // 创建文章
        response = await axios.post(
          'http://localhost:3000/api/knowledge/articles', 
          articleData, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      
      // 如果有封面图片，上传封面
      if (coverFile && response.data.id) {
        const formData = new FormData();
        formData.append('file', coverFile);
        
        await axios.post(
          `http://localhost:3000/api/knowledge/articles/${response.data.id}/cover`, 
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      
      // 重置状态
      setShowEditor(false);
      setEditingArticle(null);
      
      // 刷新文章列表
      if (activeTab === 'myArticles') {
        fetchMyArticles();
      } else {
        setActiveTab('myArticles');
      }
      
    } catch (err) {
      console.error('提交文章失败', err);
      throw new Error(err.response?.data?.message || '提交失败');
    }
  };

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  // 处理编辑文章
  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">音乐知识库</h1>
        
        {isLoggedIn && !showEditor && (
          <button
            onClick={() => {
              setEditingArticle(null);
              setShowEditor(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <FaPlus className="mr-2" /> 
            发布文章
          </button>
        )}
      </div>

      {showEditor && (
        <ArticleEditor 
          initialData={editingArticle || {}} 
          onSubmit={handleArticleSubmit} 
          onCancel={() => {
            setShowEditor(false);
            setEditingArticle(null);
          }} 
        />
      )}

      {!showEditor && (
        <>
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'articles'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  所有文章
                </button>
                
                {isLoggedIn && (
                  <button
                    onClick={() => setActiveTab('myArticles')}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'myArticles'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    我的文章
                  </button>
                )}
              </nav>
            </div>
          </div>

          {activeTab === 'articles' && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="搜索文章..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-md"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">所有标签</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  搜索
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-10">
              <p>加载中...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'articles' && (
                <div>
                  {articles.length > 0 ? (
                    articles.map(article => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        isOwner={false}
                        onLike={fetchArticles}
                      />
                    ))
                  ) : (
                    <p className="text-center py-10 text-gray-500">
                      暂无文章
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'myArticles' && (
                <div>
                  {myArticles.length > 0 ? (
                    myArticles.map(article => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        isOwner={true}
                        onDelete={fetchMyArticles}
                        onEdit={handleEditArticle}
                      />
                    ))
                  ) : (
                    <p className="text-center py-10 text-gray-500">
                      {isLoggedIn ? '你还没有发布任何文章' : '请先登录'}
                    </p>
                  )}
                </div>
              )}
              
              {/* 分页控制 */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-md mr-2 disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="px-4 py-2">第 {page} 页</span>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={(activeTab === 'articles' && articles.length < 10) || 
                           (activeTab === 'myArticles' && myArticles.length < 10)}
                  className="px-4 py-2 border rounded-md ml-2 disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* 标签列表 */}
      {activeTab === 'articles' && tags.length > 0 && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-3">
            <FaTags className="text-purple-600 mr-2" />
            <h3 className="font-bold text-lg">热门标签</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 20).map(tag => (
              <button 
                key={tag} 
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  tag === selectedTag 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage; 
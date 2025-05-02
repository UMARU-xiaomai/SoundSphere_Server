import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaHeart, FaRegHeart, FaSearch, FaTags, FaBookmark, FaRegBookmark, FaShare, FaComment } from 'react-icons/fa';

// 文章编辑器组件
const ArticleEditor = ({ initialData = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  // 简单解析Markdown
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // 处理标题
    let parsedText = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    parsedText = parsedText.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    parsedText = parsedText.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // 处理粗体和斜体
    parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理链接
    parsedText = parsedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>');
    
    // 处理列表
    parsedText = parsedText.replace(/^\- (.*$)/gm, '<li>$1</li>');
    parsedText = parsedText.replace(/<\/li>\n<li>/g, '</li><li>');
    parsedText = parsedText.replace(/<li>(.*)<\/li>/gm, '<ul><li>$1</li></ul>');
    
    // 处理代码块
    parsedText = parsedText.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>');
    
    // 处理段落和换行
    parsedText = parsedText.replace(/\n\n/g, '</p><p>');
    
    return `<p>${parsedText}</p>`;
  };

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
        <div className="flex space-x-2">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
          >
            {previewMode ? '返回编辑' : '预览'}
          </button>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            取消
          </button>
        </div>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {!previewMode ? (
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
            <label className="block text-gray-700 mb-2">内容 (支持Markdown格式)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md font-mono"
              rows="12"
              required
              placeholder="# 标题
## 子标题
**粗体** *斜体*

- 列表项
- 另一个列表项

[链接文字](https://example.com)

```
代码块
```
              "
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
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center transition"
            disabled={loading}
          >
            {loading ? '提交中...' : (initialData.id ? '更新文章' : '发布文章')}
          </button>
        </form>
      ) : (
        <div className="border rounded-md p-4">
          <h1 className="text-2xl font-bold mb-4">{title || '文章标题'}</h1>
          
          {tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.split(',').map((tag, i) => (
                <span 
                  key={i} 
                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} 
          />
        </div>
      )}
    </div>
  );
};

// 文章卡片组件
const ArticleCard = ({ article, isOwner, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked);

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
  
  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    
    try {
      const token = localStorage.getItem('token');
      if (isBookmarked) {
        await axios.delete(`http://localhost:3000/api/knowledge/articles/${article.id}/bookmark`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`http://localhost:3000/api/knowledge/articles/${article.id}/bookmark`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('收藏操作失败', err);
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
  
  const handleShare = (e) => {
    e.stopPropagation();
    // 复制分享链接
    const shareUrl = `${window.location.origin}/knowledge/articles/${article.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('链接已复制到剪贴板');
  };

  // 截取内容摘要
  const getExcerpt = (content, maxLength = 200) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1 mb-6"
      onClick={handleView}
    >
      {article.coverPath && (
        <div className="h-48 bg-gray-200">
          <img 
            src={`http://localhost:3000/uploads/article-covers/${article.coverPath}`} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 hover:text-purple-700 transition">{article.title}</h3>
        
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
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {getExcerpt(article.content)}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FaEye className="mr-1" />
              <span>{article.views || 0}</span>
            </div>
            
            <div 
              className="flex items-center cursor-pointer hover:text-red-500 transition"
              onClick={handleLike}
            >
              {article.isLiked ? (
                <FaHeart className="mr-1 text-red-500" />
              ) : (
                <FaRegHeart className="mr-1" />
              )}
              <span>{article.likes || 0}</span>
            </div>
            
            <div 
              className="flex items-center cursor-pointer hover:text-yellow-500 transition"
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <FaBookmark className="mr-1 text-yellow-500" />
              ) : (
                <FaRegBookmark className="mr-1" />
              )}
            </div>
            
            <div 
              className="flex items-center cursor-pointer hover:text-blue-500 transition"
              onClick={handleShare}
            >
              <FaShare className="mr-1" />
            </div>
            
            {article.comments && (
              <div className="flex items-center">
                <FaComment className="mr-1" />
                <span>{article.commentsCount || 0}</span>
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button 
                onClick={handleEdit}
                className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                <FaEdit size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
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

const KnowledgePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [articles, setArticles] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  // 获取热门标签
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/knowledge/tags');
      setPopularTags(response.data || []);
    } catch (err) {
      console.error('获取标签失败', err);
    }
  };

  // 获取所有文章
  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:3000/api/knowledge/articles';
      
      // 添加搜索和标签过滤参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => params.append('tags', tag));
      }
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
      setArticles(response.data || []);
    } catch (err) {
      setError('加载文章失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的文章
  const fetchMyArticles = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/api/knowledge/my-articles';
      
      // 添加搜索和标签过滤参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => params.append('tags', tag));
      }
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyArticles(response.data || []);
    } catch (err) {
      setError('加载文章失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取我的收藏
  const fetchBookmarks = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/api/knowledge/bookmarks';
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBookmarks(response.data || []);
    } catch (err) {
      setError('加载收藏失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    fetchTags();
    fetchArticles();
    if (isLoggedIn) {
      fetchMyArticles();
      fetchBookmarks();
    }
  }, [isLoggedIn]);

  // 搜索和标签过滤时更新
  useEffect(() => {
    if (activeTab === 'all') {
      fetchArticles();
    } else if (activeTab === 'my' && isLoggedIn) {
      fetchMyArticles();
    } else if (activeTab === 'bookmarks' && isLoggedIn) {
      fetchBookmarks();
    }
  }, [searchTerm, selectedTags, activeTab]);

  const handleArticleSubmit = async (articleData, coverFile) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingArticle) {
        // 更新文章
        await axios.put(`http://localhost:3000/api/knowledge/articles/${editingArticle.id}`, articleData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // 如果有新封面，上传封面
        if (coverFile) {
          const coverFormData = new FormData();
          coverFormData.append('file', coverFile);
          
          await axios.post(`http://localhost:3000/api/knowledge/articles/${editingArticle.id}/cover`, coverFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      } else {
        // 创建新文章
        const response = await axios.post('http://localhost:3000/api/knowledge/articles', articleData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // 如果有封面，上传封面
        if (coverFile && response.data.id) {
          const coverFormData = new FormData();
          coverFormData.append('file', coverFile);
          
          await axios.post(`http://localhost:3000/api/knowledge/articles/${response.data.id}/cover`, coverFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }
      
      // 重置状态
      setShowEditor(false);
      setEditingArticle(null);
      
      // 刷新文章列表
      if (activeTab === 'my') {
        fetchMyArticles();
      } else {
        fetchArticles();
        setActiveTab('all');
      }
      
      // 同时更新标签列表
      fetchTags();
      
    } catch (err) {
      console.error('提交文章失败', err);
      throw new Error(err.response?.data?.message || '提交失败');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑已在useEffect中处理
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };
  
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">知识库</h1>
        
        {isLoggedIn && (
          <button
            onClick={() => {
              setEditingArticle(null);
              setShowEditor(!showEditor);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center shadow-sm transition"
          >
            <FaPlus className="mr-2" />
            {showEditor ? '取消' : '发布文章'}
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <FaTags className="mr-2 text-purple-600" /> 热门标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                    selectedTags.includes(tag.name)
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
            
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-purple-600 hover:text-purple-800"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                所有文章
              </button>
              
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => setActiveTab('my')}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'my' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    我的文章
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('bookmarks');
                      fetchBookmarks();
                    }}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'bookmarks' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    我的收藏
                  </button>
                </>
              )}
            </div>
            
            <form onSubmit={handleSearch} className="flex mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索文章..."
                className="px-3 py-2 border rounded-l-md flex-grow"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner"></div>
              <p>加载中...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'all' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">所有文章</h2>
                  {articles.length > 0 ? (
                    <div className="space-y-6">
                      {articles.map(article => (
                        <ArticleCard 
                          key={article.id} 
                          article={article}
                          isOwner={article.isOwner}
                          onDelete={fetchArticles}
                          onEdit={handleEditArticle}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">
                      {selectedTags.length > 0 ? '没有符合条件的文章' : '暂无文章'}
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'my' && isLoggedIn && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">我的文章</h2>
                  {myArticles.length > 0 ? (
                    <div className="space-y-6">
                      {myArticles.map(article => (
                        <ArticleCard 
                          key={article.id} 
                          article={article}
                          isOwner={true}
                          onDelete={fetchMyArticles}
                          onEdit={handleEditArticle}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">
                      {selectedTags.length > 0 ? '没有符合条件的文章' : '您还没有发布任何文章'}
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'bookmarks' && isLoggedIn && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">我的收藏</h2>
                  {bookmarks.length > 0 ? (
                    <div className="space-y-6">
                      {bookmarks.map(article => (
                        <ArticleCard 
                          key={article.id} 
                          article={{...article, isBookmarked: true}}
                          isOwner={article.isOwner}
                          onDelete={fetchBookmarks}
                          onEdit={handleEditArticle}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">您还没有收藏任何文章</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage; 
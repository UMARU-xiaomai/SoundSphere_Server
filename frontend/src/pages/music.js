import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaUpload, FaEdit, FaTrash } from 'react-icons/fa';

// 音乐播放器组件
const MusicPlayer = ({ music }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(`http://localhost:3000/uploads/music/${music.filePath}`));

  useEffect(() => {
    if (isPlaying) {
      audio.play();
      // 记录播放次数
      axios.post(`http://localhost:3000/api/music/${music.id}/play`);
    } else {
      audio.pause();
    }
    
    return () => {
      audio.pause();
    };
  }, [isPlaying, audio, music.id]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={togglePlay}
        className="p-2 bg-purple-600 text-white rounded-full"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div>
        <p className="text-sm">{music.title}</p>
        <p className="text-xs text-gray-500">{music.artist}</p>
      </div>
    </div>
  );
};

// 音乐上传表单
const UploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('请选择音乐文件');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // 创建音乐表单数据
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('genre', genre);
      formData.append('file', file);
      
      // 上传音乐
      const response = await axios.post('http://localhost:3000/api/music', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // 如果有封面，上传封面
      if (cover && response.data.id) {
        const coverFormData = new FormData();
        coverFormData.append('file', cover);
        
        await axios.post(`http://localhost:3000/api/music/upload-cover/${response.data.id}`, coverFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // 重置表单
      setTitle('');
      setDescription('');
      setGenre('');
      setFile(null);
      setCover(null);
      
      // 通知父组件上传成功
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.message || '上传失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">上传音乐</h2>
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
          <label className="block text-gray-700 mb-2">描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">流派</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">选择流派</option>
            <option value="Pop">流行</option>
            <option value="Rock">摇滚</option>
            <option value="Jazz">爵士</option>
            <option value="Classical">古典</option>
            <option value="Electronic">电子</option>
            <option value="HipHop">嘻哈</option>
            <option value="Other">其他</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">音乐文件</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-md"
            accept="audio/*"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">封面图片</label>
          <input
            type="file"
            onChange={(e) => setCover(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
          />
        </div>
        
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          disabled={loading}
        >
          {loading ? '上传中...' : <><FaUpload className="mr-2" /> 上传音乐</>}
        </button>
      </form>
    </div>
  );
};

// 音乐列表项组件
const MusicItem = ({ music, isMyMusic, onDelete, onLike }) => {
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/api/music/${music.id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (onLike) onLike();
    } catch (err) {
      console.error('点赞失败', err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这首音乐吗？')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/music/${music.id}`, {
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

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/music/edit/${music.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 overflow-hidden">
          {music.coverPath ? (
            <img 
              src={`http://localhost:3000/uploads/covers/${music.coverPath}`} 
              alt={music.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">无封面</div>
          )}
        </div>
        
        <div>
          <h3 className="font-bold">{music.title}</h3>
          <p className="text-sm text-gray-600">{music.genre || '未分类'}</p>
          <p className="text-xs text-gray-500">播放次数: {music.plays || 0} | 点赞数: {music.likes || 0}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <MusicPlayer music={music} />
        
        <button 
          onClick={handleLike}
          className="p-2 text-red-500"
        >
          {music.isLiked ? <FaHeart /> : <FaRegHeart />}
        </button>
        
        {isMyMusic && (
          <>
            <button 
              onClick={handleEdit}
              className="p-2 text-blue-500"
            >
              <FaEdit />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 text-red-500"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// 主音乐页面
const MusicPage = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [publicMusic, setPublicMusic] = useState([]);
  const [myMusic, setMyMusic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 获取公开音乐
  const fetchPublicMusic = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/music?page=${page}&limit=10`);
      setPublicMusic(response.data.items || []);
    } catch (err) {
      console.error('获取音乐失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的音乐
  const fetchMyMusic = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/music/my?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyMusic(response.data.items || []);
    } catch (err) {
      console.error('获取我的音乐失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理标签切换
  useEffect(() => {
    if (activeTab === 'public') {
      fetchPublicMusic();
    } else if (activeTab === 'my') {
      fetchMyMusic();
    }
  }, [activeTab, page, isLoggedIn]);

  // 处理上传成功
  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    if (activeTab === 'my') {
      fetchMyMusic();
    } else {
      fetchPublicMusic();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">音乐中心</h1>
        
        {isLoggedIn && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <FaUpload className="mr-2" /> 
            {showUploadForm ? '取消上传' : '上传音乐'}
          </button>
        )}
      </div>

      {showUploadForm && (
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      )}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('public')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'public'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              公开音乐
            </button>
            
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('my')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                我的音乐
              </button>
            )}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>加载中...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'public' && (
            <div>
              {publicMusic.length > 0 ? (
                publicMusic.map(music => (
                  <MusicItem 
                    key={music.id} 
                    music={music} 
                    isMyMusic={false} 
                    onLike={fetchPublicMusic}
                  />
                ))
              ) : (
                <p className="text-center py-10 text-gray-500">暂无公开音乐</p>
              )}
            </div>
          )}
          
          {activeTab === 'my' && (
            <div>
              {myMusic.length > 0 ? (
                myMusic.map(music => (
                  <MusicItem 
                    key={music.id} 
                    music={music} 
                    isMyMusic={true} 
                    onDelete={fetchMyMusic}
                    onLike={fetchMyMusic}
                  />
                ))
              ) : (
                <p className="text-center py-10 text-gray-500">
                  {isLoggedIn ? '你还没有上传任何音乐' : '请先登录'}
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
              disabled={(activeTab === 'public' && publicMusic.length < 10) || 
                       (activeTab === 'my' && myMusic.length < 10)}
              className="px-4 py-2 border rounded-md ml-2 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage; 
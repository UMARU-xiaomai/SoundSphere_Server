import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaUpload, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

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

// 增强音乐列表项组件
const MusicItem = ({ music, isMyMusic, onDelete, onLike }) => {
  const navigate = useNavigate();
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(`http://localhost:3000/uploads/music/${music.filePath}`));

  useEffect(() => {
    // 添加音频事件监听
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audio]);

  const updateProgress = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    setAudioProgress(progress);
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      // 记录播放次数
      axios.post(`http://localhost:3000/api/music/${music.id}/play`);
    }
    setIsPlaying(!isPlaying);
  };

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
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition">
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
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <h3 className="font-bold">{music.title}</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLike}
                className="text-gray-600 hover:text-red-500 transition"
              >
                {music.hasLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              {isMyMusic && (
                <>
                  <button 
                    onClick={handleEdit}
                    className="text-gray-600 hover:text-blue-500 transition"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-500 transition"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">{music.artist || '未知艺术家'}</p>
          <p className="text-xs text-gray-500">{music.genre || '未分类'} | 播放次数: {music.plays || 0} | 点赞数: {music.likes || 0}</p>
          
          <div className="mt-2 flex items-center">
            <button 
              onClick={togglePlay}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <div className="ml-2 flex-grow">
              <div className="bg-gray-200 h-2 rounded-full w-full">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主音乐页面
const MusicPage = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [publicMusic, setPublicMusic] = useState([]);
  const [myMusic, setMyMusic] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  // 获取公开音乐
  const fetchPublicMusic = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:3000/api/music/public';
      
      // 添加搜索和过滤参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterGenre) params.append('genre', filterGenre);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
      setPublicMusic(response.data || []);
    } catch (err) {
      setError('加载音乐失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的音乐
  const fetchMyMusic = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/api/music/my';
      
      // 添加搜索和过滤参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterGenre) params.append('genre', filterGenre);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyMusic(response.data || []);
    } catch (err) {
      setError('加载音乐失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchPublicMusic();
    if (isLoggedIn) fetchMyMusic();
  }, [isLoggedIn]);

  // 搜索和过滤时更新
  useEffect(() => {
    if (activeTab === 'public') {
      fetchPublicMusic();
    } else if (activeTab === 'my' && isLoggedIn) {
      fetchMyMusic();
    }
  }, [searchTerm, filterGenre, activeTab]);

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchMyMusic();
    setActiveTab('my');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑已经在useEffect中处理
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">音乐库</h1>
        
        {isLoggedIn && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <FaUpload className="mr-2" />
            {showUploadForm ? '取消' : '上传音乐'}
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {showUploadForm && (
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'public' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              公开音乐
            </button>
            
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'my' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                我的音乐
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">所有流派</option>
              <option value="Pop">流行</option>
              <option value="Rock">摇滚</option>
              <option value="Jazz">爵士</option>
              <option value="Classical">古典</option>
              <option value="Electronic">电子</option>
              <option value="HipHop">嘻哈</option>
              <option value="Other">其他</option>
            </select>
            
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索音乐..."
                className="px-3 py-2 border rounded-l-md flex-grow"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'public' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">公开音乐</h2>
              {publicMusic.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {publicMusic.map(music => (
                    <MusicItem 
                      key={music.id} 
                      music={music} 
                      isMyMusic={false}
                      onLike={fetchPublicMusic}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">暂无公开音乐</p>
              )}
            </div>
          )}
          
          {activeTab === 'my' && isLoggedIn && (
            <div>
              <h2 className="text-xl font-semibold mb-4">我的音乐</h2>
              {myMusic.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {myMusic.map(music => (
                    <MusicItem 
                      key={music.id} 
                      music={music} 
                      isMyMusic={true}
                      onDelete={fetchMyMusic}
                      onLike={fetchMyMusic}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  {loading ? '加载中...' : '您还没有上传音乐'}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicPage; 
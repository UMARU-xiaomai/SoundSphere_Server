import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUpload, FaCreditCard, FaDownload, FaEdit, FaTrash, FaSearch, FaFilter, FaStar, FaSortAmountDown } from 'react-icons/fa';

// 产品卡片组件
const ProductCard = ({ product, isOwner, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleView = () => {
    navigate(`/marketplace/products/${product.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(product.id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个产品吗？')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/marketplace/products/${product.id}`, {
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
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
      onClick={handleView}
    >
      <div className="h-48 bg-gray-200 relative">
        {product.coverPath ? (
          <img 
            src={`http://localhost:3000/uploads/product-covers/${product.coverPath}`} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">无封面</div>
        )}
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md">
          ¥{product.price.toFixed(2)}
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-md flex items-center">
            <FaStar className="mr-1" /> 精选
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.type}</p>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">销量: {product.salesCount || 0}</span>
            {product.rating && (
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-500">
                  {[...Array(Math.floor(product.rating))].map((_, i) => (
                    <FaStar key={i} size={12} />
                  ))}
                </div>
                <span className="text-xs ml-1 text-gray-500">({product.ratingCount || 0})</span>
              </div>
            )}
          </div>
          
          {isOwner ? (
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
          ) : (
            isLoggedIn && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/marketplace/products/${product.id}`);
                }}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-md flex items-center text-sm hover:bg-purple-700 transition shadow-sm"
              >
                <FaShoppingCart size={14} className="mr-1" /> 购买
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// 产品上传表单
const ProductUploadForm = ({ onUploadSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [license, setLicense] = useState('');
  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('请选择产品文件');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('请输入有效的价格');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // 创建产品表单数据
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('type', type);
      formData.append('license', license);
      formData.append('file', file);
      
      // 上传产品
      const response = await axios.post('http://localhost:3000/api/marketplace/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const productId = response.data.id;
      
      // 如果有预览文件，上传预览
      if (previewFile && productId) {
        const previewFormData = new FormData();
        previewFormData.append('file', previewFile);
        
        await axios.post(`http://localhost:3000/api/marketplace/products/${productId}/preview`, previewFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // 如果有封面，上传封面
      if (cover && productId) {
        const coverFormData = new FormData();
        coverFormData.append('file', cover);
        
        await axios.post(`http://localhost:3000/api/marketplace/products/${productId}/cover`, coverFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // 重置表单
      setName('');
      setDescription('');
      setPrice('');
      setType('');
      setLicense('');
      setFile(null);
      setPreviewFile(null);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">上传产品</h2>
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
          <label className="block text-gray-700 mb-2">产品名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label className="block text-gray-700 mb-2">价格 (¥)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">产品类型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">选择类型</option>
            <option value="Music">音乐</option>
            <option value="Sample">采样</option>
            <option value="Preset">预设</option>
            <option value="Loop">循环</option>
            <option value="SoundFX">音效</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">许可类型</label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">选择许可</option>
            <option value="Standard">标准许可</option>
            <option value="Extended">扩展许可</option>
            <option value="Exclusive">独家许可</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">产品文件</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">预览文件 (可选)</label>
          <input
            type="file"
            onChange={(e) => setPreviewFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-md"
            accept="audio/*"
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
        </div>
        
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          disabled={loading}
        >
          {loading ? '上传中...' : <><FaUpload className="mr-2" /> 发布产品</>}
        </button>
      </form>
    </div>
  );
};

// 订单列表项组件
const OrderItem = ({ order }) => {
  const [downloadUrl, setDownloadUrl] = useState('');
  
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/marketplace/orders/${order.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.downloadUrl) {
        setDownloadUrl(response.data.downloadUrl);
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('获取下载链接失败', err);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">{order.product.name}</h3>
          <p className="text-sm text-gray-600">订单号: {order.id}</p>
          <p className="text-sm text-gray-600">下单时间: {new Date(order.createdAt).toLocaleString()}</p>
          <p className="text-sm text-gray-600">价格: ¥{order.amount.toFixed(2)}</p>
        </div>
        
        <div>
          <span className={`px-2 py-1 rounded-md text-xs ${
            order.status === 'Paid' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status === 'Paid' ? '已支付' : '待支付'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        {order.status === 'Pending' ? (
          <button 
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                await axios.post(`http://localhost:3000/api/marketplace/orders/${order.id}/pay`, {}, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                window.location.reload();
              } catch (err) {
                console.error('支付失败', err);
              }
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <FaCreditCard className="mr-2" /> 支付
          </button>
        ) : (
          <button 
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <FaDownload className="mr-2" /> 下载
          </button>
        )}
      </div>
    </div>
  );
};

// 主市场页面
const MarketplacePage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  // 获取产品列表
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:3000/api/marketplace/products';
      
      // 添加搜索、过滤和排序参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType) params.append('type', filterType);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      params.append('sortBy', sortBy);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
      setProducts(response.data || []);
    } catch (err) {
      setError('加载产品失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的产品
  const fetchMyProducts = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/api/marketplace/my-products';
      
      // 添加搜索和过滤参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType) params.append('type', filterType);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyProducts(response.data || []);
    } catch (err) {
      setError('加载我的产品失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的订单
  const fetchMyOrders = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/marketplace/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyOrders(response.data || []);
    } catch (err) {
      setError('加载订单失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchProducts();
    if (isLoggedIn) {
      fetchMyProducts();
      fetchMyOrders();
    }
  }, [isLoggedIn]);

  // 处理搜索和过滤变化
  useEffect(() => {
    if (activeTab === 'browse') {
      fetchProducts();
    } else if (activeTab === 'my-products' && isLoggedIn) {
      fetchMyProducts();
    }
  }, [searchTerm, filterType, priceRange, sortBy, activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索逻辑已在useEffect中处理
  };

  const handleApplyPriceFilter = () => {
    // 价格过滤逻辑已在useEffect中处理
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchMyProducts();
    setActiveTab('my-products');
  };

  const handleEditProduct = (productId) => {
    navigate(`/marketplace/edit-product/${productId}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', () => {
    // 初始化模态框
    initModals();
    
    // 初始化商品分类
    initCategorySlider();
    
    // 初始化商品筛选
    initProductFilters();
    
    // 初始化商品交互
    initProductInteractions();
    
    // 初始化加载更多按钮
    initLoadMore();
    
    // 初始化搜索功能
    initSearch();
  });

  // 初始化模态框
  function initModals() {
    // 登录模态框
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    
    // 注册模态框
    const signupModal = document.getElementById('signup-modal');
    const signupBtn = document.getElementById('signup-btn');
    
    // 商品详情模态框
    const productDetailModal = document.getElementById('product-detail-modal');
    
    // 所有关闭按钮
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // 点击登录按钮打开登录模态框
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            openModal(loginModal);
        });
    }
    
    // 点击注册按钮打开注册模态框
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            openModal(signupModal);
        });
    }
    
    // 关闭按钮事件
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 点击模态框背景关闭
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
  }

  // 打开模态框
  function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
  }

  // 关闭模态框
  function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
  }

  // 初始化商品分类
  function initCategorySlider() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有分类的active类
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 给当前分类添加active类
            item.classList.add('active');
            
            // 获取分类名称，用于筛选商品
            const categoryName = item.querySelector('h3').textContent;
            // 根据分类筛选商品
            filterProductsByCategory(categoryName);
        });
    });
  }

  // 初始化商品筛选
  function initProductFilters() {
    const productFilter = document.getElementById('product-filter');
    
    if (productFilter) {
        productFilter.addEventListener('change', () => {
            const filterOption = productFilter.value;
            // 根据选择的选项筛选/排序商品
            sortProducts(filterOption);
        });
    }
  }

  // 初始化商品交互
  function initProductInteractions() {
    // 商品预览按钮
    const previewButtons = document.querySelectorAll('.preview-btn');
    
    // 商品收藏按钮
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    // 添加到购物车按钮
    const addToCartButtons = document.querySelectorAll('.btn-full');
    
    // 商品预览
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            // 获取商品ID
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            // 预览商品
            previewProduct(productId);
        });
    });
    
    // 商品收藏
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            // 获取商品ID
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            // 添加/移除收藏
            toggleWishlist(productId, button);
        });
    });
    
    // 添加到购物车
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            // 获取商品ID
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            // 添加到购物车
            addToCart(productId);
        });
    });
    
    // 商品卡片点击打开详情
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            openProductDetail(productId);
        });
    });
  }

  // 初始化加载更多按钮
  function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-products');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // 加载更多商品
            loadMoreProducts();
        });
    }
  }

  // 初始化搜索功能
  function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // 执行搜索
                searchProducts(searchTerm);
            }
        });
        
        // 回车键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    // 执行搜索
                    searchProducts(searchTerm);
                }
            }
        });
    }
  }

  // 模拟API调用：根据分类筛选商品
  function filterProductsByCategory(category) {
    console.log(`正在按分类 ${category} 筛选商品...`);
    // 实际开发中，这里应该调用后端API
    
    // 模拟筛选后的视觉效果
    const productsGrid = document.querySelector('.products-grid');
    
    // 模拟加载状态
    productsGrid.classList.add('loading');
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 移除加载状态
        productsGrid.classList.remove('loading');
        
        // 显示过滤结果
        alert(`已显示分类: ${category} 的商品`);
    }, 500);
  }

  // 模拟API调用：排序商品
  function sortProducts(option) {
    console.log(`正在按 ${option} 排序商品...`);
    // 实际开发中，这里应该调用后端API
    
    // 模拟排序后的视觉效果
    const productsGrid = document.querySelector('.products-grid');
    
    // 模拟加载状态
    productsGrid.classList.add('loading');
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 移除加载状态
        productsGrid.classList.remove('loading');
        
        // 显示排序结果
        let sortMessage = '';
        switch (option) {
            case 'trending':
                sortMessage = '热门商品';
                break;
            case 'newest':
                sortMessage = '最新商品';
                break;
            case 'price-low':
                sortMessage = '价格从低到高';
                break;
            case 'price-high':
                sortMessage = '价格从高到低';
                break;
            case 'rating':
                sortMessage = '评分最高';
                break;
            default:
                sortMessage = option;
        }
        
        alert(`已按 ${sortMessage} 排序`);
    }, 500);
  }

  // 模拟API调用：预览商品
  function previewProduct(productId) {
    console.log(`正在预览商品 ID: ${productId}`);
    // 实际开发中，这里应该打开音频播放器或弹出预览窗口
    
    alert(`正在播放商品预览`);
  }

  // 模拟API调用：添加/移除收藏
  function toggleWishlist(productId, button) {
    console.log(`正在切换商品 ID: ${productId} 的收藏状态`);
    // 实际开发中，这里应该调用后端API
    
    // 模拟收藏状态切换
    if (button.classList.contains('wishlist-active')) {
        button.classList.remove('wishlist-active');
        alert(`已从收藏中移除`);
    } else {
        button.classList.add('wishlist-active');
        alert(`已添加到收藏`);
    }
  }

  // 模拟API调用：添加到购物车
  function addToCart(productId) {
    console.log(`正在将商品 ID: ${productId} 添加到购物车`);
    // 实际开发中，这里应该调用后端API
    
    alert(`已添加到购物车`);
  }

  // 模拟API调用：打开商品详情
  function openProductDetail(productId) {
    console.log(`正在打开商品 ID: ${productId} 的详情`);
    // 实际开发中，这里应该加载商品详情并打开模态框
    
    const productDetailModal = document.getElementById('product-detail-modal');
    if (productDetailModal) {
        openModal(productDetailModal);
    } else {
        alert(`正在查看商品详情`);
    }
  }

  // 模拟API调用：加载更多商品
  function loadMoreProducts() {
    console.log('正在加载更多商品...');
    // 实际开发中，这里应该调用后端API
    
    // 获取商品列表容器
    const productsGrid = document.querySelector('.products-grid');
    const loadMoreBtn = document.getElementById('load-more-products');
    
    // 模拟加载延迟
    loadMoreBtn.textContent = '正在加载...';
    loadMoreBtn.disabled = true;
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 模拟新加载的商品数据
        const newProducts = [
            {
                title: 'R&B风格采样包',
                seller: '节奏大师',
                rating: 4.6,
                reviews: 78,
                price: '¥119',
                category: '采样包',
                image: '../src/assets/placeholder-product.jpg'
            },
            {
                title: 'Lo-Fi嘻哈鼓组',
                seller: '复古音乐工作室',
                rating: 4.8,
                reviews: 92,
                price: '¥99',
                originalPrice: '¥159',
                category: '鼓组',
                image: '../src/assets/placeholder-product.jpg'
            }
        ];
        
        // 为每个新商品创建HTML元素
        newProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', Math.floor(Math.random() * 1000)); // 模拟产品ID
            
            const hasDiscount = product.originalPrice ? true : false;
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-category">${product.category}</div>
                    <div class="product-actions">
                        <button class="preview-btn"><i class="play-icon"></i> 预览</button>
                        <button class="wishlist-btn"><i class="heart-icon"></i></button>
                    </div>
                </div>
                <div class="product-content">
                    <h3>${product.title}</h3>
                    <p class="product-seller">由 ${product.seller} 出品</p>
                    <div class="product-meta">
                        <div class="product-rating">
                            <i class="star-filled"></i>
                            <i class="star-filled"></i>
                            <i class="star-filled"></i>
                            <i class="star-filled"></i>
                            <i class="${product.rating >= 4.5 ? 'star-filled' : 'star-half'}"></i>
                            <span>${product.rating} (${product.reviews})</span>
                        </div>
                        <div class="product-price">
                            ${hasDiscount ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                            <span class="price">${product.price}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full">添加到购物车</button>
                </div>
            `;
            
            // 添加到商品列表
            productsGrid.appendChild(productCard);
        });
        
        // 重新初始化商品交互
        initProductInteractions();
        
        // 恢复按钮状态
        loadMoreBtn.textContent = '显示更多商品';
        loadMoreBtn.disabled = false;
    }, 1000);
  }

  // 模拟API调用：搜索商品
  function searchProducts(term) {
    console.log(`正在搜索: ${term}`);
    // 实际开发中，这里应该调用后端API
    
    alert(`正在搜索: ${term}`);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">市场</h1>
        
        {isLoggedIn && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center shadow-sm"
          >
            <FaUpload className="mr-2" />
            {showUploadForm ? '取消' : '上传产品'}
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {showUploadForm && (
        <ProductUploadForm 
          onUploadSuccess={handleUploadSuccess} 
          onCancel={() => setShowUploadForm(false)}
        />
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'browse' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            浏览产品
          </button>
          
          {isLoggedIn && (
            <>
              <button
                onClick={() => setActiveTab('my-products')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'my-products' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                我的产品
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  fetchMyOrders();
                }}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'orders' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                我的订单
              </button>
            </>
          )}
        </div>
        
        {(activeTab === 'browse' || activeTab === 'my-products') && (
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索产品..."
                className="px-3 py-2 border rounded-l-md flex-grow"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
              >
                <FaSearch />
              </button>
            </form>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">所有类型</option>
                <option value="Sample">音乐样本</option>
                <option value="Preset">音色预设</option>
                <option value="MIDI">MIDI文件</option>
                <option value="Track">完整音轨</option>
                <option value="Other">其他</option>
              </select>
              
              <div className="flex items-center">
                <div className="flex border rounded-md overflow-hidden">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    placeholder="最低价"
                    className="w-20 px-2 py-2 border-r"
                    min="0"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    placeholder="最高价"
                    className="w-20 px-2 py-2"
                    min="0"
                  />
                  <button
                    onClick={handleApplyPriceFilter}
                    className="bg-gray-200 px-2 hover:bg-gray-300"
                  >
                    <FaFilter />
                  </button>
                </div>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md flex items-center"
              >
                <option value="newest">最新上传</option>
                <option value="popular">最受欢迎</option>
                <option value="priceAsc">价格从低到高</option>
                <option value="priceDesc">价格从高到低</option>
              </select>
              
              <button
                onClick={resetFilters}
                className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                重置筛选
              </button>
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'browse' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">全部产品</h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      isOwner={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500">暂无产品</p>
              )}
            </div>
          )}
          
          {activeTab === 'my-products' && isLoggedIn && (
            <div>
              <h2 className="text-xl font-semibold mb-4">我的产品</h2>
              {myProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {myProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      isOwner={true}
                      onDelete={fetchMyProducts}
                      onEdit={handleEditProduct}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500">你还没有上传任何产品</p>
              )}
            </div>
          )}
          
          {activeTab === 'orders' && isLoggedIn && (
            <div>
              <h2 className="text-xl font-semibold mb-4">我的订单</h2>
              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500">你还没有任何订单</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage; 
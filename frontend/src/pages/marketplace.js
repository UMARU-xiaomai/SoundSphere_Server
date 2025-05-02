import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUpload, FaCreditCard, FaDownload, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

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
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={handleView}
    >
      <div className="h-40 bg-gray-200 relative">
        {product.coverPath ? (
          <img 
            src={`http://localhost:3000/uploads/product-covers/${product.coverPath}`} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">无封面</div>
        )}
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm">
          ¥{product.price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{product.type}</p>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">销量: {product.salesCount || 0}</span>
          
          {isOwner ? (
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
          ) : (
            isLoggedIn && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/marketplace/products/${product.id}`);
                }}
                className="p-1.5 bg-purple-600 text-white rounded-md flex items-center text-sm"
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
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('');
  const [licenseType, setLicenseType] = useState('');
  
  const navigate = useNavigate();

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 获取所有产品
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/marketplace/products?page=${page}&limit=12`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (productType) {
        url += `&type=${encodeURIComponent(productType)}`;
      }
      
      if (licenseType) {
        url += `&license=${encodeURIComponent(licenseType)}`;
      }
      
      const response = await axios.get(url);
      setProducts(response.data.items || []);
    } catch (err) {
      console.error('获取产品失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的产品
  const fetchMyProducts = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/marketplace/products/mine?page=${page}&limit=12`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyProducts(response.data.items || []);
    } catch (err) {
      console.error('获取我的产品失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取我的订单
  const fetchMyOrders = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/marketplace/orders?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data.items || []);
    } catch (err) {
      console.error('获取我的订单失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理标签切换
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'myProducts' && isLoggedIn) {
      fetchMyProducts();
    } else if (activeTab === 'orders' && isLoggedIn) {
      fetchMyOrders();
    }
  }, [activeTab, page, isLoggedIn, searchTerm, productType, licenseType]);

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // 处理上传成功
  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    if (activeTab === 'myProducts') {
      fetchMyProducts();
    } else {
      setActiveTab('myProducts');
    }
  };

  // 处理编辑产品
  const handleEditProduct = (productId) => {
    navigate(`/marketplace/products/edit/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">音乐市场</h1>
        
        {isLoggedIn && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <FaUpload className="mr-2" /> 
            {showUploadForm ? '取消上传' : '上传产品'}
          </button>
        )}
      </div>

      {showUploadForm && (
        <ProductUploadForm 
          onUploadSuccess={handleUploadSuccess} 
          onCancel={() => setShowUploadForm(false)} 
        />
      )}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('products')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              所有产品
            </button>
            
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab('myProducts')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'myProducts'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  我的产品
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  我的订单
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 产品搜索和筛选 */}
      {activeTab === 'products' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索产品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">所有类型</option>
              <option value="Music">音乐</option>
              <option value="Sample">采样</option>
              <option value="Preset">预设</option>
              <option value="Loop">循环</option>
              <option value="SoundFX">音效</option>
            </select>
            
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">所有许可</option>
              <option value="Standard">标准许可</option>
              <option value="Extended">扩展许可</option>
              <option value="Exclusive">独家许可</option>
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
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isOwner={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  暂无产品
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'myProducts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myProducts.length > 0 ? (
                myProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isOwner={true}
                    onDelete={fetchMyProducts}
                    onEdit={handleEditProduct}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  {isLoggedIn ? '你还没有上传任何产品' : '请先登录'}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              {orders.length > 0 ? (
                orders.map(order => (
                  <OrderItem key={order.id} order={order} />
                ))
              ) : (
                <p className="text-center py-10 text-gray-500">
                  {isLoggedIn ? '你还没有任何订单' : '请先登录'}
                </p>
              )}
            </div>
          )}
          
          {/* 分页控制 */}
          {(activeTab === 'products' || activeTab === 'myProducts') && (
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
                disabled={(activeTab === 'products' && products.length < 12) || 
                         (activeTab === 'myProducts' && myProducts.length < 12)}
                className="px-4 py-2 border rounded-md ml-2 disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage; 
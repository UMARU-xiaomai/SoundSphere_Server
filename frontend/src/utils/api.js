// API工具函数
// 这个文件包含与后端API交互的函数

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

// 请求配置
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

// 错误处理函数
function handleApiError(error) {
    console.error('API请求错误:', error);
    
    if (error.response) {
        // 服务器响应了，但状态码不在2xx范围内
        return {
            success: false,
            status: error.response.status,
            message: error.response.data.message || '服务器错误',
            data: null
        };
    } else if (error.request) {
        // 请求已发出，但没有收到响应
        return {
            success: false,
            status: 0,
            message: '网络错误，无法连接到服务器',
            data: null
        };
    } else {
        // 设置请求时发生错误
        return {
            success: false,
            status: 0,
            message: '请求配置错误: ' + error.message,
            data: null
        };
    }
}

// 通用请求函数
async function apiRequest(endpoint, method = 'GET', data = null, headers = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const options = {
            method,
            headers: { ...DEFAULT_HEADERS, ...headers }
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message: responseData.message || '请求失败',
                data: null
            };
        }
        
        return {
            success: true,
            status: response.status,
            message: 'success',
            data: responseData
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// API请求函数
const api = {
    // 音乐相关API
    music: {
        // 获取音乐列表
        getList: async (params = {}) => {
            const queryParams = new URLSearchParams(params).toString();
            return await apiRequest(`/music?${queryParams}`);
        },
        
        // 获取音乐详情
        getDetail: async (musicId) => {
            return await apiRequest(`/music/${musicId}`);
        },
        
        // 上传音乐
        upload: async (musicData, token) => {
            return await apiRequest('/music', 'POST', musicData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 更新音乐信息
        update: async (musicId, musicData, token) => {
            return await apiRequest(`/music/${musicId}`, 'PUT', musicData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 删除音乐
        delete: async (musicId, token) => {
            return await apiRequest(`/music/${musicId}`, 'DELETE', null, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 喜欢音乐
        like: async (musicId, token) => {
            return await apiRequest(`/music/${musicId}/like`, 'POST', null, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 取消喜欢音乐
        unlike: async (musicId, token) => {
            return await apiRequest(`/music/${musicId}/like`, 'DELETE', null, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 获取音乐评论
        getComments: async (musicId, params = {}) => {
            const queryParams = new URLSearchParams(params).toString();
            return await apiRequest(`/music/${musicId}/comments?${queryParams}`);
        },
        
        // 添加评论
        addComment: async (musicId, commentData, token) => {
            return await apiRequest(`/music/${musicId}/comments`, 'POST', commentData, {
                'Authorization': `Bearer ${token}`
            });
        }
    },
    
    // 协作房间相关API
    collaboration: {
        // 获取房间列表
        getRooms: async (params = {}) => {
            const queryParams = new URLSearchParams(params).toString();
            return await apiRequest(`/collaboration/rooms?${queryParams}`);
        },
        
        // 获取房间详情
        getRoomDetail: async (roomId) => {
            return await apiRequest(`/collaboration/rooms/${roomId}`);
        },
        
        // 创建房间
        createRoom: async (roomData, token) => {
            return await apiRequest('/collaboration/rooms', 'POST', roomData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 加入房间
        joinRoom: async (roomId, token) => {
            return await apiRequest(`/collaboration/rooms/${roomId}/join`, 'POST', null, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 离开房间
        leaveRoom: async (roomId, token) => {
            return await apiRequest(`/collaboration/rooms/${roomId}/leave`, 'POST', null, {
                'Authorization': `Bearer ${token}`
            });
        }
    },
    
    // 知识库相关API
    knowledge: {
        // 获取知识条目列表
        getArticles: async (params = {}) => {
            const queryParams = new URLSearchParams(params).toString();
            return await apiRequest(`/knowledge/articles?${queryParams}`);
        },
        
        // 获取知识条目详情
        getArticleDetail: async (articleId) => {
            return await apiRequest(`/knowledge/articles/${articleId}`);
        },
        
        // 创建知识条目
        createArticle: async (articleData, token) => {
            return await apiRequest('/knowledge/articles', 'POST', articleData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 更新知识条目
        updateArticle: async (articleId, articleData, token) => {
            return await apiRequest(`/knowledge/articles/${articleId}`, 'PUT', articleData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 获取知识条目历史版本
        getArticleHistory: async (articleId) => {
            return await apiRequest(`/knowledge/articles/${articleId}/history`);
        }
    },
    
    // 商城相关API
    marketplace: {
        // 获取产品列表
        getProducts: async (params = {}) => {
            const queryParams = new URLSearchParams(params).toString();
            return await apiRequest(`/marketplace/products?${queryParams}`);
        },
        
        // 获取产品详情
        getProductDetail: async (productId) => {
            return await apiRequest(`/marketplace/products/${productId}`);
        },
        
        // 创建产品
        createProduct: async (productData, token) => {
            return await apiRequest('/marketplace/products', 'POST', productData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 更新产品信息
        updateProduct: async (productId, productData, token) => {
            return await apiRequest(`/marketplace/products/${productId}`, 'PUT', productData, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 删除产品
        deleteProduct: async (productId, token) => {
            return await apiRequest(`/marketplace/products/${productId}`, 'DELETE', null, {
                'Authorization': `Bearer ${token}`
            });
        },
        
        // 购买产品
        purchaseProduct: async (productId, token) => {
            return await apiRequest(`/marketplace/products/${productId}/purchase`, 'POST', null, {
                'Authorization': `Bearer ${token}`
            });
        }
    }
};

// 导出API对象
window.api = api; 
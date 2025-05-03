/**
 * SoundSphere - API 工具
 * 用于与后端API通信的工具函数
 */

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

// 通用API请求函数
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // 包含cookies
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        // 检查HTTP状态码
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `请求失败 (${response.status})`);
        }
        
        // 解析响应数据
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 音乐相关API
const MusicAPI = {
    // 获取音乐列表
    getMusicList: async (page = 1, filter = 'all') => {
        return apiRequest(`/music?page=${page}&filter=${filter}`);
    },
    
    // 获取单个音乐详情
    getMusicDetails: async (musicId) => {
        return apiRequest(`/music/${musicId}`);
    },
    
    // 搜索音乐
    searchMusic: async (query) => {
        return apiRequest(`/music/search?q=${encodeURIComponent(query)}`);
    }
};

// 创作室相关API
const CollaborationAPI = {
    // 获取创作室列表
    getRoomList: async (filter = 'all') => {
        return apiRequest(`/rooms?filter=${filter}`);
    },
    
    // 创建新创作室
    createRoom: async (roomData) => {
        return apiRequest('/rooms', 'POST', roomData);
    },
    
    // 加入创作室
    joinRoom: async (roomId) => {
        return apiRequest(`/rooms/${roomId}/join`, 'POST');
    }
};

// 知识库相关API
const KnowledgeAPI = {
    // 获取文章列表
    getArticles: async (page = 1, filter = 'trending') => {
        return apiRequest(`/articles?page=${page}&filter=${filter}`);
    },
    
    // 获取教程列表
    getTutorials: async (page = 1) => {
        return apiRequest(`/tutorials?page=${page}`);
    },
    
    // 获取知识分类
    getCategories: async () => {
        return apiRequest('/knowledge/categories');
    }
};

// 市场相关API
const MarketplaceAPI = {
    // 获取商品列表
    getProducts: async (page = 1, category = 'all', filter = 'trending') => {
        return apiRequest(`/marketplace/products?page=${page}&category=${category}&filter=${filter}`);
    },
    
    // 获取免费资源
    getFreeResources: async () => {
        return apiRequest('/marketplace/free');
    },
    
    // 加入购物车
    addToCart: async (productId, quantity = 1) => {
        return apiRequest('/marketplace/cart', 'POST', { productId, quantity });
    }
};

// 用户相关API
const UserAPI = {
    // 用户登录
    login: async (email, password) => {
        return apiRequest('/auth/login', 'POST', { email, password });
    },
    
    // 用户注册
    register: async (userData) => {
        return apiRequest('/auth/register', 'POST', userData);
    },
    
    // 获取当前用户信息
    getCurrentUser: async () => {
        return apiRequest('/auth/me');
    },
    
    // 用户退出登录
    logout: async () => {
        return apiRequest('/auth/logout', 'POST');
    }
};

// 导出API模块
window.SoundSphereAPI = {
    Music: MusicAPI,
    Collaboration: CollaborationAPI,
    Knowledge: KnowledgeAPI,
    Marketplace: MarketplaceAPI,
    User: UserAPI
}; 
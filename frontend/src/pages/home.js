// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化模态框
    initModals();
    
    // 初始化音乐列表
    initMusicGrid();
    
    // 初始化产品列表
    initProductsGrid();
    
    // 初始化事件监听
    initEventListeners();
});

// 初始化模态框
function initModals() {
    // 登录模态框
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const showSignupLink = document.getElementById('show-signup');
    
    // 注册模态框
    const signupModal = document.getElementById('signup-modal');
    const signupBtn = document.getElementById('signup-btn');
    const showLoginLink = document.getElementById('show-login');
    const ctaSignupBtn = document.getElementById('cta-signup-btn');
    
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
    
    // CTA 注册按钮
    if (ctaSignupBtn) {
        ctaSignupBtn.addEventListener('click', () => {
            openModal(signupModal);
        });
    }
    
    // 切换到注册模态框
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            setTimeout(() => {
                openModal(signupModal);
            }, 300);
        });
    }
    
    // 切换到登录模态框
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(signupModal);
            setTimeout(() => {
                openModal(loginModal);
            }, 300);
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

// 初始化音乐列表
function initMusicGrid() {
    const musicGrid = document.getElementById('music-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!musicGrid) return;
    
    // 模拟音乐数据
    const musicData = [
        {
            id: 1,
            title: '电子舞曲示例',
            artist: '音乐制作人A',
            cover: '../src/assets/music-covers/1.jpg',
            type: 'tracks',
            plays: 1245,
            likes: 87,
            comments: 32
        },
        {
            id: 2,
            title: '流行风格伴奏',
            artist: '制作人B',
            cover: '../src/assets/music-covers/2.jpg',
            type: 'beats',
            plays: 876,
            likes: 54,
            comments: 18
        },
        {
            id: 3,
            title: '鼓组采样包',
            artist: '采样大师C',
            cover: '../src/assets/music-covers/3.jpg',
            type: 'samples',
            plays: 2456,
            likes: 132,
            comments: 45
        },
        {
            id: 4,
            title: '音乐制作技巧播客',
            artist: '播客主D',
            cover: '../src/assets/music-covers/4.jpg',
            type: 'podcasts',
            plays: 567,
            likes: 42,
            comments: 23
        },
        {
            id: 5,
            title: '摇滚乐章节',
            artist: '乐队E',
            cover: '../src/assets/music-covers/5.jpg',
            type: 'tracks',
            plays: 987,
            likes: 76,
            comments: 29
        },
        {
            id: 6,
            title: '嘻哈节拍示例',
            artist: '制作人F',
            cover: '../src/assets/music-covers/6.jpg',
            type: 'beats',
            plays: 1543,
            likes: 97,
            comments: 41
        }
    ];
    
    // 渲染音乐列表
    renderMusicGrid(musicData);
    
    // 过滤按钮点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前按钮添加active类
            button.classList.add('active');
            
            const filterType = button.getAttribute('data-filter');
            let filteredData = musicData;
            
            // 如果不是"全部"，则过滤数据
            if (filterType !== 'all') {
                filteredData = musicData.filter(item => item.type === filterType);
            }
            
            // 重新渲染列表
            renderMusicGrid(filteredData);
        });
    });
}

// 渲染音乐列表
function renderMusicGrid(data) {
    const musicGrid = document.getElementById('music-grid');
    if (!musicGrid) return;
    
    // 清空列表
    musicGrid.innerHTML = '';
    
    // 如果没有数据，显示提示信息
    if (data.length === 0) {
        musicGrid.innerHTML = '<p class="text-center">没有找到相关内容</p>';
        return;
    }
    
    // 渲染每个音乐卡片
    data.forEach(item => {
        const musicCard = document.createElement('div');
        musicCard.className = 'music-card';
        
        musicCard.innerHTML = `
            <div class="music-cover">
                <img src="${item.cover || '../src/assets/music-covers/default.jpg'}" alt="${item.title}">
                <div class="music-play-btn" data-id="${item.id}"></div>
            </div>
            <div class="music-info">
                <h3 title="${item.title}">${item.title}</h3>
                <p>${item.artist}</p>
                <div class="music-stats">
                    <div class="music-stat">
                        <span>${item.plays}</span> 播放
                    </div>
                    <div class="music-stat">
                        <span>${item.likes}</span> 喜欢
                    </div>
                </div>
            </div>
        `;
        
        // 播放按钮点击事件
        const playBtn = musicCard.querySelector('.music-play-btn');
        playBtn.addEventListener('click', () => {
            playMusic(item.id);
        });
        
        musicGrid.appendChild(musicCard);
    });
}

// 播放音乐（模拟）
function playMusic(id) {
    console.log(`播放音乐ID: ${id}`);
    // 实际项目中，这里会调用 Web Audio API 播放音乐
    alert(`正在播放音乐（ID: ${id}）- 实际项目中会使用 Web Audio API`);
}

// 初始化产品列表
function initProductsGrid() {
    const productsGrid = document.getElementById('products-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    if (!productsGrid) return;
    
    // 模拟产品数据
    const productsData = [
        {
            id: 1,
            title: '电子音乐制作完整课程',
            creator: '导师A',
            image: '../src/assets/products/1.jpg',
            price: '¥99',
            category: 'tutorials',
            rating: 4.8,
            sales: 356
        },
        {
            id: 2,
            title: '未来贝斯采样包',
            creator: '制作人B',
            image: '../src/assets/products/2.jpg',
            price: '¥49',
            category: 'samples',
            rating: 4.5,
            sales: 128
        },
        {
            id: 3,
            title: '流行歌曲伴奏套装',
            creator: '制作人C',
            image: '../src/assets/products/3.jpg',
            price: '¥79',
            category: 'beats',
            rating: 4.7,
            sales: 215
        },
        {
            id: 4,
            title: 'Massive X 合成器预设包',
            creator: '声音设计师D',
            image: '../src/assets/products/4.jpg',
            price: '¥59',
            category: 'presets',
            rating: 4.6,
            sales: 178
        },
        {
            id: 5,
            title: '弦乐采样工具包',
            creator: '管弦乐团E',
            image: '../src/assets/products/5.jpg',
            price: '¥129',
            category: 'samples',
            rating: 4.9,
            sales: 87
        },
        {
            id: 6,
            title: '混音与母带处理专业教程',
            creator: '混音工程师F',
            image: '../src/assets/products/6.jpg',
            price: '¥149',
            category: 'tutorials',
            rating: 4.8,
            sales: 246
        }
    ];
    
    // 渲染产品列表
    renderProductsGrid(productsData);
    
    // 分类按钮点击事件
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前按钮添加active类
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            let filteredData = productsData;
            
            // 如果不是"全部"，则过滤数据
            if (category !== 'all') {
                filteredData = productsData.filter(item => item.category === category);
            }
            
            // 重新渲染列表
            renderProductsGrid(filteredData);
        });
    });
}

// 渲染产品列表
function renderProductsGrid(data) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // 清空列表
    productsGrid.innerHTML = '';
    
    // 如果没有数据，显示提示信息
    if (data.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">没有找到相关产品</p>';
        return;
    }
    
    // 渲染每个产品卡片
    data.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${item.image || '../src/assets/products/default.jpg'}" alt="${item.title}">
                <div class="product-price">${item.price}</div>
            </div>
            <div class="product-info">
                <h3 title="${item.title}">${item.title}</h3>
                <p>${item.creator}</p>
                <div class="product-meta">
                    <div class="product-rating">${item.rating}</div>
                    <div>${item.sales} 销量</div>
                </div>
            </div>
        `;
        
        // 产品卡片点击事件
        productCard.addEventListener('click', () => {
            viewProduct(item.id);
        });
        
        productsGrid.appendChild(productCard);
    });
}

// 查看产品（模拟）
function viewProduct(id) {
    console.log(`查看产品ID: ${id}`);
    // 实际项目中，这里会跳转到产品详情页
    alert(`正在查看产品（ID: ${id}）- 实际项目中会跳转到详情页`);
}

// 初始化其他事件监听
function initEventListeners() {
    // 导航链接平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 探索社区按钮
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const browseSection = document.getElementById('browse');
            if (browseSection) {
                window.scrollTo({
                    top: browseSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // 开始创作按钮
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            const collaborateSection = document.getElementById('collaborate');
            if (collaborateSection) {
                window.scrollTo({
                    top: collaborateSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // 尝试协作按钮
    const tryCollaborationBtn = document.getElementById('try-collaboration-btn');
    if (tryCollaborationBtn) {
        tryCollaborationBtn.addEventListener('click', () => {
            // 实际项目中，这里会检查用户是否登录
            alert('需要登录才能创建或加入协作房间 - 实际项目中会根据登录状态跳转');
        });
    }
    
    // 加载更多按钮
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreMusic();
        });
    }
}

// 加载更多音乐（模拟）
function loadMoreMusic() {
    console.log('加载更多音乐');
    // 实际项目中，这里会从服务器加载更多数据
    alert('加载更多音乐 - 实际项目中会从服务器获取更多数据');
} 
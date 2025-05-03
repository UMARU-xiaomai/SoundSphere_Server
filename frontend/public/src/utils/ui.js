/**
 * SoundSphere - UI 交互脚本
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 模态框相关
    initModals();
    
    // 处理导航高亮
    highlightCurrentPage();
    
    // 初始化各页面特定功能
    initPageSpecificFeatures();
});

/**
 * 初始化模态框功能
 */
function initModals() {
    // 登录按钮
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    
    // 注册按钮
    const signupBtn = document.getElementById('signup-btn');
    const signupModal = document.getElementById('signup-modal');
    
    // 模态框内的切换链接
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    
    // 关闭按钮
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // 登录按钮点击事件
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
        });
    }
    
    // 注册按钮点击事件
    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', function() {
            signupModal.classList.add('active');
        });
    }
    
    // 模态框内部切换链接事件
    if (showSignupLink && signupModal && loginModal) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });
    }
    
    if (showLoginLink && loginModal && signupModal) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    // 关闭按钮事件
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // 点击模态框背景关闭
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // 阻止表单提交刷新页面
    document.querySelectorAll('form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 可以在这里添加表单验证和提交逻辑
            console.log('表单提交:', this.id);
        });
    });
}

/**
 * 高亮当前页面的导航菜单
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 初始化页面特定功能
 */
function initPageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // 根据当前页面分配不同初始化函数
    switch (currentPage) {
        case '':
        case 'index.html':
            initHomePage();
            break;
        case 'music.html':
            initMusicPage();
            break;
        case 'collaboration.html':
            initCollaborationPage();
            break;
        case 'knowledge.html':
            initKnowledgePage();
            break;
        case 'marketplace.html':
            initMarketplacePage();
            break;
    }
}

/**
 * 初始化首页功能
 */
function initHomePage() {
    console.log('首页功能初始化');
    // 可以在这里添加首页特定的功能
}

/**
 * 初始化音乐页面功能
 */
function initMusicPage() {
    console.log('音乐页面功能初始化');
    
    // 过滤按钮功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // 移除所有按钮的active类
                filterButtons.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active类
                this.classList.add('active');
                
                // 获取过滤类别
                const filter = this.getAttribute('data-filter');
                console.log('过滤类别:', filter);
                
                // 这里可以添加实际的过滤逻辑
            });
        });
    }
    
    // 播放按钮功能
    const playButtons = document.querySelectorAll('.play-btn');
    if (playButtons.length > 0) {
        playButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const musicCard = this.closest('.music-card');
                const title = musicCard.querySelector('h3').textContent;
                console.log('播放音乐:', title);
                
                // 这里可以添加实际的音频播放逻辑
            });
        });
    }
}

/**
 * 初始化创作室页面功能
 */
function initCollaborationPage() {
    console.log('创作室页面功能初始化');
    
    // 创作室筛选功能
    const roomFilter = document.getElementById('room-filter');
    if (roomFilter) {
        roomFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            console.log('选择创作室分类:', selectedCategory);
            
            // 这里可以添加实际的筛选逻辑
        });
    }
    
    // 轮播功能
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (prevBtn && nextBtn && dots.length > 0) {
        let currentSlide = 0;
        
        // 下一张幻灯片
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % dots.length;
            updateSlider();
        });
        
        // 上一张幻灯片
        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + dots.length) % dots.length;
            updateSlider();
        });
        
        // 点击圆点切换幻灯片
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                currentSlide = index;
                updateSlider();
            });
        });
        
        // 更新轮播状态
        function updateSlider() {
            // 更新圆点状态
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // 滚动到当前幻灯片
            const slider = document.querySelector('.testimonial-slider');
            const cards = document.querySelectorAll('.testimonial-card');
            if (slider && cards.length > 0) {
                const cardWidth = cards[0].offsetWidth;
                slider.scrollTo({
                    left: cardWidth * currentSlide,
                    behavior: 'smooth'
                });
            }
        }
    }
}

/**
 * 初始化知识库页面功能
 */
function initKnowledgePage() {
    console.log('知识库页面功能初始化');
    
    // 文章筛选功能
    const articleFilter = document.getElementById('article-filter');
    if (articleFilter) {
        articleFilter.addEventListener('change', function() {
            const selectedFilter = this.value;
            console.log('选择文章筛选:', selectedFilter);
            
            // 这里可以添加实际的筛选逻辑
        });
    }
    
    // 教程播放按钮功能
    const playButtons = document.querySelectorAll('.tutorial-video .play-button');
    if (playButtons.length > 0) {
        playButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const tutorialCard = this.closest('.tutorial-card');
                const title = tutorialCard.querySelector('h3').textContent;
                console.log('播放教程:', title);
                
                // 这里可以添加实际的视频播放逻辑
            });
        });
    }
}

/**
 * 初始化市场页面功能
 */
function initMarketplacePage() {
    console.log('市场页面功能初始化');
    
    // 分类切换功能
    const categoryItems = document.querySelectorAll('.category-item');
    if (categoryItems.length > 0) {
        categoryItems.forEach(function(item) {
            item.addEventListener('click', function() {
                // 移除所有item的active类
                categoryItems.forEach(i => i.classList.remove('active'));
                // 添加当前item的active类
                this.classList.add('active');
                
                // 获取分类名称
                const categoryName = this.querySelector('h3').textContent;
                console.log('选择分类:', categoryName);
                
                // 这里可以添加实际的分类切换逻辑
            });
        });
    }
    
    // 商品筛选功能
    const productFilter = document.getElementById('product-filter');
    if (productFilter) {
        productFilter.addEventListener('change', function() {
            const selectedFilter = this.value;
            console.log('选择商品筛选:', selectedFilter);
            
            // 这里可以添加实际的筛选逻辑
        });
    }
    
    // 商品预览功能
    const previewButtons = document.querySelectorAll('.preview-btn');
    if (previewButtons.length > 0) {
        previewButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();  // 阻止事件冒泡
                
                const productCard = this.closest('.product-card');
                const title = productCard.querySelector('h3').textContent;
                console.log('预览商品:', title);
                
                // 这里可以添加实际的预览逻辑
            });
        });
    }
    
    // 收藏功能
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    if (wishlistButtons.length > 0) {
        wishlistButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();  // 阻止事件冒泡
                
                const productCard = this.closest('.product-card');
                const title = productCard.querySelector('h3').textContent;
                console.log('收藏商品:', title);
                
                // 这里可以添加实际的收藏逻辑
            });
        });
    }
} 
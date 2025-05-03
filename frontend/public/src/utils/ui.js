/**
 * SoundSphere - UI 交互脚本
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化组件
    initMobileMenu();
    initThemeToggle();
    initModals();
    initScrollEffects();
    initAccessibilitySupport();
    attachEventListeners();
    
    // 处理导航高亮
    highlightCurrentPage();
    
    // 初始化各页面特定功能
    initPageSpecificFeatures();
});

/**
 * 初始化移动导航菜单
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // 防止菜单打开时页面滚动
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // 确保在窗口调整大小时正确处理菜单状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
}

/**
 * 初始化主题切换功能
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    // 从本地存储中检查用户偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.body.classList.remove('auto-dark-mode');
    }
    
    // 如果用户已设置深色模式，更新按钮状态
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.classList.add('active');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.remove('auto-dark-mode');
        themeToggle.classList.toggle('active');
        
        // 保存用户偏好
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
}

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

/**
 * 初始化滚动效果
 */
function initScrollEffects() {
    // 在滚动时为header添加阴影
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 检查初始滚动位置
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    }
    
    // 滚动到顶部按钮
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * 初始化辅助功能支持
 */
function initAccessibilitySupport() {
    // 图片加载错误处理
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.alt = '图片加载失败';
            this.style.background = '#f1f1f1';
            this.style.padding = '10px';
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
        });
    });
    
    // 为所有表单元素添加标签关联
    document.querySelectorAll('input, select, textarea').forEach(input => {
        if (!input.id || !document.querySelector(`label[for="${input.id}"]`)) {
            console.warn('Form element missing label or ID', input);
        }
    });
    
    // 检测高对比度模式
    if (window.matchMedia('(forced-colors: active)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // 支持减少动画
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

/**
 * 添加事件监听器
 */
function attachEventListeners() {
    // 添加所有按钮加载状态的支持
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function(e) {
            // 仅在表单有效时添加加载状态
            const form = button.closest('form');
            if (form && form.checkValidity()) {
                button.classList.add('loading');
                // 防止重复点击
                button.disabled = true;
            }
        });
    });
    
    // 添加外部链接处理
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // 检查链接是否指向外部
        if (!link.hostname.includes(window.location.hostname)) {
            // 为外部链接添加图标和属性
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // 如果链接没有标题，添加一个
            if (!link.hasAttribute('title')) {
                link.setAttribute('title', '在新窗口打开外部链接');
            }
            
            // 可选：添加外部链接图标
            if (!link.querySelector('.external-link-icon')) {
                const icon = document.createElement('span');
                icon.classList.add('external-link-icon');
                icon.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
                link.appendChild(icon);
            }
        }
    });
}

/**
 * 显示通知
 * @param {string} message 通知信息
 * @param {string} type 通知类型 ('success', 'error', 'info', 'warning')
 * @param {number} duration 显示持续时间（毫秒）
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 为不同类型添加图标
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
            break;
        case 'error':
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            break;
        case 'warning':
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
            break;
        default:
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <div class="notification-message">${message}</div>
        <button class="notification-close" aria-label="关闭">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // 添加动画类
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 设置自动关闭
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, duration);
    
    // 点击关闭按钮
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
    
    return notification;
}

/**
 * 关闭通知
 * @param {HTMLElement} notification 通知元素
 */
function closeNotification(notification) {
    notification.classList.remove('show');
    
    // 等待动画完成后移除元素
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 导出公共API
window.SoundSphereUI = {
    showNotification,
    openModal,
    closeModal,
    closeAllModals
}; 
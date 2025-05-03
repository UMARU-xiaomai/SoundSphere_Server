/**
 * SoundSphere 知识博客页面脚本
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化全局变量
    const state = {
        currentTab: 'all-posts',
        isLoggedIn: false,
        currentUser: null,
        posts: [],
        filteredPosts: [],
        currentCategory: 'all',
        currentPage: 1,
        postsPerPage: 10,
        currentPostId: null
    };

    // DOM元素缓存
    const elements = {
        // 导航标签
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabSections: document.querySelectorAll('.blog-posts'),
        categoryTabs: document.querySelectorAll('.category-tab'),
        
        // 博客列表与过滤
        postList: document.getElementById('featured-posts'),
        tagSelect: document.getElementById('tag-select'),
        sortSelect: document.getElementById('sort-select'),
        loadMoreBtn: document.getElementById('load-more-posts'),
        
        // 博客编辑器
        newPostBtn: document.getElementById('new-post-btn'),
        blogEditor: document.getElementById('blog-editor'),
        blogForm: document.getElementById('blog-form'),
        postTitle: document.getElementById('post-title'),
        postCategory: document.getElementById('post-category'),
        postTags: document.getElementById('post-tags'),
        postCover: document.getElementById('post-cover'),
        coverPreview: document.querySelector('.cover-preview'),
        coverPreviewImg: document.getElementById('cover-preview-img'),
        postContent: document.getElementById('post-content'),
        contentPreview: document.getElementById('content-preview'),
        previewBtn: document.getElementById('preview-btn'),
        saveDraftBtn: document.getElementById('save-draft'),
        publishPostBtn: document.getElementById('publish-post'),
        cancelEditBtn: document.getElementById('cancel-edit'),
        toolbarButtons: document.querySelectorAll('.toolbar-btn'),
        
        // 详情模态框
        postDetailModal: document.getElementById('post-detail-modal'),
        modalPostTitle: document.getElementById('modal-post-title'),
        modalAuthorAvatar: document.getElementById('modal-author-avatar'),
        modalAuthorName: document.getElementById('modal-author-name'),
        modalPostDate: document.getElementById('modal-post-date'),
        modalPostContent: document.getElementById('modal-post-content'),
        modalPostTags: document.getElementById('modal-post-tags'),
        modalPostViews: document.getElementById('modal-post-views'),
        modalPostLikes: document.getElementById('modal-post-likes'),
        modalPostComments: document.getElementById('modal-post-comments'),
        modalCommentsList: document.getElementById('modal-comments-list'),
        modalCommentContent: document.getElementById('modal-comment-content'),
        modalSubmitComment: document.getElementById('modal-submit-comment'),
        
        // 用户相关
        userAvatar: document.getElementById('user-avatar'),
        userName: document.getElementById('user-name'),
        userBio: document.getElementById('user-bio'),
        profileStats: document.getElementById('profile-stats'),
        sidebarLoginPrompt: document.getElementById('sidebar-login-prompt'),
        postsCount: document.getElementById('posts-count'),
        followersCount: document.getElementById('followers-count'),
        followingCount: document.getElementById('following-count'),
        
        // 评论系统
        commentsSection: document.getElementById('comments-section'),
        commentsList: document.getElementById('comments-list'),
        commentContent: document.getElementById('comment-content'),
        submitComment: document.getElementById('submit-comment'),
        
        // 登录/注册模态框
        loginModal: document.getElementById('login-modal'),
        signupModal: document.getElementById('signup-modal'),
        loginBtn: document.getElementById('login-btn'),
        signupBtn: document.getElementById('signup-btn'),
        sidebarLoginBtn: document.getElementById('sidebar-login-btn'),
        loginForm: document.getElementById('login-form'),
        signupForm: document.getElementById('signup-form'),
        
        // 博客统计
        totalPosts: document.getElementById('total-posts'),
        totalComments: document.getElementById('total-comments'),
        totalViews: document.getElementById('total-views'),
        todayPosts: document.getElementById('today-posts'),
        
        // 博客日历
        blogCalendar: document.getElementById('blog-calendar')
    };

    // 初始化函数
    function init() {
        bindEvents();
        checkAuthStatus();
        loadFeaturedPosts();
        initCalendar();
        updateBlogStats();
    }

    // 事件绑定
    function bindEvents() {
        // 标签页切换
        elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = btn.dataset.tab;
                switchTab(tabId);
            });
        });
        
        // 分类标签切换
        elements.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const category = tab.textContent.toLowerCase();
                switchCategory(category);
            });
        });
        
        // 过滤和排序
        elements.tagSelect.addEventListener('change', filterPosts);
        elements.sortSelect.addEventListener('change', sortPosts);
        
        // 加载更多
        elements.loadMoreBtn.addEventListener('click', loadMorePosts);
        
        // 博客编辑器
        elements.newPostBtn.addEventListener('click', showEditor);
        elements.cancelEditBtn.addEventListener('click', hideEditor);
        elements.postCover.addEventListener('change', handleCoverPreview);
        elements.previewBtn.addEventListener('click', toggleContentPreview);
        elements.saveDraftBtn.addEventListener('click', saveDraft);
        elements.blogForm.addEventListener('submit', publishPost);
        
        // 编辑器工具栏
        elements.toolbarButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id !== 'preview-btn') {
                    const format = btn.dataset.format;
                    window.SoundSphere.markdown.applyFormat(elements.postContent, format);
                }
            });
        });
        
        // 登录/注册
        elements.loginBtn.addEventListener('click', showLoginModal);
        elements.signupBtn.addEventListener('click', showSignupModal);
        elements.sidebarLoginBtn.addEventListener('click', showLoginModal);
        elements.loginForm.addEventListener('submit', handleLogin);
        elements.signupForm.addEventListener('submit', handleSignup);
    }

    // 标签页切换
    function switchTab(tabId) {
        state.currentTab = tabId;
        
        // 更新按钮激活状态
        elements.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // 更新内容区域显示
        elements.tabSections.forEach(section => {
            section.classList.toggle('active', section.id === `${tabId}-section`);
        });
        
        // 如果切换到"我的博客"标签，但未登录，显示登录提示
        if (tabId === 'my-posts' && !state.isLoggedIn) {
            document.getElementById('login-required').classList.remove('hidden');
            document.getElementById('my-posts').classList.add('hidden');
        } else if (tabId === 'my-posts' && state.isLoggedIn) {
            document.getElementById('login-required').classList.add('hidden');
            document.getElementById('my-posts').classList.remove('hidden');
            loadMyPosts();
        }
        
        // 收藏和关注的文章处理类似
        if (tabId === 'bookmarks' && !state.isLoggedIn) {
            document.getElementById('bookmarks-login-required').classList.remove('hidden');
            document.getElementById('bookmarked-posts').classList.add('hidden');
        } else if (tabId === 'bookmarks' && state.isLoggedIn) {
            document.getElementById('bookmarks-login-required').classList.add('hidden');
            document.getElementById('bookmarked-posts').classList.remove('hidden');
            loadBookmarkedPosts();
        }
        
        if (tabId === 'following' && !state.isLoggedIn) {
            document.getElementById('following-login-required').classList.remove('hidden');
            document.getElementById('followed-authors').classList.add('hidden');
            document.getElementById('followed-posts').classList.add('hidden');
        } else if (tabId === 'following' && state.isLoggedIn) {
            document.getElementById('following-login-required').classList.add('hidden');
            document.getElementById('followed-authors').classList.remove('hidden');
            document.getElementById('followed-posts').classList.remove('hidden');
            loadFollowedContent();
        }
    }

    // 分类切换
    function switchCategory(category) {
        state.currentCategory = category;
        
        // 更新分类标签激活状态
        elements.categoryTabs.forEach(tab => {
            const tabCategory = tab.textContent.toLowerCase();
            tab.classList.toggle('active', tabCategory === category);
        });
        
        // 根据分类过滤文章
        filterPostsByCategory(category);
    }

    // 根据分类过滤文章
    function filterPostsByCategory(category) {
        if (category === 'all' || category === '全部') {
            state.filteredPosts = [...state.posts];
        } else {
            state.filteredPosts = state.posts.filter(post => 
                post.category.toLowerCase() === category
            );
        }
        
        // 重新渲染文章列表
        renderPosts(state.filteredPosts);
    }

    // 按标签过滤文章
    function filterPosts() {
        const selectedTag = elements.tagSelect.value;
        
        if (!selectedTag) {
            // 如果没有选择标签，显示当前分类下的所有文章
            filterPostsByCategory(state.currentCategory);
            return;
        }
        
        // 先按分类过滤
        let filtered = state.currentCategory === 'all' ? 
            [...state.posts] : 
            state.posts.filter(post => post.category.toLowerCase() === state.currentCategory);
        
        // 再按标签过滤
        filtered = filtered.filter(post => 
            post.tags.includes(selectedTag)
        );
        
        state.filteredPosts = filtered;
        renderPosts(filtered);
    }

    // 排序文章
    function sortPosts() {
        const sortOption = elements.sortSelect.value;
        
        // 克隆当前过滤后的文章列表
        const postsToSort = [...state.filteredPosts];
        
        switch(sortOption) {
            case 'newest':
                postsToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'hottest':
                postsToSort.sort((a, b) => b.views - a.views);
                break;
            case 'most-viewed':
                postsToSort.sort((a, b) => b.views - a.views);
                break;
            case 'most-liked':
                postsToSort.sort((a, b) => b.likes - a.likes);
                break;
        }
        
        state.filteredPosts = postsToSort;
        renderPosts(postsToSort);
    }

    // 加载精选文章
    function loadFeaturedPosts() {
        // 这里应该从API获取数据，现在使用模拟数据
        const mockPosts = getMockPosts();
        state.posts = mockPosts;
        state.filteredPosts = [...mockPosts];
        
        renderPosts(mockPosts);
    }

    // 获取模拟文章数据
    function getMockPosts() {
        return [
            {
                id: 1,
                title: '和声学基础：如何构建吸引人的和弦进行',
                author: {
                    id: 101,
                    name: '李教授',
                    avatar: '/src/assets/placeholder-avatar.jpg'
                },
                date: '2023-06-15',
                category: '音乐理论',
                excerpt: '本文将介绍和声学的基本概念，以及如何创建引人入胜的和弦进行，增强你的作曲能力...',
                content: '# 和声学基础\n\n和声学是音乐理论中研究和弦结构和和弦进行的一个重要分支...',
                cover: '/src/assets/placeholder-article.jpg',
                tags: ['和声学', '作曲', '音乐理论'],
                views: 3200,
                likes: 156,
                comments: 48
            },
            {
                id: 2,
                title: '混音中的均衡器（EQ）使用技巧详解',
                author: {
                    id: 102,
                    name: '张工程师',
                    avatar: '/src/assets/placeholder-avatar.jpg'
                },
                date: '2023-06-10',
                category: '混音技巧',
                excerpt: '均衡器是混音过程中最重要的工具之一，本文将深入讲解EQ的使用方法和实用技巧...',
                content: '# 混音中的均衡器使用\n\nEQ（均衡器）是混音工程师最重要的工具之一...',
                cover: '/src/assets/placeholder-article.jpg',
                tags: ['混音', '均衡器', '音频处理'],
                views: 5700,
                likes: 215,
                comments: 92
            },
            {
                id: 3,
                title: 'FL Studio 完全入门指南',
                author: {
                    id: 103,
                    name: '王老师',
                    avatar: '/src/assets/placeholder-avatar.jpg'
                },
                date: '2023-06-05',
                category: '软件教程',
                excerpt: '这篇指南将帮助初学者快速掌握FL Studio的基本操作，从界面介绍到简单编曲全面覆盖...',
                content: '# FL Studio 入门指南\n\nFL Studio是目前流行的数字音频工作站（DAW）之一...',
                cover: '/src/assets/placeholder-article.jpg',
                tags: ['FL Studio', 'DAW', '软件教程'],
                views: 8300,
                likes: 342,
                comments: 127
            }
        ];
    }

    // 渲染文章列表
    function renderPosts(posts) {
        if (!elements.postList) return;
        
        // 清空现有内容
        elements.postList.innerHTML = '';
        
        if (posts.length === 0) {
            elements.postList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>没有找到相关文章</h3>
                    <p>尝试更改筛选条件或发表一篇新文章</p>
                </div>
            `;
            return;
        }
        
        // 渲染文章
        posts.forEach(post => {
            const postElement = createPostElement(post);
            elements.postList.appendChild(postElement);
        });
    }

    // 创建文章元素
    function createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.setAttribute('data-post-id', post.id);
        
        article.innerHTML = `
            <div class="post-image">
                <img src="${post.cover}" alt="${post.title}">
                <div class="post-category">${post.category}</div>
            </div>
            <div class="post-content">
                <h3><a href="#" class="post-title">${post.title}</a></h3>
                <div class="post-meta">
                    <div class="author">
                        <img src="${post.author.avatar}" alt="${post.author.name}">
                        <span>${post.author.name}</span>
                    </div>
                    <span class="post-date">${post.date}</span>
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="post-stats">
                    <span class="views"><i class="views-icon"></i> ${formatNumber(post.views)}</span>
                    <span class="likes"><i class="likes-icon"></i> ${formatNumber(post.likes)}</span>
                    <span class="comments"><i class="comments-icon"></i> ${formatNumber(post.comments)}</span>
                </div>
            </div>
        `;
        
        // 添加点击事件，打开文章详情
        article.querySelector('.post-title').addEventListener('click', (e) => {
            e.preventDefault();
            openPostDetail(post.id);
        });
        
        return article;
    }

    // 显示博客编辑器
    function showEditor() {
        // 检查用户是否登录
        if (!state.isLoggedIn) {
            showLoginModal();
            return;
        }
        
        // 隐藏文章列表，显示编辑器
        document.querySelector('.blog-posts.active').classList.add('hidden');
        elements.blogEditor.classList.remove('hidden');
        
        // 重置表单
        elements.blogForm.reset();
        elements.coverPreview.classList.add('hidden');
        elements.contentPreview.classList.add('hidden');
        elements.postContent.classList.remove('hidden');
    }

    // 隐藏博客编辑器
    function hideEditor() {
        elements.blogEditor.classList.add('hidden');
        document.querySelector('.blog-posts.active').classList.remove('hidden');
    }

    // 处理封面图片预览
    function handleCoverPreview(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            elements.coverPreviewImg.src = event.target.result;
            elements.coverPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    // 切换内容预览
    function toggleContentPreview() {
        const content = elements.postContent.value;
        
        if (elements.contentPreview.classList.contains('hidden')) {
            // 显示预览
            if (content) {
                elements.contentPreview.innerHTML = window.SoundSphere.markdown.parse(content);
            } else {
                elements.contentPreview.innerHTML = '<p>没有内容可预览</p>';
            }
            elements.contentPreview.classList.remove('hidden');
            elements.postContent.classList.add('hidden');
            elements.previewBtn.textContent = '编辑';
        } else {
            // 返回编辑
            elements.contentPreview.classList.add('hidden');
            elements.postContent.classList.remove('hidden');
            elements.previewBtn.textContent = '👁️';
        }
    }

    // 保存草稿
    function saveDraft() {
        // 实际应用中会将草稿保存到服务器
        alert('草稿已保存');
    }

    // 发布文章
    function publishPost(e) {
        e.preventDefault();
        
        // 表单验证
        if (!elements.postTitle.value || !elements.postCategory.value || !elements.postContent.value) {
            alert('请填写必填字段：标题、分类和内容');
            return;
        }
        
        // 构建文章对象
        const newPost = {
            id: Date.now(), // 临时ID
            title: elements.postTitle.value,
            category: elements.postCategory.value,
            tags: elements.postTags.value.split(',').map(tag => tag.trim()).filter(Boolean),
            excerpt: elements.postContent.value.substring(0, 150) + '...',
            content: elements.postContent.value,
            date: new Date().toISOString().split('T')[0],
            author: {
                id: state.currentUser?.id || 999,
                name: state.currentUser?.name || '当前用户',
                avatar: state.currentUser?.avatar || '/src/assets/placeholder-avatar.jpg'
            },
            cover: elements.coverPreviewImg.src || '/src/assets/placeholder-article.jpg',
            views: 0,
            likes: 0,
            comments: 0
        };
        
        // 实际应用中会将文章发送到服务器
        // 模拟发布成功
        alert('文章已发布成功！');
        
        // 添加到本地数据并更新视图
        state.posts.unshift(newPost);
        state.filteredPosts.unshift(newPost);
        renderPosts(state.filteredPosts);
        
        // 隐藏编辑器
        hideEditor();
    }

    // 打开文章详情
    function openPostDetail(postId) {
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;
        
        state.currentPostId = postId;
        
        // 填充模态框内容
        elements.modalPostTitle.textContent = post.title;
        elements.modalAuthorAvatar.src = post.author.avatar;
        elements.modalAuthorName.textContent = post.author.name;
        elements.modalPostDate.textContent = post.date;
        elements.modalPostContent.innerHTML = window.SoundSphere.markdown.parse(post.content);
        
        // 标签
        elements.modalPostTags.innerHTML = post.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        // 统计
        elements.modalPostViews.textContent = formatNumber(post.views);
        elements.modalPostLikes.textContent = formatNumber(post.likes);
        elements.modalPostComments.textContent = formatNumber(post.comments);
        
        // 加载评论
        loadComments(postId);
        
        // 显示模态框
        elements.postDetailModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // 加载评论
    function loadComments(postId) {
        // 模拟评论数据
        const mockComments = [
            {
                id: 1,
                author: {
                    id: 201,
                    name: '音乐爱好者',
                    avatar: '/src/assets/placeholder-avatar.jpg'
                },
                content: '非常实用的文章，学到了很多！',
                date: '2023-06-16',
                likes: 5
            },
            {
                id: 2,
                author: {
                    id: 202,
                    name: '编曲新手',
                    avatar: '/src/assets/placeholder-avatar.jpg'
                },
                content: '请问关于第三部分的内容有更详细的资料吗？',
                date: '2023-06-15',
                likes: 2
            }
        ];
        
        // 渲染评论
        elements.modalCommentsList.innerHTML = '';
        mockComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <div class="comment-user">
                        <img src="${comment.author.avatar}" alt="${comment.author.name}">
                        <span class="comment-user-name">${comment.author.name}</span>
                    </div>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-body">
                    ${comment.content}
                </div>
                <div class="comment-footer">
                    <span class="comment-action comment-like">
                        <i class="like-icon"></i> 点赞 (${comment.likes})
                    </span>
                    <span class="comment-action comment-reply">
                        <i class="reply-icon"></i> 回复
                    </span>
                </div>
            `;
            elements.modalCommentsList.appendChild(commentElement);
        });
    }

    // 检查用户登录状态
    function checkAuthStatus() {
        // 实际应用中会从服务器获取用户信息
        // 模拟未登录状态
        state.isLoggedIn = false;
        state.currentUser = null;
        
        updateUIForAuthState();
    }

    // 根据登录状态更新UI
    function updateUIForAuthState() {
        if (state.isLoggedIn && state.currentUser) {
            // 已登录
            elements.userAvatar.src = state.currentUser.avatar;
            elements.userName.textContent = state.currentUser.name;
            elements.userBio.textContent = state.currentUser.bio;
            elements.userBio.classList.remove('hidden');
            elements.profileStats.classList.remove('hidden');
            elements.sidebarLoginPrompt.classList.add('hidden');
            
            // 更新统计数据
            elements.postsCount.textContent = state.currentUser.postsCount || 0;
            elements.followersCount.textContent = state.currentUser.followersCount || 0;
            elements.followingCount.textContent = state.currentUser.followingCount || 0;
            
            // 更新导航栏
            document.getElementById('login-btn').classList.add('hidden');
            document.getElementById('signup-btn').classList.add('hidden');
            
            // 添加用户菜单（下拉菜单等）
            // 代码略...
        } else {
            // 未登录
            elements.userAvatar.src = '/src/assets/placeholder-avatar.jpg';
            elements.userName.textContent = '未登录';
            elements.userBio.classList.add('hidden');
            elements.profileStats.classList.add('hidden');
            elements.sidebarLoginPrompt.classList.remove('hidden');
            
            // 更新导航栏
            document.getElementById('login-btn').classList.remove('hidden');
            document.getElementById('signup-btn').classList.remove('hidden');
        }
    }

    // 显示登录模态框
    function showLoginModal() {
        elements.loginModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // 显示注册模态框
    function showSignupModal() {
        elements.signupModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // 处理登录
    function handleLogin(e) {
        e.preventDefault();
        // 实际应用中会发送请求到服务器验证
        alert('登录功能将在后端实现');
    }

    // 处理注册
    function handleSignup(e) {
        e.preventDefault();
        // 实际应用中会发送请求到服务器
        alert('注册功能将在后端实现');
    }

    // 加载更多文章
    function loadMorePosts() {
        // 实际应用中会从服务器加载更多文章
        alert('加载更多文章功能将在实际API实现中完成');
    }

    // 加载我的文章
    function loadMyPosts() {
        // 实际应用中会从服务器获取当前用户的文章
        alert('我的文章功能将在用户系统实现后完成');
    }

    // 加载收藏的文章
    function loadBookmarkedPosts() {
        // 实际应用中会从服务器获取当前用户收藏的文章
        alert('收藏文章功能将在用户系统实现后完成');
    }

    // 加载关注的作者及其文章
    function loadFollowedContent() {
        // 实际应用中会从服务器获取关注的作者信息
        alert('关注作者功能将在用户系统实现后完成');
    }

    // 初始化博客日历
    function initCalendar() {
        if (!elements.blogCalendar) return;
        
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        renderCalendar(currentYear, currentMonth);
    }

    // 渲染日历
    function renderCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay(); // 0 = 周日, 1 = 周一, ...
        
        const today = new Date();
        
        // 月份和年份显示
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        
        // 创建日历
        let calendarHTML = `
            <div class="calendar-header">
                <h4>${year}年 ${monthNames[month]}</h4>
                <div class="calendar-nav">
                    <button class="btn btn-sm btn-outline" id="prev-month">◀</button>
                    <button class="btn btn-sm btn-outline" id="next-month">▶</button>
                </div>
            </div>
            <div class="calendar-weekdays">
                <div>日</div>
                <div>一</div>
                <div>二</div>
                <div>三</div>
                <div>四</div>
                <div>五</div>
                <div>六</div>
            </div>
            <div class="calendar-grid">
        `;
        
        // 上个月的天数，用于填充第一行
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        // 添加上个月的天数
        for (let i = 0; i < firstDayOfWeek; i++) {
            const day = prevMonthDays - firstDayOfWeek + i + 1;
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        // 添加当前月的天数
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            // 模拟某些日期有博客文章发布
            const hasPosts = [3, 7, 12, 18, 25].includes(day);
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasPosts ? 'has-posts' : ''}" 
                     data-date="${year}-${month+1}-${day}">
                    ${day}
                </div>
            `;
        }
        
        // 添加下个月的天数，填充最后一行
        const totalCells = 42; // 6行 x 7列
        const cellsFilled = firstDayOfWeek + daysInMonth;
        const cellsToAdd = totalCells - cellsFilled;
        
        for (let day = 1; day <= cellsToAdd; day++) {
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        calendarHTML += `</div>`;
        
        // 更新日历
        elements.blogCalendar.innerHTML = calendarHTML;
        
        // 添加上/下个月按钮事件
        document.getElementById('prev-month').addEventListener('click', () => {
            let newMonth = month - 1;
            let newYear = year;
            if (newMonth < 0) {
                newMonth = 11;
                newYear -= 1;
            }
            renderCalendar(newYear, newMonth);
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            let newMonth = month + 1;
            let newYear = year;
            if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
            }
            renderCalendar(newYear, newMonth);
        });
        
        // 添加日期点击事件，显示指定日期的文章
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                if (!day.classList.contains('other-month')) {
                    const date = day.dataset.date;
                    if (day.classList.contains('has-posts')) {
                        alert(`将加载 ${date} 发布的文章`);
                    }
                }
            });
        });
    }

    // 更新博客统计
    function updateBlogStats() {
        if (!elements.totalPosts) return;
        
        // 实际应用中会从服务器获取统计数据
        // 模拟数据
        elements.totalPosts.textContent = '1,234';
        elements.totalComments.textContent = '5,678';
        elements.totalViews.textContent = '89,012';
        elements.todayPosts.textContent = '12';
    }

    // 工具函数：格式化数字
    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // 初始化
    init();
}); 
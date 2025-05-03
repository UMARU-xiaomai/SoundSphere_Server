/**
 * SoundSphere - 认证工具
 * 管理用户登录、注册和会话状态
 */

// 保存当前登录用户信息
let currentUser = null;

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化登录表单处理
    initLoginForm();
    
    // 初始化注册表单处理
    initSignupForm();
    
    // 检查用户登录状态
    checkAuthStatus();
});

/**
 * 初始化登录表单处理
 */
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            
            if (!emailInput || !passwordInput) return;
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            try {
                const userData = await window.SoundSphereAPI.User.login(email, password);
                handleSuccessfulLogin(userData);
            } catch (error) {
                showAuthError(error.message || '登录失败，请重试。');
            }
        });
    }
}

/**
 * 初始化注册表单处理
 */
function initSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const usernameInput = document.getElementById('signup-username');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const confirmPasswordInput = document.getElementById('signup-confirm-password');
            
            if (!usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;
            
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            
            // 基本表单验证
            if (password !== confirmPassword) {
                showAuthError('两次输入的密码不一致');
                return;
            }
            
            try {
                const userData = await window.SoundSphereAPI.User.register({
                    username,
                    email,
                    password
                });
                handleSuccessfulLogin(userData);
            } catch (error) {
                showAuthError(error.message || '注册失败，请重试。');
            }
        });
    }
}

/**
 * 处理成功登录
 * @param {Object} userData - 用户数据
 */
function handleSuccessfulLogin(userData) {
    currentUser = userData;
    
    // 关闭登录/注册模态框
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // 更新UI显示已登录状态
    updateAuthUI();
    
    // 显示成功消息
    showNotification('登录成功', 'success');
}

/**
 * 更新UI显示认证状态
 */
function updateAuthUI() {
    const userActions = document.querySelector('.user-actions');
    if (!userActions) return;
    
    if (currentUser) {
        // 用户已登录，显示用户菜单
        userActions.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar">
                    <img src="${currentUser.avatar || '/src/assets/default-avatar.png'}" alt="${currentUser.username}">
                </div>
                <div class="user-dropdown">
                    <ul>
                        <li><a href="profile.html">我的主页</a></li>
                        <li><a href="settings.html">设置</a></li>
                        <li><a href="#" id="logout-btn">退出登录</a></li>
                    </ul>
                </div>
            </div>
        `;
        
        // 添加退出登录按钮事件
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // 用户未登录，显示登录/注册按钮
        userActions.innerHTML = `
            <button class="btn btn-secondary" id="login-btn">登录</button>
            <button class="btn btn-primary" id="signup-btn">注册</button>
        `;
        
        // 重新绑定登录/注册按钮事件
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        
        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', function() {
                loginModal.classList.add('active');
            });
        }
        
        if (signupBtn && signupModal) {
            signupBtn.addEventListener('click', function() {
                signupModal.classList.add('active');
            });
        }
    }
}

/**
 * 检查用户登录状态
 */
async function checkAuthStatus() {
    try {
        const userData = await window.SoundSphereAPI.User.getCurrentUser();
        if (userData) {
            currentUser = userData;
            updateAuthUI();
        }
    } catch (error) {
        console.log('用户未登录');
        // 用户未登录，不需要特殊处理
    }
}

/**
 * 用户退出登录
 */
async function logout() {
    try {
        await window.SoundSphereAPI.User.logout();
        currentUser = null;
        updateAuthUI();
        showNotification('已成功退出登录', 'success');
    } catch (error) {
        showNotification('退出登录失败', 'error');
    }
}

/**
 * 显示认证错误消息
 * @param {string} message - 错误消息
 */
function showAuthError(message) {
    const errorMessages = document.querySelectorAll('.auth-error');
    errorMessages.forEach(element => {
        element.textContent = message;
        element.style.display = 'block';
    });
}

/**
 * 显示通知消息
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 几秒后隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 导出auth工具
window.SoundSphereAuth = {
    getCurrentUser: () => currentUser,
    isLoggedIn: () => !!currentUser,
    logout: logout
}; 
// 身份验证工具函数
// 这个文件包含用户登录、注册和会话管理的函数

// 保存令牌到本地存储
function saveToken(token) {
    localStorage.setItem('soundsphere_token', token);
}

// 从本地存储获取令牌
function getToken() {
    return localStorage.getItem('soundsphere_token');
}

// 删除令牌（登出）
function removeToken() {
    localStorage.removeItem('soundsphere_token');
}

// 保存用户信息到本地存储
function saveUser(user) {
    localStorage.setItem('soundsphere_user', JSON.stringify(user));
}

// 从本地存储获取用户信息
function getUser() {
    const userJson = localStorage.getItem('soundsphere_user');
    return userJson ? JSON.parse(userJson) : null;
}

// 删除用户信息（登出）
function removeUser() {
    localStorage.removeItem('soundsphere_user');
}

// 检查用户是否已登录
function isLoggedIn() {
    return !!getToken();
}

// 解析JWT令牌（不需要发送到服务器验证）
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// 检查令牌是否过期
function isTokenExpired() {
    const token = getToken();
    if (!token) return true;
    
    const decodedToken = parseJwt(token);
    if (!decodedToken) return true;
    
    // 检查过期时间 (exp 是 Unix 时间戳，单位是秒)
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
}

// 登录
async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '登录失败'
            };
        }
        
        // 保存令牌和用户信息
        saveToken(data.token);
        saveUser(data.user);
        
        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        console.error('登录错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 注册
async function register(username, email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '注册失败'
            };
        }
        
        // 保存令牌和用户信息
        saveToken(data.token);
        saveUser(data.user);
        
        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        console.error('注册错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 自动登录（通过令牌获取用户信息）
async function autoLogin() {
    if (!isLoggedIn() || isTokenExpired()) {
        // 没有令牌或令牌已过期
        logout();
        return {
            success: false,
            message: '未登录或会话已过期'
        };
    }
    
    try {
        const token = getToken();
        const response = await fetch('http://localhost:3000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // 令牌无效或过期
            logout();
            return {
                success: false,
                message: data.message || '会话已过期'
            };
        }
        
        // 更新用户信息
        saveUser(data.user);
        
        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        console.error('自动登录错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 登出
function logout() {
    removeToken();
    removeUser();
    
    // 可以添加其他清理逻辑，如重定向到登录页面
    return {
        success: true,
        message: '已成功登出'
    };
}

// 更新用户信息
async function updateProfile(userData) {
    if (!isLoggedIn()) {
        return {
            success: false,
            message: '未登录'
        };
    }
    
    try {
        const token = getToken();
        const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '更新个人资料失败'
            };
        }
        
        // 更新本地存储的用户信息
        saveUser(data.user);
        
        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        console.error('更新个人资料错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 更改密码
async function changePassword(currentPassword, newPassword) {
    if (!isLoggedIn()) {
        return {
            success: false,
            message: '未登录'
        };
    }
    
    try {
        const token = getToken();
        const response = await fetch('http://localhost:3000/api/auth/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '更改密码失败'
            };
        }
        
        return {
            success: true,
            message: '密码已成功更改'
        };
    } catch (error) {
        console.error('更改密码错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 忘记密码（发送重置邮件）
async function forgotPassword(email) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '发送重置密码邮件失败'
            };
        }
        
        return {
            success: true,
            message: data.message || '重置密码邮件已发送'
        };
    } catch (error) {
        console.error('忘记密码错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 重置密码（使用重置令牌）
async function resetPassword(token, newPassword) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '重置密码失败'
            };
        }
        
        return {
            success: true,
            message: data.message || '密码已成功重置'
        };
    } catch (error) {
        console.error('重置密码错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 验证邮箱（使用验证令牌）
async function verifyEmail(token) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: data.message || '验证邮箱失败'
            };
        }
        
        // 如果当前已登录，更新用户信息
        if (isLoggedIn()) {
            const user = getUser();
            if (user) {
                user.emailVerified = true;
                saveUser(user);
            }
        }
        
        return {
            success: true,
            message: data.message || '邮箱已成功验证'
        };
    } catch (error) {
        console.error('验证邮箱错误:', error);
        return {
            success: false,
            message: '连接服务器时出错'
        };
    }
}

// 导出身份验证函数
window.auth = {
    login,
    register,
    logout,
    autoLogin,
    isLoggedIn,
    getToken,
    getUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    isTokenExpired
}; 
// UI 工具函数
// 这个文件包含用于处理 UI 相关功能的实用函数

// 显示通知消息
function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加到文档
    const notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) {
        // 如果不存在通知容器，则创建一个
        const newContainer = document.createElement('div');
        newContainer.className = 'notifications-container';
        document.body.appendChild(newContainer);
        newContainer.appendChild(notification);
    } else {
        notificationsContainer.appendChild(notification);
    }
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300); // 等待淡出动画完成
    }, duration);
    
    return notification;
}

// 显示成功通知
function showSuccess(message, duration = 3000) {
    return showNotification(message, 'success', duration);
}

// 显示错误通知
function showError(message, duration = 4000) {
    return showNotification(message, 'error', duration);
}

// 显示警告通知
function showWarning(message, duration = 3500) {
    return showNotification(message, 'warning', duration);
}

// 显示确认对话框
function showConfirm(message, onConfirm, onCancel) {
    // 创建确认对话框元素
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'modal confirm-dialog';
    
    confirmDialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>确认操作</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="btn btn-secondary" id="cancel-btn">取消</button>
                    <button class="btn btn-primary" id="confirm-btn">确认</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加到文档
    document.body.appendChild(confirmDialog);
    
    // 显示对话框
    setTimeout(() => {
        confirmDialog.classList.add('active');
    }, 10);
    
    // 绑定事件
    const closeBtn = confirmDialog.querySelector('.close-btn');
    const cancelBtn = confirmDialog.querySelector('#cancel-btn');
    const confirmBtn = confirmDialog.querySelector('#confirm-btn');
    
    function close() {
        confirmDialog.classList.remove('active');
        setTimeout(() => {
            confirmDialog.remove();
        }, 300); // 等待淡出动画完成
    }
    
    closeBtn.addEventListener('click', () => {
        close();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    });
    
    cancelBtn.addEventListener('click', () => {
        close();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    });
    
    confirmBtn.addEventListener('click', () => {
        close();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    // 点击背景关闭
    confirmDialog.addEventListener('click', (e) => {
        if (e.target === confirmDialog) {
            close();
            if (typeof onCancel === 'function') {
                onCancel();
            }
        }
    });
    
    return confirmDialog;
}

// 格式化日期
function formatDate(date) {
    if (!date) return '';
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// 格式化日期时间
function formatDateTime(date) {
    if (!date) return '';
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 格式化相对时间（如：3分钟前）
function formatRelativeTime(date) {
    if (!date) return '';
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return '刚刚';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}小时前`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays}天前`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths}个月前`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}年前`;
}

// 格式化数字（例如：1000 -> 1k）
function formatNumber(number) {
    if (number === null || number === undefined) return '';
    
    if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        return (number / 1000).toFixed(1) + 'k';
    } else {
        return (number / 1000000).toFixed(1) + 'M';
    }
}

// 格式化播放时长
function formatDuration(seconds) {
    if (!seconds) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 带防抖的输入事件处理
function debounce(func, wait) {
    let timeout;
    
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 带节流的事件处理
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        const context = this;
        
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// 复制文本到剪贴板
function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    console.error('复制到剪贴板失败:', err);
                    reject(err);
                });
        } else {
            // 兼容性写法
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed'; // 避免影响页面布局
                textarea.style.opacity = 0;
                
                document.body.appendChild(textarea);
                textarea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (successful) {
                    resolve(true);
                } else {
                    reject(new Error('复制操作失败'));
                }
            } catch (err) {
                console.error('复制到剪贴板失败:', err);
                reject(err);
            }
        }
    });
}

// 滚动到页面顶部
function scrollToTop(smooth = true) {
    if (smooth) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        window.scrollTo(0, 0);
    }
}

// 滚动到指定元素
function scrollToElement(element, offset = 0, smooth = true) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const position = rect.top + scrollTop - offset;
    
    if (smooth) {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    } else {
        window.scrollTo(0, position);
    }
}

// 获取元素距离页面顶部的距离
function getOffsetTop(element) {
    let offsetTop = 0;
    
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    
    return offsetTop;
}

// 切换全屏模式
function toggleFullscreen(element = document.documentElement) {
    if (!document.fullscreenElement) {
        // 进入全屏
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
        return true;
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        return false;
    }
}

// 添加触摸滑动支持
function addSwipeSupport(element, onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const minSwipeDistance = 50; // 最小滑动距离
        
        if (touchEndX < touchStartX - minSwipeDistance) {
            // 向左滑动
            if (typeof onSwipeLeft === 'function') {
                onSwipeLeft();
            }
        }
        
        if (touchEndX > touchStartX + minSwipeDistance) {
            // 向右滑动
            if (typeof onSwipeRight === 'function') {
                onSwipeRight();
            }
        }
    }
}

// 检查元素是否在视口内
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 检查元素是否部分在视口内
function isElementPartiallyInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom > 0 &&
        rect.right > 0
    );
}

// 导出 UI 工具函数
window.ui = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatNumber,
    formatDuration,
    debounce,
    throttle,
    copyToClipboard,
    scrollToTop,
    scrollToElement,
    getOffsetTop,
    toggleFullscreen,
    addSwipeSupport,
    isElementInViewport,
    isElementPartiallyInViewport
}; 
/**
 * 音乐页面特定功能
 */

// 音乐数据示例
const musicData = [
    {
        id: 1,
        title: '夏日旋律',
        artist: '李明',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 12000,
        likes: 342,
        category: 'tracks'
    },
    {
        id: 2,
        title: '电子之梦',
        artist: '张伟',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 8500,
        likes: 156,
        category: 'beats'
    },
    {
        id: 3,
        title: '雨中漫步',
        artist: '王丽',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 6700,
        likes: 214,
        category: 'tracks'
    },
    {
        id: 4,
        title: '星空下的钢琴曲',
        artist: '陈静',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 4300,
        likes: 98,
        category: 'tracks'
    }
];

// 当前页码
let currentPage = 1;
// 当前筛选条件
let currentFilter = 'all';
// 是否正在加载
let isLoading = false;
// 是否还有更多数据
let hasMoreMusic = true;

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 音乐过滤功能
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
                filterMusicByCategory(filter);
            });
        });
    }
    
    // 加载更多按钮
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreMusic();
        });
    }
    
    // 初始化音乐播放器
    initMusicPlayer();
    
    // 初始化搜索功能
    initSearchFunction();
});

/**
 * 初始化搜索功能
 */
function initSearchFunction() {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;
    
    const searchInput = searchBar.querySelector('input');
    const searchButton = searchBar.querySelector('button');
    
    if (!searchInput || !searchButton) return;
    
    // 点击搜索按钮时执行搜索
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchMusic(query);
        }
    });
    
    // 按回车键时执行搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                searchMusic(query);
            }
        }
    });
}

/**
 * 搜索音乐
 * @param {string} query - 搜索关键词
 */
async function searchMusic(query) {
    // 显示加载状态
    const musicGrid = document.getElementById('music-grid');
    if (musicGrid) {
        musicGrid.innerHTML = '<div class="loading-indicator">正在搜索...</div>';
    }
    
    try {
        // 调用搜索API
        const result = await window.SoundSphereAPI.Music.searchMusic(query);
        
        // 更新当前状态
        currentPage = 1;
        currentFilter = 'search';
        hasMoreMusic = result.hasMore || false;
        
        // 渲染搜索结果
        if (result.data && result.data.length > 0) {
            renderMusicGrid(result.data);
        } else {
            if (musicGrid) {
                musicGrid.innerHTML = '<div class="no-results">没有找到符合 "' + query + '" 的结果</div>';
            }
        }
        
        // 更新加载更多按钮状态
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            if (hasMoreMusic) {
                loadMoreBtn.textContent = '加载更多';
                loadMoreBtn.disabled = false;
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
        
        // 更新页面标题以反映搜索
        const pageTitle = document.querySelector('.music-hero h1');
        if (pageTitle) {
            pageTitle.textContent = '搜索结果: ' + query;
        }
        
    } catch (error) {
        console.error('搜索音乐失败:', error);
        
        // 显示错误提示
        if (musicGrid) {
            musicGrid.innerHTML = '<div class="error-message">搜索失败，请重试</div>';
        }
    }
}

/**
 * 根据类别过滤音乐
 * @param {string} category - 音乐类别
 */
function filterMusicByCategory(category) {
    console.log('过滤音乐类别:', category);
    
    // 更新当前筛选条件和页码
    currentFilter = category;
    currentPage = 1;
    hasMoreMusic = true;
    
    // 在实际应用中，这里会根据类别从服务器获取音乐数据
    // 暂时使用示例数据进行过滤
    let filteredMusic;
    if (category === 'all') {
        filteredMusic = musicData;
    } else {
        filteredMusic = musicData.filter(music => music.category === category);
    }
    
    // 渲染过滤后的音乐
    renderMusicGrid(filteredMusic);
    
    // 重置加载更多按钮
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.textContent = '加载更多';
        loadMoreBtn.disabled = false;
    }
}

/**
 * 渲染音乐网格
 * @param {Array} musicList - 音乐列表
 */
function renderMusicGrid(musicList) {
    const musicGrid = document.getElementById('music-grid');
    if (!musicGrid) return;
    
    // 清空当前网格
    musicGrid.innerHTML = '';
    
    // 如果没有音乐数据，显示无数据提示
    if (!musicList || musicList.length === 0) {
        musicGrid.innerHTML = '<div class="no-results">没有找到符合条件的音乐</div>';
        return;
    }
    
    // 为每个音乐项创建卡片
    musicList.forEach(music => {
        const musicCard = document.createElement('div');
        musicCard.className = 'music-card';
        musicCard.dataset.id = music.id;
        
        // 格式化播放次数和点赞数
        const playsFormatted = music.plays >= 10000 
            ? (music.plays / 10000).toFixed(1) + '万' 
            : music.plays;
            
        const likesFormatted = music.likes;
        
        musicCard.innerHTML = `
            <div class="music-cover">
                <img src="${music.cover}" alt="${music.title}的封面">
                <button class="play-btn"><i class="play-icon"></i></button>
            </div>
            <div class="music-info">
                <h3>${music.title}</h3>
                <p class="artist">${music.artist}</p>
                <div class="music-stats">
                    <span><i class="play-count-icon"></i> ${playsFormatted}</span>
                    <span><i class="like-icon"></i> ${likesFormatted}</span>
                </div>
            </div>
        `;
        
        musicGrid.appendChild(musicCard);
    });
    
    // 重新初始化播放按钮事件
    initMusicPlayer();
}

/**
 * 加载更多音乐
 */
async function loadMoreMusic() {
    // 如果正在加载或没有更多数据，则返回
    if (isLoading || !hasMoreMusic) return;
    
    isLoading = true;
    
    // 显示加载状态
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.textContent = '加载中...';
        loadMoreBtn.disabled = true;
    }
    
    try {
        // 加载下一页数据
        currentPage++;
        const response = await window.SoundSphereAPI.Music.getMusicList(currentPage, currentFilter);
        
        // 检查是否还有更多数据
        if (!response.data || response.data.length === 0) {
            hasMoreMusic = false;
            if (loadMoreBtn) {
                loadMoreBtn.textContent = '没有更多音乐';
                loadMoreBtn.disabled = true;
            }
            return;
        }
        
        // 获取当前音乐网格
        const musicGrid = document.getElementById('music-grid');
        if (!musicGrid) return;
        
        // 添加新音乐卡片
        response.data.forEach(music => {
            const musicCard = document.createElement('div');
            musicCard.className = 'music-card';
            musicCard.dataset.id = music.id;
            
            // 格式化播放次数和点赞数
            const playsFormatted = music.plays >= 10000 
                ? (music.plays / 10000).toFixed(1) + '万' 
                : music.plays;
                
            const likesFormatted = music.likes;
            
            musicCard.innerHTML = `
                <div class="music-cover">
                    <img src="${music.cover}" alt="${music.title}的封面">
                    <button class="play-btn"><i class="play-icon"></i></button>
                </div>
                <div class="music-info">
                    <h3>${music.title}</h3>
                    <p class="artist">${music.artist}</p>
                    <div class="music-stats">
                        <span><i class="play-count-icon"></i> ${playsFormatted}</span>
                        <span><i class="like-icon"></i> ${likesFormatted}</span>
                    </div>
                </div>
            `;
            
            musicGrid.appendChild(musicCard);
        });
        
        // 重新初始化音乐播放器
        initMusicPlayer();
        
        // 恢复加载按钮状态
        if (loadMoreBtn) {
            loadMoreBtn.textContent = '加载更多';
            loadMoreBtn.disabled = false;
        }
    } catch (error) {
        console.error('加载更多音乐失败:', error);
        // 显示错误提示
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.textContent = '加载失败，点击重试';
            loadMoreBtn.disabled = false;
        }
    } finally {
        isLoading = false;
    }
}

/**
 * 初始化音乐播放器
 */
function initMusicPlayer() {
    const playButtons = document.querySelectorAll('.play-btn');
    if (playButtons.length > 0) {
        playButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const musicCard = this.closest('.music-card');
                const title = musicCard.querySelector('h3').textContent;
                const artist = musicCard.querySelector('.artist').textContent;
                
                // 播放音乐
                playMusic(title, artist);
            });
        });
    }
}

/**
 * 播放音乐
 * @param {string} title - 音乐标题
 * @param {string} artist - 艺术家
 */
function playMusic(title, artist) {
    console.log('播放音乐:', title, 'by', artist);
    
    // 在实际应用中，这里会初始化音频播放器并播放选定的音乐
    alert(`正在播放: ${title} - ${artist}`);
} 
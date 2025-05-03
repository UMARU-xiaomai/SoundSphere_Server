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
        category: 'tracks',
        style: '流行',
        type: '原创',
        duration: '3:45',
        url: 'https://file-examples.com/storage/feb4373c4862454b35e62d3/2017/11/file_example_MP3_700KB.mp3'
    },
    {
        id: 2,
        title: '电子之梦',
        artist: '张伟',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 8500,
        likes: 156,
        category: 'beats',
        style: '电子',
        type: '伴奏',
        duration: '2:30',
        url: 'https://file-examples.com/storage/feb4373c4862454b35e62d3/2017/11/file_example_MP3_1MG.mp3'
    },
    {
        id: 3,
        title: '雨中漫步',
        artist: '王丽',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 6700,
        likes: 214,
        category: 'tracks',
        style: '爵士',
        type: '原创',
        duration: '4:15',
        url: 'https://file-examples.com/storage/feb4373c4862454b35e62d3/2017/11/file_example_MP3_2MG.mp3'
    },
    {
        id: 4,
        title: '星空下的钢琴曲',
        artist: '陈静',
        cover: '/src/assets/placeholder-cover.jpg',
        plays: 4300,
        likes: 98,
        category: 'tracks',
        style: '古典',
        type: '原创',
        duration: '5:20',
        url: 'https://file-examples.com/storage/feb4373c4862454b35e62d3/2017/11/file_example_MP3_5MG.mp3'
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
// 播放列表
let playlist = [];
// 当前播放的索引
let currentTrackIndex = -1;
// 是否正在播放
let isPlaying = false;
// 是否随机播放
let isShuffle = false;
// 是否循环播放
let isRepeat = false;
// 是否静音
let isMuted = false;
// 音频元素
let audioPlayer;
// 保存播放进度
let savedProgress = 0;

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化音频播放器
    audioPlayer = document.getElementById('audio-player');
    
    // 删除加载指示器
    const loadingIndicator = document.getElementById('music-loading');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
    
    // 初始加载音乐列表
    renderMusicGrid(musicData);
    
    // 音乐过滤功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // 移除所有按钮的active类
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                
                // 添加当前按钮的active类
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // 更新面板属性
                const musicGrid = document.getElementById('music-grid');
                if (musicGrid) {
                    musicGrid.setAttribute('aria-labelledby', this.id);
                }
                
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
    
    // 初始化音乐播放器展开/收起功能
    initPlayerToggle();
    
    // 初始化搜索功能
    initSearchFunction();
    
    // 初始化滚动监听
    initScrollListener();
    
    // 初始化移动菜单
    initMobileMenu();
});

/**
 * 初始化移动菜单
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            mobileNav.classList.toggle('active');
        });
    }
}

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
 * 初始化滚动监听
 */
function initScrollListener() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
        musicGrid.innerHTML = '<div class="loading-indicator"><div class="spinner" aria-label="加载中"></div><p>正在搜索...</p></div>';
    }
    
    try {
        // 实际应用中这里会调用API，这里我们模拟搜索结果
        // 从示例数据中过滤包含查询词的标题或艺术家
        const result = musicData.filter(music => 
            music.title.toLowerCase().includes(query.toLowerCase()) || 
            music.artist.toLowerCase().includes(query.toLowerCase())
        );
        
        // 更新当前状态
        currentPage = 1;
        currentFilter = 'search';
        hasMoreMusic = false; // 假设搜索结果没有更多数据
        
        // 模拟网络延迟
        setTimeout(() => {
            // 渲染搜索结果
            if (result && result.length > 0) {
                renderMusicGrid(result);
            } else {
                if (musicGrid) {
                    musicGrid.innerHTML = '<div class="no-results">没有找到符合 "' + query + '" 的结果</div>';
                }
            }
            
            // 更新加载更多按钮状态
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
            
            // 更新页面标题以反映搜索
            const pageTitle = document.querySelector('.music-hero h1');
            if (pageTitle) {
                pageTitle.textContent = '搜索结果: ' + query;
            }
        }, 500);
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
    
    // 根据类别过滤音乐数据
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
        loadMoreBtn.style.display = filteredMusic.length > 0 ? 'block' : 'none';
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
    
    // 添加表头
    const tableHeader = document.createElement('div');
    tableHeader.className = 'music-list-header';
    tableHeader.innerHTML = `
        <div class="music-list-cover-header">封面</div>
        <div class="music-list-name-header">名称</div>
        <div class="music-list-artist-header">艺术家</div>
        <div class="music-list-style-header">作品风格</div>
        <div class="music-list-type-header">作品类型</div>
        <div class="music-list-duration-header">时长</div>
        <div class="music-list-actions-header">操作</div>
    `;
    musicGrid.appendChild(tableHeader);
    
    // 为每个音乐项创建行
    musicList.forEach(music => {
        const musicRow = document.createElement('div');
        musicRow.className = 'music-list-row';
        musicRow.dataset.id = music.id;
        
        musicRow.innerHTML = `
            <div class="music-list-cover">
                <img src="${music.cover}" alt="${music.title}的封面">
            </div>
            <div class="music-list-name">${music.title}</div>
            <div class="music-list-artist">${music.artist}</div>
            <div class="music-list-style">${music.style || '-'}</div>
            <div class="music-list-type">${music.type || music.category}</div>
            <div class="music-list-duration">${music.duration || '-'}</div>
            <div class="music-list-actions">
                <button class="play-btn" aria-label="播放${music.title}">
                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
                <button class="more-options-btn" aria-label="更多选项">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </div>
        `;
        
        musicGrid.appendChild(musicRow);
        
        // 添加点击事件
        const playBtn = musicRow.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.preventDefault();
                playMusic(music.id);
            });
        }
        
        // 添加更多选项点击事件
        const moreOptionsBtn = musicRow.querySelector('.more-options-btn');
        if (moreOptionsBtn) {
            moreOptionsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // 这里可以实现更多选项菜单
                console.log('显示更多选项菜单:', music.title);
            });
        }
    });
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
        // 实际应用中这里会调用API，这里我们模拟加载更多，复用当前数据
        // 模拟网络延迟
        setTimeout(() => {
            // 在实际应用中，如果没有更多数据，应设置hasMoreMusic为false
            hasMoreMusic = false;
            
            if (loadMoreBtn) {
                loadMoreBtn.textContent = '没有更多音乐';
                loadMoreBtn.disabled = true;
            }
            
            isLoading = false;
        }, 1000);
    } catch (error) {
        console.error('加载更多音乐失败:', error);
        // 显示错误提示
        if (loadMoreBtn) {
            loadMoreBtn.textContent = '加载失败，点击重试';
            loadMoreBtn.disabled = false;
        }
        isLoading = false;
    }
}

/**
 * 初始化音乐播放器
 */
function initMusicPlayer() {
    if (!audioPlayer) return;
    
    // 播放/暂停按钮
    const playPauseBtn = document.getElementById('play-pause-btn');
    // 上一首按钮
    const prevBtn = document.getElementById('prev-btn');
    // 下一首按钮
    const nextBtn = document.getElementById('next-btn');
    // 随机播放按钮
    const shuffleBtn = document.getElementById('shuffle-btn');
    // 循环播放按钮
    const repeatBtn = document.getElementById('repeat-btn');
    // 静音按钮
    const muteBtn = document.getElementById('mute-btn');
    // 音量滑块
    const volumeSlider = document.getElementById('volume-slider');
    // 进度条滑块
    const progressSlider = document.getElementById('progress-slider');
    // 进度条内部填充
    const progressBarInner = document.getElementById('progress-bar-inner');
    // 当前时间
    const currentTimeDisplay = document.getElementById('current-time');
    // 总时间
    const totalTimeDisplay = document.getElementById('total-time');
    
    // 添加播放/暂停事件监听
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (playlist.length === 0) {
                // 如果播放列表为空，提示用户
                alert('请先选择音乐');
                return;
            }
            
            togglePlayPause();
        });
    }
    
    // 添加上一首事件监听
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            playPrevious();
        });
    }
    
    // 添加下一首事件监听
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            playNext();
        });
    }
    
    // 添加随机播放事件监听
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            toggleShuffle();
            this.classList.toggle('active', isShuffle);
            this.setAttribute('aria-label', isShuffle ? '关闭随机播放' : '随机播放');
        });
    }
    
    // 添加循环播放事件监听
    if (repeatBtn) {
        repeatBtn.addEventListener('click', function() {
            toggleRepeat();
            this.classList.toggle('active', isRepeat);
            this.setAttribute('aria-label', isRepeat ? '关闭循环播放' : '循环播放');
        });
    }
    
    // 添加静音事件监听
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            toggleMute();
            this.classList.toggle('is-muted', isMuted);
            this.setAttribute('aria-label', isMuted ? '取消静音' : '静音');
        });
    }
    
    // 添加音量滑块事件监听
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            setVolume(this.value / 100);
        });
        
        // 初始化音量
        setVolume(volumeSlider.value / 100);
    }
    
    // 添加进度条滑块事件监听
    if (progressSlider) {
        progressSlider.addEventListener('input', function() {
            const seekTime = (this.value / 100) * audioPlayer.duration;
            updateProgressBar(this.value);
            
            // 在拖动过程中暂存进度值，不立即跳转
            savedProgress = this.value;
        });
        
        progressSlider.addEventListener('change', function() {
            if (audioPlayer.duration) {
                const seekTime = (savedProgress / 100) * audioPlayer.duration;
                audioPlayer.currentTime = seekTime;
                
                // 如果是暂停状态下拖动，更新时间显示
                if (audioPlayer.paused) {
                    updateTimeDisplay(seekTime, audioPlayer.duration);
                }
            }
        });
    }
    
    // 添加音频事件监听
    audioPlayer.addEventListener('timeupdate', function() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            // 只有当不在拖动状态时才更新进度条
            if (!progressSlider.matches(':active')) {
                updateProgressBar(progress);
            }
            updateTimeDisplay(audioPlayer.currentTime, audioPlayer.duration);
        }
    });
    
    audioPlayer.addEventListener('ended', function() {
        if (isRepeat) {
            // 单曲循环
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            // 播放下一首
            playNext();
        }
    });
    
    audioPlayer.addEventListener('durationchange', function() {
        if (audioPlayer.duration) {
            updateTimeDisplay(audioPlayer.currentTime, audioPlayer.duration);
        }
    });
    
    // 更新播放按钮状态
    audioPlayer.addEventListener('play', function() {
        isPlaying = true;
        if (playPauseBtn) {
            playPauseBtn.classList.add('is-playing');
            playPauseBtn.setAttribute('aria-label', '暂停');
        }
    });
    
    audioPlayer.addEventListener('pause', function() {
        isPlaying = false;
        if (playPauseBtn) {
            playPauseBtn.classList.remove('is-playing');
            playPauseBtn.setAttribute('aria-label', '播放');
        }
    });
    
    // 处理加载错误
    audioPlayer.addEventListener('error', function() {
        alert('音频加载失败，请稍后重试');
        console.error('Audio error:', audioPlayer.error);
    });
}

/**
 * 播放音乐
 * @param {number} musicId - 音乐ID
 */
function playMusic(musicId) {
    // 查找音乐数据
    const musicToPlay = musicData.find(music => music.id == musicId);
    if (!musicToPlay) return;
    
    // 检查这首歌是否已经在播放列表中
    const existingIndex = playlist.findIndex(item => item.id == musicId);
    
    if (existingIndex === -1) {
        // 如果不在播放列表中，添加到播放列表
        playlist.push(musicToPlay);
        currentTrackIndex = playlist.length - 1;
    } else {
        // 如果已经在播放列表中，直接播放那一首
        currentTrackIndex = existingIndex;
    }
    
    // 加载并播放音乐
    loadTrack(currentTrackIndex);
    
    // 更新播放列表UI - 包括桌面和移动设备
    updatePlaylistUI();
    updateMobilePlaylistUI();
    
    // 确保播放器可见
    showMusicPlayer();
}

/**
 * 加载音轨
 * @param {number} index - 音轨索引
 */
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    // 获取当前音轨
    const track = playlist[index];
    
    // 更新当前播放的音轨索引
    currentTrackIndex = index;
    
    // 更新音频源
    audioPlayer.src = track.url;
    
    // 更新桌面版UI
    const trackTitle = document.getElementById('current-track-title');
    const trackArtist = document.getElementById('current-track-artist');
    const trackCover = document.getElementById('current-track-cover');
    
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (trackCover) trackCover.src = track.cover;
    
    // 更新移动版UI
    const mobileTitle = document.getElementById('mobile-track-title');
    const mobileArtist = document.getElementById('mobile-track-artist');
    const mobileCover = document.getElementById('mobile-track-cover');
    const mobileExpandedTitle = document.getElementById('mobile-expanded-title');
    const mobileExpandedArtist = document.getElementById('mobile-expanded-artist');
    const mobileExpandedCover = document.getElementById('mobile-expanded-cover');
    
    if (mobileTitle) mobileTitle.textContent = track.title;
    if (mobileArtist) mobileArtist.textContent = track.artist;
    if (mobileCover) mobileCover.src = track.cover;
    if (mobileExpandedTitle) mobileExpandedTitle.textContent = track.title;
    if (mobileExpandedArtist) mobileExpandedArtist.textContent = track.artist;
    if (mobileExpandedCover) mobileExpandedCover.src = track.cover;
    
    // 播放音乐
    audioPlayer.play().catch(error => {
        console.error('播放失败:', error);
        alert('自动播放失败，请手动点击播放按钮');
    });
    
    // 更新播放列表项高亮
    highlightCurrentTrack();
}

/**
 * 切换播放/暂停状态
 */
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play().catch(error => {
            console.error('播放失败:', error);
        });
    } else {
        audioPlayer.pause();
    }
}

/**
 * 播放下一首
 */
function playNext() {
    if (playlist.length === 0) return;
    
    let nextIndex;
    
    if (isShuffle) {
        // 随机播放模式
        nextIndex = Math.floor(Math.random() * playlist.length);
        // 确保不重复播放当前歌曲
        while (nextIndex === currentTrackIndex && playlist.length > 1) {
            nextIndex = Math.floor(Math.random() * playlist.length);
        }
    } else {
        // 顺序播放模式
        nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    loadTrack(nextIndex);
}

/**
 * 播放上一首
 */
function playPrevious() {
    if (playlist.length === 0) return;
    
    let prevIndex;
    
    if (isShuffle) {
        // 随机播放模式
        prevIndex = Math.floor(Math.random() * playlist.length);
        // 确保不重复播放当前歌曲
        while (prevIndex === currentTrackIndex && playlist.length > 1) {
            prevIndex = Math.floor(Math.random() * playlist.length);
        }
    } else {
        // 顺序播放模式
        prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }
    
    loadTrack(prevIndex);
}

/**
 * 切换随机播放状态
 */
function toggleShuffle() {
    isShuffle = !isShuffle;
}

/**
 * 切换循环播放状态
 */
function toggleRepeat() {
    isRepeat = !isRepeat;
}

/**
 * 切换静音状态
 */
function toggleMute() {
    isMuted = !isMuted;
    audioPlayer.muted = isMuted;
}

/**
 * 设置音量
 * @param {number} value - 音量值 (0-1)
 */
function setVolume(value) {
    audioPlayer.volume = value;
    // 如果设置了音量，取消静音状态
    if (value > 0) {
        isMuted = false;
        audioPlayer.muted = false;
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            muteBtn.classList.remove('is-muted');
            muteBtn.setAttribute('aria-label', '静音');
        }
    }
}

/**
 * 更新进度条
 * @param {number} progress - 进度值 (0-100)
 */
function updateProgressBar(progress) {
    const progressBarInner = document.getElementById('progress-bar-inner');
    const progressSlider = document.getElementById('progress-slider');
    
    if (progressBarInner) progressBarInner.style.width = `${progress}%`;
    if (progressSlider && !progressSlider.matches(':active')) progressSlider.value = progress;
}

/**
 * 更新时间显示
 * @param {number} currentTime - 当前时间(秒)
 * @param {number} duration - 总时间(秒)
 */
function updateTimeDisplay(currentTime, duration) {
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    
    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentTime);
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(duration);
}

/**
 * 格式化时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间
 */
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/**
 * 更新播放列表UI
 */
function updatePlaylistUI() {
    const playlistItems = document.getElementById('playlist-items');
    if (!playlistItems) return;
    
    // 清空当前列表
    playlistItems.innerHTML = '';
    
    if (playlist.length === 0) {
        // 如果播放列表为空
        playlistItems.innerHTML = '<li class="playlist-empty">暂无歌曲</li>';
        return;
    }
    
    // 添加播放列表项
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        if (index === currentTrackIndex) {
            li.classList.add('playlist-item-active');
        }
        
        li.innerHTML = `
            <div class="playlist-cover">
                <img src="${track.cover}" alt="${track.title}的封面">
            </div>
            <div class="playlist-details">
                <p class="playlist-title">${track.title}</p>
                <p class="playlist-artist">${track.artist}</p>
            </div>
        `;
        
        li.addEventListener('click', function() {
            loadTrack(index);
        });
        
        playlistItems.appendChild(li);
    });
}

/**
 * 高亮当前播放的音轨
 */
function highlightCurrentTrack() {
    const playlistItems = document.querySelectorAll('#playlist-items li');
    playlistItems.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('playlist-item-active');
        } else {
            item.classList.remove('playlist-item-active');
        }
    });
}

/**
 * 初始化音乐播放器展开/收起功能
 */
function initPlayerToggle() {
    // 侧边栏播放器切换
    const playerSidebar = document.getElementById('music-player-sidebar');
    const playerToggleBtn = document.getElementById('player-toggle-btn');
    
    if (playerSidebar && playerToggleBtn) {
        playerToggleBtn.addEventListener('click', function() {
            playerSidebar.classList.toggle('collapsed');
        });
    }
    
    // 移动设备播放器展开/收起
    const mobilePlayer = document.getElementById('mobile-player');
    const mobileExpandBtn = document.getElementById('mobile-player-expand-btn');
    const mobileCollapseBtn = document.getElementById('mobile-player-collapse-btn');
    
    if (mobilePlayer && mobileExpandBtn && mobileCollapseBtn) {
        mobileExpandBtn.addEventListener('click', function() {
            mobilePlayer.classList.add('expanded');
            document.body.style.overflow = 'hidden'; // 阻止背景滚动
        });
        
        mobileCollapseBtn.addEventListener('click', function() {
            mobilePlayer.classList.remove('expanded');
            document.body.style.overflow = ''; // 恢复背景滚动
        });
    }
    
    // 同步移动设备和侧边栏播放器状态
    function syncPlayersState() {
        // 获取桌面播放器信息
        const desktopTitle = document.getElementById('current-track-title');
        const desktopArtist = document.getElementById('current-track-artist');
        const desktopCover = document.getElementById('current-track-cover');
        
        // 获取移动播放器信息元素
        const mobileTitle = document.getElementById('mobile-track-title');
        const mobileArtist = document.getElementById('mobile-track-artist');
        const mobileCover = document.getElementById('mobile-track-cover');
        const mobileExpandedTitle = document.getElementById('mobile-expanded-title');
        const mobileExpandedArtist = document.getElementById('mobile-expanded-artist');
        const mobileExpandedCover = document.getElementById('mobile-expanded-cover');
        
        // 同步数据
        if (desktopTitle && mobileTitle) mobileTitle.textContent = desktopTitle.textContent;
        if (desktopArtist && mobileArtist) mobileArtist.textContent = desktopArtist.textContent;
        if (desktopCover && mobileCover) mobileCover.src = desktopCover.src;
        if (desktopTitle && mobileExpandedTitle) mobileExpandedTitle.textContent = desktopTitle.textContent;
        if (desktopArtist && mobileExpandedArtist) mobileExpandedArtist.textContent = desktopArtist.textContent;
        if (desktopCover && mobileExpandedCover) mobileExpandedCover.src = desktopCover.src;
        
        // 同步播放状态
        const mobilePlayBtn = document.getElementById('mobile-play-pause-btn');
        const mobileFullPlayBtn = document.getElementById('mobile-full-play-pause-btn');
        
        if (mobilePlayBtn) {
            if (isPlaying) {
                mobilePlayBtn.classList.add('is-playing');
                mobilePlayBtn.setAttribute('aria-label', '暂停');
            } else {
                mobilePlayBtn.classList.remove('is-playing');
                mobilePlayBtn.setAttribute('aria-label', '播放');
            }
        }
        
        if (mobileFullPlayBtn) {
            if (isPlaying) {
                mobileFullPlayBtn.classList.add('is-playing');
                mobileFullPlayBtn.setAttribute('aria-label', '暂停');
            } else {
                mobileFullPlayBtn.classList.remove('is-playing');
                mobileFullPlayBtn.setAttribute('aria-label', '播放');
            }
        }
    }
    
    // 监听播放器状态变化
    if (audioPlayer) {
        audioPlayer.addEventListener('play', syncPlayersState);
        audioPlayer.addEventListener('pause', syncPlayersState);
        audioPlayer.addEventListener('timeupdate', function() {
            // 同步进度条
            const mobileProgressInner = document.getElementById('mobile-progress-inner');
            const mobileProgressSlider = document.getElementById('mobile-progress-slider');
            const mobileCurrentTime = document.getElementById('mobile-current-time');
            const mobileTotalTime = document.getElementById('mobile-total-time');
            
            if (audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                
                if (mobileProgressInner) mobileProgressInner.style.width = `${progress}%`;
                if (mobileProgressSlider && !mobileProgressSlider.matches(':active')) mobileProgressSlider.value = progress;
                if (mobileCurrentTime) mobileCurrentTime.textContent = formatTime(audioPlayer.currentTime);
                if (mobileTotalTime) mobileTotalTime.textContent = formatTime(audioPlayer.duration);
            }
        });
    }
    
    // 绑定移动设备播放器控制按钮
    const mobilePlayPauseBtn = document.getElementById('mobile-play-pause-btn');
    const mobileFullPlayPauseBtn = document.getElementById('mobile-full-play-pause-btn');
    const mobilePrevBtn = document.getElementById('mobile-prev-btn');
    const mobileNextBtn = document.getElementById('mobile-next-btn');
    const mobileShuffleBtn = document.getElementById('mobile-shuffle-btn');
    const mobileRepeatBtn = document.getElementById('mobile-repeat-btn');
    const mobileProgressSlider = document.getElementById('mobile-progress-slider');
    
    if (mobilePlayPauseBtn) {
        mobilePlayPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (mobileFullPlayPauseBtn) {
        mobileFullPlayPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (mobilePrevBtn) {
        mobilePrevBtn.addEventListener('click', playPrevious);
    }
    
    if (mobileNextBtn) {
        mobileNextBtn.addEventListener('click', playNext);
    }
    
    if (mobileShuffleBtn) {
        mobileShuffleBtn.addEventListener('click', function() {
            toggleShuffle();
            this.classList.toggle('active', isShuffle);
            
            // 同步桌面版状态
            const desktopShuffleBtn = document.getElementById('shuffle-btn');
            if (desktopShuffleBtn) {
                desktopShuffleBtn.classList.toggle('active', isShuffle);
            }
        });
    }
    
    if (mobileRepeatBtn) {
        mobileRepeatBtn.addEventListener('click', function() {
            toggleRepeat();
            this.classList.toggle('active', isRepeat);
            
            // 同步桌面版状态
            const desktopRepeatBtn = document.getElementById('repeat-btn');
            if (desktopRepeatBtn) {
                desktopRepeatBtn.classList.toggle('active', isRepeat);
            }
        });
    }
    
    if (mobileProgressSlider) {
        mobileProgressSlider.addEventListener('input', function() {
            // 保存进度值，不立即跳转
            savedProgress = this.value;
            
            // 更新移动端进度条显示
            const mobileProgressInner = document.getElementById('mobile-progress-inner');
            if (mobileProgressInner) {
                mobileProgressInner.style.width = `${this.value}%`;
            }
        });
        
        mobileProgressSlider.addEventListener('change', function() {
            if (audioPlayer.duration) {
                const seekTime = (savedProgress / 100) * audioPlayer.duration;
                audioPlayer.currentTime = seekTime;
                
                // 同步桌面进度条
                updateProgressBar(savedProgress);
                
                // 如果是暂停状态下拖动，更新时间显示
                if (audioPlayer.paused) {
                    updateTimeDisplay(seekTime, audioPlayer.duration);
                }
            }
        });
    }
}

/**
 * 确保播放器可见
 */
function showMusicPlayer() {
    // 如果是桌面视图，展开侧边栏
    const playerSidebar = document.getElementById('music-player-sidebar');
    if (playerSidebar && window.innerWidth > 992) {
        playerSidebar.classList.remove('collapsed');
    }
    
    // 如果是移动视图，确保播放器可见
    const mobilePlayer = document.getElementById('mobile-player');
    if (mobilePlayer && window.innerWidth <= 992) {
        mobilePlayer.classList.add('active');
        
        // 可选：自动展开移动播放器
        // mobilePlayer.classList.add('expanded');
        // document.body.style.overflow = 'hidden';
    }
}

/**
 * 更新移动端播放列表UI
 */
function updateMobilePlaylistUI() {
    const mobilePlaylistItems = document.getElementById('mobile-playlist-items');
    if (!mobilePlaylistItems) return;
    
    // 清空当前列表
    mobilePlaylistItems.innerHTML = '';
    
    if (playlist.length === 0) {
        // 如果播放列表为空
        mobilePlaylistItems.innerHTML = '<li class="mobile-playlist-empty">暂无歌曲</li>';
        return;
    }
    
    // 添加播放列表项
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        if (index === currentTrackIndex) {
            li.classList.add('playlist-item-active');
        }
        
        li.innerHTML = `
            <div class="playlist-info">
                <p class="playlist-title">${track.title}</p>
                <p class="playlist-artist">${track.artist}</p>
            </div>
        `;
        
        li.addEventListener('click', function() {
            loadTrack(index);
        });
        
        mobilePlaylistItems.appendChild(li);
    });
} 
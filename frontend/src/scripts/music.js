// 音乐页面脚本

// 示例音乐数据
const sampleMusicData = [
  {
    id: 1,
    title: "夏日微风",
    artist: "海岸线乐队",
    album: "夏日回忆",
    genre: "indie",
    duration: "3:45",
    coverUrl: "assets/images/sample-cover-1.jpg",
    releaseDate: "2023-06-15",
    isPopular: true,
    plays: 15420
  },
  {
    id: 2,
    title: "霓虹灯下",
    artist: "电子梦想家",
    album: "城市夜景",
    genre: "electronic",
    duration: "4:12",
    coverUrl: "assets/images/sample-cover-2.jpg",
    releaseDate: "2023-04-22",
    isPopular: true,
    plays: 8732
  },
  {
    id: 3,
    title: "山间小路",
    artist: "自然之声",
    album: "大自然的呼唤",
    genre: "ambient",
    duration: "5:30",
    coverUrl: "assets/images/sample-cover-3.jpg",
    releaseDate: "2023-02-10",
    isPopular: false,
    plays: 4251
  },
  {
    id: 4,
    title: "爵士咖啡馆",
    artist: "醇香爵士团",
    album: "午后时光",
    genre: "jazz",
    duration: "6:18",
    coverUrl: "assets/images/sample-cover-4.jpg",
    releaseDate: "2023-05-08",
    isPopular: true,
    plays: 12089
  },
  {
    id: 5,
    title: "电吉他摇滚",
    artist: "烈火乐队",
    album: "热血青春",
    genre: "rock",
    duration: "4:05",
    coverUrl: "assets/images/sample-cover-5.jpg",
    releaseDate: "2023-03-17",
    isPopular: false,
    plays: 6742
  },
  {
    id: 6,
    title: "说唱新世代",
    artist: "都市说唱人",
    album: "街头故事",
    genre: "hiphop",
    duration: "3:28",
    coverUrl: "assets/images/sample-cover-6.jpg",
    releaseDate: "2023-07-01",
    isPopular: true,
    plays: 18965
  }
];

// 当前筛选的音乐类型
let currentGenre = 'all';

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化音乐列表
  loadMusicData();
  
  // 初始化类别切换
  initGenreFilter();
  
  // 初始化搜索功能
  initSearchFunction();
  
  // 初始化播放功能
  initPlayFunctions();
  
  // 初始化底部播放器
  initBottomPlayer();
});

// 加载音乐数据
function loadMusicData(searchTerm = '') {
  const musicGrid = document.getElementById('music-grid');
  if (!musicGrid) return;
  
  // 清空当前内容
  musicGrid.innerHTML = '';
  
  // 筛选数据
  let filteredMusic = sampleMusicData;
  
  // 按类别筛选
  if (currentGenre !== 'all') {
    filteredMusic = filteredMusic.filter(track => track.genre === currentGenre);
  }
  
  // 按搜索词筛选
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredMusic = filteredMusic.filter(track => 
      track.title.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term) ||
      track.album.toLowerCase().includes(term)
    );
  }
  
  // 检查是否有结果
  if (filteredMusic.length === 0) {
    musicGrid.innerHTML = `
      <div class="no-results">
        <p>没有找到匹配的音乐。</p>
      </div>
    `;
    return;
  }
  
  // 创建音乐卡片并添加到网格
  filteredMusic.forEach(track => {
    const musicCard = createMusicCard(track);
    musicGrid.appendChild(musicCard);
  });
}

// 创建音乐卡片
function createMusicCard(track) {
  const card = document.createElement('div');
  card.className = 'music-card';
  card.dataset.id = track.id;
  
  // 使用默认封面图如果没有提供
  const coverImg = track.coverUrl || 'assets/images/default-cover.jpg';
  
  card.innerHTML = `
    <div class="music-cover">
      <img src="${coverImg}" alt="${track.title}">
      <div class="play-overlay">
        <button class="play-btn" data-id="${track.id}">
          <i class="fas fa-play"></i>
        </button>
      </div>
      ${track.isPopular ? '<span class="popular-badge">热门</span>' : ''}
    </div>
    <div class="music-info">
      <h3>${track.title}</h3>
      <p class="artist">${track.artist}</p>
      <div class="music-meta">
        <span class="album">${track.album}</span>
        <span class="duration">${track.duration}</span>
      </div>
      <div class="music-stats">
        <span class="plays"><i class="fas fa-headphones"></i> ${track.plays.toLocaleString()}</span>
        <button class="add-to-playlist" title="添加到播放列表">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// 初始化类别过滤器
function initGenreFilter() {
  const genreTabs = document.querySelectorAll('.genre-tab');
  
  genreTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 移除所有活动类
      genreTabs.forEach(t => t.classList.remove('active'));
      
      // 添加活动类到当前标签
      tab.classList.add('active');
      
      // 更新当前类型并重新加载数据
      currentGenre = tab.dataset.genre || 'all';
      loadMusicData();
    });
  });
}

// 初始化搜索功能
function initSearchFunction() {
  const searchForm = document.getElementById('music-search-form');
  const searchInput = document.getElementById('music-search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      loadMusicData(searchTerm);
    });
    
    // 实时搜索 (可选，取决于用户体验需求)
    searchInput.addEventListener('input', debounce(() => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        loadMusicData(searchTerm);
      }
    }, 300));
  }
}

// 初始化播放功能
function initPlayFunctions() {
  document.addEventListener('click', (e) => {
    // 查找最近的播放按钮
    const playBtn = e.target.closest('.play-btn');
    if (playBtn) {
      const trackId = playBtn.dataset.id;
      playMusic(trackId);
    }
    
    // 查找添加到播放列表按钮
    const addToPlaylistBtn = e.target.closest('.add-to-playlist');
    if (addToPlaylistBtn) {
      const trackId = addToPlaylistBtn.closest('.music-card').dataset.id;
      addToPlaylist(trackId);
      
      // 防止事件冒泡触发卡片点击
      e.stopPropagation();
    }
  });
  
  // 点击卡片也可以播放
  const musicCards = document.querySelectorAll('.music-card');
  musicCards.forEach(card => {
    card.addEventListener('click', () => {
      const trackId = card.dataset.id;
      playMusic(trackId);
    });
  });
}

// 播放音乐
function playMusic(trackId) {
  console.log(`播放音乐ID: ${trackId}`);
  
  // 查找音乐数据
  const track = sampleMusicData.find(t => t.id == trackId);
  if (track) {
    // 更新播放器UI
    updatePlayerUI(track);
    
    // 显示底部播放器
    const playerSidebar = document.getElementById('music-player-sidebar');
    playerSidebar.classList.remove('hidden');
    
    // 模拟播放状态
    togglePlayState(true);
  }
}

// 更新播放器UI
function updatePlayerUI(track) {
  // 更新主播放器
  document.getElementById('current-track-title').textContent = track.title;
  document.getElementById('current-track-artist').textContent = track.artist;
  
  // 设置封面图
  const coverUrl = track.coverUrl || 'assets/images/default-cover.jpg';
  document.getElementById('current-track-cover').src = coverUrl;
  
  // 更新移动端播放器
  document.getElementById('mobile-track-title').textContent = track.title;
  document.getElementById('mobile-track-artist').textContent = track.artist;
  document.getElementById('mobile-track-cover').src = coverUrl;
  document.getElementById('mobile-expanded-title').textContent = track.title;
  document.getElementById('mobile-expanded-artist').textContent = track.artist;
  document.getElementById('mobile-expanded-cover').src = coverUrl;
}

// 初始化底部播放器
function initBottomPlayer() {
  // 播放/暂停按钮
  const playPauseBtn = document.getElementById('play-pause-btn');
  const mobilePlayPauseBtn = document.getElementById('mobile-play-pause-btn');
  const mobileFullPlayPauseBtn = document.getElementById('mobile-full-play-pause-btn');
  
  // 音量控制
  const volumeBtn = document.getElementById('volume-btn');
  const volumeSlider = document.getElementById('volume-slider');
  
  // 进度条
  const progressSlider = document.getElementById('progress-slider');
  const progressBarInner = document.getElementById('progress-bar-inner');
  
  // 播放/暂停按钮点击事件
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      const isPlaying = playPauseBtn.parentElement.classList.contains('is-playing');
      togglePlayState(!isPlaying);
    });
  }
  
  // 移动端播放/暂停按钮
  if (mobilePlayPauseBtn) {
    mobilePlayPauseBtn.addEventListener('click', () => {
      const isPlaying = mobilePlayPauseBtn.classList.contains('is-playing');
      togglePlayState(!isPlaying);
    });
  }
  
  if (mobileFullPlayPauseBtn) {
    mobileFullPlayPauseBtn.addEventListener('click', () => {
      const isPlaying = mobileFullPlayPauseBtn.classList.contains('is-playing');
      togglePlayState(!isPlaying);
    });
  }
  
  // 音量控制
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      volumeBtn.classList.toggle('is-muted');
      volumeSlider.value = volumeBtn.classList.contains('is-muted') ? 0 : 80;
    });
  }
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (parseInt(volumeSlider.value) === 0) {
        volumeBtn.classList.add('is-muted');
      } else {
        volumeBtn.classList.remove('is-muted');
      }
    });
  }
  
  // 进度条更新 (模拟)
  if (progressSlider) {
    progressSlider.addEventListener('input', () => {
      const value = progressSlider.value;
      updateProgressBar(value);
    });
  }
  
  // 扩展移动端播放器
  const expandBtn = document.getElementById('mobile-player-expand-btn');
  const collapseBtn = document.getElementById('mobile-player-collapse-btn');
  const mobilePlayer = document.getElementById('mobile-player');
  
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      mobilePlayer.classList.add('expanded');
    });
  }
  
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      mobilePlayer.classList.remove('expanded');
    });
  }
  
  // 模拟进度条更新
  simulateProgressUpdate();
}

// 切换播放状态
function togglePlayState(isPlaying) {
  // 主播放器按钮
  const playPauseBtn = document.getElementById('play-pause-btn');
  if (playPauseBtn) {
    playPauseBtn.parentElement.classList.toggle('is-playing', isPlaying);
  }
  
  // 移动端播放按钮
  const mobilePlayPauseBtn = document.getElementById('mobile-play-pause-btn');
  if (mobilePlayPauseBtn) {
    mobilePlayPauseBtn.classList.toggle('is-playing', isPlaying);
  }
  
  const mobileFullPlayPauseBtn = document.getElementById('mobile-full-play-pause-btn');
  if (mobileFullPlayPauseBtn) {
    mobileFullPlayPauseBtn.classList.toggle('is-playing', isPlaying);
  }
  
  // 切换播放/暂停状态
  if (window.musicAudio) {
    if (isPlaying) {
      window.musicAudio.play();
    } else {
      window.musicAudio.pause();
    }
  }
}

// 更新进度条
function updateProgressBar(value) {
  const progressBarInner = document.getElementById('progress-bar-inner');
  const mobileProgressInner = document.getElementById('mobile-progress-inner');
  const currentTimeEl = document.getElementById('current-time');
  const mobileCurrentTimeEl = document.getElementById('mobile-current-time');
  
  if (progressBarInner) {
    progressBarInner.style.width = `${value}%`;
  }
  
  if (mobileProgressInner) {
    mobileProgressInner.style.width = `${value}%`;
  }
  
  // 更新时间显示
  if (currentTimeEl && window.musicAudio) {
    const duration = window.musicAudio.duration || 100;
    const currentTime = (value / 100) * duration;
    currentTimeEl.textContent = formatTime(currentTime);
    
    if (mobileCurrentTimeEl) {
      mobileCurrentTimeEl.textContent = formatTime(currentTime);
    }
  }
}

// 格式化时间
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 模拟进度条更新
function simulateProgressUpdate() {
  let progress = 0;
  const updateInterval = setInterval(() => {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const isPlaying = playPauseBtn && playPauseBtn.parentElement.classList.contains('is-playing');
    
    if (isPlaying) {
      progress += 0.5;
      if (progress > 100) {
        progress = 0;
        togglePlayState(false);
      }
      
      // 更新所有进度条
      const progressSlider = document.getElementById('progress-slider');
      const mobileProgressSlider = document.getElementById('mobile-progress-slider');
      
      if (progressSlider) progressSlider.value = progress;
      if (mobileProgressSlider) mobileProgressSlider.value = progress;
      
      updateProgressBar(progress);
    }
  }, 1000);
}

// 添加到播放列表
function addToPlaylist(trackId) {
  console.log(`添加到播放列表: ${trackId}`);
  
  // 示例: 查找音乐数据
  const track = sampleMusicData.find(t => t.id == trackId);
  if (track) {
    // 显示一个通知
    alert(`已添加到播放列表: ${track.title}`);
  }
}

// 辅助函数: 防抖
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 
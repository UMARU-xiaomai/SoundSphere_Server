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
  // 这里应该实现实际的播放功能
  // 例如更新播放器界面，加载音频等
  
  // 示例: 查找音乐数据
  const track = sampleMusicData.find(t => t.id == trackId);
  if (track) {
    // 显示一个通知或更新播放器UI
    alert(`正在播放: ${track.title} - ${track.artist}`);
  }
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
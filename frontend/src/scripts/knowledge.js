// 知识页面脚本

// 示例文章数据
const sampleArticles = [
  {
    id: 1,
    title: "音乐制作中情感表达的艺术",
    content: "音乐不仅仅是声音的组合，更是一种情感的表达。一首好的音乐作品能够触动听众的心灵，引起共鸣。本文将探讨如何在音乐制作中注入真实的情感，从旋律、和声、编曲到混音的各个环节，帮助音乐人创作出更有感染力的作品。\n\n## 旋律与情感\n\n旋律是音乐中最直接表达情感的元素。不同的音程、节奏和走向能够传达不同的情绪。上行的旋律往往给人积极向上的感觉，而下行的旋律则可能传达忧伤或平静的情绪。\n\n## 和声的色彩\n\n和声为旋律提供了情感的背景和深度。大三和弦通常给人明亮、愉悦的感觉，而小三和弦则往往带有忧郁或神秘的色彩。七和弦和其他扩展和弦能够增加情感的复杂性和层次感。\n\n## 编曲与情感动态\n\n通过精心的编曲，可以创造情感的起伏和高潮。乐器的选择、音域的变化、力度的对比都能有效地塑造作品的情感动态。\n\n## 混音中的情感处理\n\n混音不仅是技术活，也是情感的艺术。通过空间效果、动态处理、音色调整等手段，可以进一步强化或塑造作品的情感表达。",
    author: {
      id: 101,
      name: "音乐心理学家",
      avatar: "assets/images/avatars/author1.jpg"
    },
    coverPath: "assets/images/blog/emotion-in-music.jpg",
    category: "音乐理论",
    tags: ["情感表达", "作曲技巧", "编曲", "混音"],
    publishDate: new Date(2023, 6, 15),
    views: 2456,
    likes: 183,
    commentsCount: 42,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    title: "如何创建完美的混音空间",
    content: "在音乐制作中，创建一个三维的声音空间是混音工程师面临的最大挑战之一。本文将分享一些专业技巧，帮助你在混音中创建自然、有深度的声音空间，让各个元素和谐共存。\n\n## 空间定位的基础\n\n声音的空间感主要来自三个维度：左右（声像），前后（深度），上下（频率）。掌握这三个维度的调整技巧是创建出色混音的基础。\n\n## 混响的艺术\n\n混响是创造空间感的主要工具。不同类型的混响（房间、大厅、板式、弹簧等）能够创造不同的空间感受。本文将详细介绍如何选择和设置混响参数，以及如何避免常见的混响错误。\n\n## 延迟效果的运用\n\n相比混响，延迟提供了更多的创意可能性。从简单的单声道延迟到复杂的多重延迟，如何巧妙地使用延迟来增强空间感和音乐律动？\n\n## 立体声拓宽技术\n\n如何让你的混音听起来更宽广，更有包围感？本节将介绍几种实用的立体声拓宽技术，以及它们适用的场景。",
    author: {
      id: 102,
      name: "混音大师",
      avatar: "assets/images/avatars/author2.jpg"
    },
    coverPath: "assets/images/blog/mixing-space.jpg",
    category: "混音技巧",
    tags: ["混音", "空间感", "混响", "延迟效果"],
    publishDate: new Date(2023, 5, 28),
    views: 3189,
    likes: 245,
    commentsCount: 56,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: 3,
    title: "采样的艺术：从挑选到处理",
    content: "采样是现代音乐制作中不可或缺的一部分，无论是电子音乐、嘻哈、还是流行音乐。本文将带你深入了解采样的世界，从如何寻找优质采样素材，到处理和整合采样，创作出独具个性的音乐作品。\n\n## 寻找灵感的来源\n\n从唱片店到数字音乐平台，从专业采样库到现场录音，采样的素材无处不在。如何训练自己的耳朵，发现那些有潜力的声音片段？\n\n## 法律与伦理考量\n\n采样涉及版权问题。本节将讨论音乐采样的法律框架，如何合法地使用采样，以及如何避免潜在的版权纠纷。\n\n## 采样处理技巧\n\n原始采样往往需要处理才能融入你的作品。从时间伸缩、音高调整、到声音设计，本节将介绍一系列让采样声音转变为你自己的技巧。\n\n## 创造性地使用采样\n\n采样不只是简单地复制粘贴。如何创造性地使用采样，让它成为作品中有机的一部分，而不仅仅是生硬的拼接？",
    author: {
      id: 103,
      name: "电子音乐制作人",
      avatar: "assets/images/avatars/author3.jpg"
    },
    coverPath: "assets/images/blog/sampling-art.jpg",
    category: "制作技巧",
    tags: ["采样", "音频处理", "电子音乐", "创作技巧"],
    publishDate: new Date(2023, 7, 5),
    views: 1876,
    likes: 156,
    commentsCount: 38,
    isLiked: false,
    isBookmarked: true
  },
  {
    id: 4,
    title: "音乐版权入门指南",
    content: "在数字时代，了解音乐版权变得越来越重要。本文将为音乐创作者提供一个版权基础知识指南，帮助你保护自己的作品，并在商业环境中合法地使用他人的音乐。\n\n## 版权的基本概念\n\n什么是版权？它如何自动应用于你的创作？本节将解释版权法的基础知识，以及它如何特别适用于音乐作品。\n\n## 音乐版权的两个方面\n\n音乐版权通常分为两个部分：作曲版权和录音版权。了解这两者的区别对于任何从事音乐创作的人来说都至关重要。\n\n## 如何注册版权\n\n虽然版权是自动的，但注册它可以提供额外的法律保护。本节将指导你完成音乐作品版权注册的步骤。\n\n## 版权的商业利用\n\n从许可到发行协议，了解如何通过你的音乐版权获得收入，以及如何避免常见的版权陷阱。",
    author: {
      id: 104,
      name: "音乐律师",
      avatar: "assets/images/avatars/author4.jpg"
    },
    coverPath: "assets/images/blog/music-copyright.jpg",
    category: "音乐产业",
    tags: ["版权", "音乐法律", "产业知识", "自我保护"],
    publishDate: new Date(2023, 6, 25),
    views: 2754,
    likes: 210,
    commentsCount: 63,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 5,
    title: "合成器基础：从减法合成开始",
    content: "合成器是现代音乐制作的核心工具之一，但对初学者来说可能显得复杂难懂。本文将从最基础的减法合成开始，带你了解合成器的工作原理和基本参数，为你的音乐制作之旅打下坚实的基础。\n\n## 什么是减法合成？\n\n减法合成是最常见的合成方式，它通过从富泛音的波形中过滤掉不需要的频率来创造声音。本节将解释这一过程的基本原理。\n\n## 合成器的基本组件\n\n振荡器、滤波器、包络发生器和LFO是几乎所有合成器都具备的基本组件。了解它们的功能和相互作用对于掌握合成器至关重要。\n\n## 创建基本声音\n\n从贝斯到打击乐，从背景垫音到效果音，本节将指导你如何使用减法合成创建各种基本的音乐元素。\n\n## 进一步探索\n\n减法合成只是合成领域的入门。本节将简要介绍其他合成技术，如调频合成、加法合成、粒子合成等，为你的声音设计之旅指明进一步的方向。",
    author: {
      id: 105,
      name: "合成器专家",
      avatar: "assets/images/avatars/author5.jpg"
    },
    coverPath: "assets/images/blog/synthesizer-basics.jpg",
    category: "乐器与设备",
    tags: ["合成器", "减法合成", "声音设计", "电子音乐"],
    publishDate: new Date(2023, 7, 12),
    views: 2103,
    likes: 178,
    commentsCount: 45,
    isLiked: true,
    isBookmarked: true
  },
  {
    id: 6,
    title: "在家录音：打造专业级家庭工作室",
    content: "随着技术的发展，在家录制专业品质的音乐已经成为可能。本文将指导你如何在有限的预算内打造一个功能齐全的家庭录音工作室，从硬件设备的选择到声学处理，帮助你实现专业级的录音效果。\n\n## 基本设备清单\n\n从计算机到音频接口，从麦克风到监听系统，本节将介绍一个功能完整的家庭工作室所需的基本设备，并提供不同预算下的选择建议。\n\n## 房间声学处理\n\n良好的声学环境是录音成功的关键。本节将解释声学原理的基础知识，并提供一些实用的房间处理方法，帮助你在普通房间中实现较好的录音环境。\n\n## 录音技巧与流程\n\n设备齐全后，如何有效地使用它们进行录音？本节将分享一些实用的录音技巧，以及一个可靠的录音工作流程。\n\n## 后期处理基础\n\n录音完成后，还需要进行编辑和混音。本节将介绍一些基本的后期处理技巧，帮助你提升录音的最终质量。",
    author: {
      id: 106,
      name: "录音工程师",
      avatar: "assets/images/avatars/author6.jpg"
    },
    coverPath: "assets/images/blog/home-studio.jpg",
    category: "录音技术",
    tags: ["家庭工作室", "录音设备", "声学处理", "录音技巧"],
    publishDate: new Date(2023, 6, 8),
    views: 3421,
    likes: 267,
    commentsCount: 78,
    isLiked: false,
    isBookmarked: false
  }
];

// 示例标签数据
const sampleTags = [
  { name: "混音", count: 24 },
  { name: "作曲技巧", count: 35 },
  { name: "音乐理论", count: 18 },
  { name: "录音技巧", count: 29 },
  { name: "电子音乐", count: 42 },
  { name: "声音设计", count: 15 },
  { name: "乐器演奏", count: 31 },
  { name: "音乐产业", count: 13 },
  { name: "软件教程", count: 26 },
  { name: "硬件评测", count: 20 }
];

// 当前用户收藏的文章ID
const bookmarkedArticleIds = [3, 5];

// 当前用户喜欢的文章ID
const likedArticleIds = [2, 5];

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化文章列表
  loadArticles();
  
  // 初始化标签云
  loadTags();
  
  // 初始化选项卡切换
  initTabs();
  
  // 初始化分类筛选
  initCategoryFilters();
  
  // 初始化搜索功能
  initSearchFunction();
});

// 加载文章列表
function loadArticles(filters = {}) {
  const articlesContainer = document.getElementById('articles-container') || document.querySelector('.post-list');
  if (!articlesContainer) return;
  
  // 清空当前内容
  articlesContainer.innerHTML = '';
  
  // 筛选文章
  let filteredArticles = sampleArticles;
  
  // 按标签筛选
  if (filters.tag) {
    filteredArticles = filteredArticles.filter(article => 
      article.tags.includes(filters.tag)
    );
  }
  
  // 按分类筛选
  if (filters.category) {
    filteredArticles = filteredArticles.filter(article => 
      article.category === filters.category
    );
  }
  
  // 按标签列表筛选
  if (filters.tags && filters.tags.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      filters.tags.some(tag => article.tags.includes(tag))
    );
  }
  
  // 按搜索词筛选
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(term) ||
      article.content.toLowerCase().includes(term) ||
      article.author.name.toLowerCase().includes(term) ||
      article.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  // 按标签筛选
  if (filters.tab === 'bookmarks') {
    filteredArticles = filteredArticles.filter(article => 
      bookmarkedArticleIds.includes(article.id)
    );
  }
  
  // 排序
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filteredArticles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        break;
      case 'popular':
        filteredArticles.sort((a, b) => b.views - a.views);
        break;
      case 'mostLiked':
        filteredArticles.sort((a, b) => b.likes - a.likes);
        break;
    }
  } else {
    // 默认按发布日期排序
    filteredArticles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }
  
  // 检查是否有结果
  if (filteredArticles.length === 0) {
    articlesContainer.innerHTML = `
      <div class="no-results">
        <p>没有找到匹配的文章。</p>
        <button id="clear-filters" class="btn btn-secondary">清除筛选</button>
      </div>
    `;
    
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        loadArticles({}); // 重置筛选
        
        // 重置UI元素
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        const allArticlesBtn = document.querySelector('[data-tab="all"]');
        if (allArticlesBtn) allArticlesBtn.classList.add('active');
        
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => tab.classList.remove('active'));
        
        const allCategoriesTab = document.querySelector('.category-tab[data-category="all"]');
        if (allCategoriesTab) allCategoriesTab.classList.add('active');
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
      });
    }
    
    return;
  }
  
  // 创建文章卡片并添加到容器
  filteredArticles.forEach(article => {
    // 检查文章是否被收藏
    article.isBookmarked = bookmarkedArticleIds.includes(article.id);
    
    // 检查文章是否被喜欢
    article.isLiked = likedArticleIds.includes(article.id);
    
    const articleCard = createArticleCard(article);
    articlesContainer.appendChild(articleCard);
  });
  
  // 初始化文章交互
  initArticleInteractions();
}

// 加载标签云
function loadTags() {
  const tagsContainer = document.getElementById('tags-container');
  if (!tagsContainer) return;
  
  // 清空当前内容
  tagsContainer.innerHTML = '';
  
  // 创建标签并添加到容器
  sampleTags.forEach(tag => {
    const tagElement = document.createElement('a');
    tagElement.href = '#';
    tagElement.className = 'tag';
    tagElement.textContent = `${tag.name} (${tag.count})`;
    tagElement.dataset.tag = tag.name;
    
    tagsContainer.appendChild(tagElement);
  });
  
  // 添加标签点击事件
  const tagLinks = tagsContainer.querySelectorAll('.tag');
  tagLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = link.dataset.tag;
      
      // 高亮选中的标签
      tagLinks.forEach(t => t.classList.remove('active'));
      link.classList.add('active');
      
      // 按标签筛选文章
      loadArticles({ tag });
    });
  });
}

// 创建文章卡片
function createArticleCard(article) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = article.id;
  
  // 获取文章摘要
  const excerpt = getExcerpt(article.content, 200);
  
  card.innerHTML = `
    ${article.coverPath ? `
      <div class="post-image">
        <img src="${article.coverPath}" alt="${article.title}">
        <div class="post-category">${article.category}</div>
      </div>
    ` : ''}
    <div class="post-content">
      <h3><a href="#" class="post-title">${article.title}</a></h3>
      <div class="post-meta">
        <div class="author">
          <img src="${article.author.avatar}" alt="${article.author.name}">
          <span>${article.author.name}</span>
        </div>
        <span class="post-date">${formatDate(article.publishDate)}</span>
      </div>
      <p class="post-excerpt">${excerpt}</p>
      <div class="post-tags">
        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="post-stats">
        <span class="views"><i class="fas fa-eye"></i> ${article.views.toLocaleString()}</span>
        <button class="${article.isLiked ? 'like-btn active' : 'like-btn'}" data-id="${article.id}">
          <i class="${article.isLiked ? 'fas fa-heart' : 'far fa-heart'}"></i>
          <span>${article.likes.toLocaleString()}</span>
        </button>
        <button class="${article.isBookmarked ? 'bookmark-btn active' : 'bookmark-btn'}" data-id="${article.id}">
          <i class="${article.isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
        </button>
        <span class="comments"><i class="fas fa-comment"></i> ${article.commentsCount.toLocaleString()}</span>
      </div>
    </div>
  `;
  
  return card;
}

// 初始化文章交互
function initArticleInteractions() {
  // 文章卡片点击
  const articleCards = document.querySelectorAll('.post-card');
  articleCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleId = parseInt(card.dataset.id);
      viewArticle(articleId);
    });
    
    // 阻止按钮点击事件冒泡
    const buttons = card.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
    
    // 标题链接点击
    const titleLink = card.querySelector('.post-title');
    if (titleLink) {
      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = parseInt(card.dataset.id);
        viewArticle(articleId);
      });
    }
  });
  
  // 喜欢按钮点击
  const likeButtons = document.querySelectorAll('.like-btn');
  likeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const articleId = parseInt(button.dataset.id);
      toggleLike(button, articleId);
    });
  });
  
  // 收藏按钮点击
  const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
  bookmarkButtons.forEach(button => {
    button.addEventListener('click', () => {
      const articleId = parseInt(button.dataset.id);
      toggleBookmark(button, articleId);
    });
  });
}

// 初始化选项卡切换
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有活动类
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // 添加活动类到当前按钮
      button.classList.add('active');
      
      // 获取标签值
      const tab = button.dataset.tab;
      
      // 重新加载带筛选的文章
      loadArticles({ tab });
    });
  });
}

// 初始化分类筛选
function initCategoryFilters() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 移除所有活动类
      categoryTabs.forEach(t => t.classList.remove('active'));
      
      // 添加活动类到当前标签
      tab.classList.add('active');
      
      // 获取分类值
      const category = tab.dataset.category;
      
      // 重新加载带筛选的文章
      loadArticles({ category: category === 'all' ? null : category });
    });
  });
}

// 初始化搜索功能
function initSearchFunction() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      loadArticles({ searchTerm });
    });
    
    // 实时搜索 (可选)
    searchInput.addEventListener('input', debounce(() => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        loadArticles({ searchTerm });
      }
    }, 500));
  }
}

// 查看文章详情
function viewArticle(articleId) {
  const article = sampleArticles.find(a => a.id === articleId);
  
  if (article) {
    // 增加浏览次数
    article.views += 1;
    
    // 这里应该跳转到文章详情页
    alert(`正在查看文章: ${article.title}`);
    
    // 实际应用中这里应该跳转到文章详情页
    // window.location.href = `/knowledge/article/${articleId}`;
  }
}

// 切换喜欢状态
function toggleLike(button, articleId) {
  const article = sampleArticles.find(a => a.id === articleId);
  const likeCountElement = button.querySelector('span');
  const heartIcon = button.querySelector('i');
  
  if (!article) return;
  
  // 更新状态
  if (button.classList.contains('active')) {
    // 取消喜欢
    button.classList.remove('active');
    article.likes -= 1;
    article.isLiked = false;
    
    // 从喜欢列表中移除
    const index = likedArticleIds.indexOf(articleId);
    if (index !== -1) {
      likedArticleIds.splice(index, 1);
    }
    
    // 更新图标
    heartIcon.className = 'far fa-heart';
  } else {
    // 添加喜欢
    button.classList.add('active');
    article.likes += 1;
    article.isLiked = true;
    
    // 添加到喜欢列表
    if (!likedArticleIds.includes(articleId)) {
      likedArticleIds.push(articleId);
    }
    
    // 更新图标
    heartIcon.className = 'fas fa-heart';
  }
  
  // 更新计数
  likeCountElement.textContent = article.likes.toLocaleString();
}

// 切换收藏状态
function toggleBookmark(button, articleId) {
  const article = sampleArticles.find(a => a.id === articleId);
  const bookmarkIcon = button.querySelector('i');
  
  if (!article) return;
  
  // 更新状态
  if (button.classList.contains('active')) {
    // 取消收藏
    button.classList.remove('active');
    article.isBookmarked = false;
    
    // 从收藏列表中移除
    const index = bookmarkedArticleIds.indexOf(articleId);
    if (index !== -1) {
      bookmarkedArticleIds.splice(index, 1);
    }
    
    // 更新图标
    bookmarkIcon.className = 'far fa-bookmark';
  } else {
    // 添加收藏
    button.classList.add('active');
    article.isBookmarked = true;
    
    // 添加到收藏列表
    if (!bookmarkedArticleIds.includes(articleId)) {
      bookmarkedArticleIds.push(articleId);
    }
    
    // 更新图标
    bookmarkIcon.className = 'fas fa-bookmark';
  }
  
  // 如果当前在收藏标签页，需要重新加载文章列表
  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab && activeTab.dataset.tab === 'bookmarks') {
    loadArticles({ tab: 'bookmarks' });
  }
}

// 辅助函数：获取文章摘要
function getExcerpt(content, maxLength = 200) {
  if (!content) return '';
  
  // 移除Markdown标记
  let plainText = content.replace(/#{1,6}\s?([^\n]+)/g, '$1') // 标题
                         .replace(/\*\*([^*]+)\*\*/g, '$1') // 粗体
                         .replace(/\*([^*]+)\*/g, '$1') // 斜体
                         .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
                         .replace(/```[\s\S]*?```/g, '') // 代码块
                         .replace(/`([^`]+)`/g, '$1'); // 行内代码
  
  // 截断文本
  if (plainText.length <= maxLength) return plainText;
  
  // 截取到最后一个完整单词
  const truncated = plainText.substring(0, maxLength);
  return truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(' '))) + '...';
}

// 辅助函数：格式化日期
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
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
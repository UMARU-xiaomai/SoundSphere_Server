// 市场页面脚本

// 示例产品数据
const sampleProducts = [
  {
    id: 1,
    name: "电子音乐制作完整包",
    description: "包含50个高质量的电子音乐样本，10个合成器预设，5个完整项目文件",
    price: 149.99,
    originalPrice: 199.99,
    type: "Bundle",
    seller: "电子音乐工作室",
    coverUrl: "assets/images/products/electronic-bundle.jpg",
    rating: 4.8,
    ratingCount: 124,
    salesCount: 1289,
    featured: true
  },
  {
    id: 2,
    name: "现代流行鼓组合集",
    description: "为流行音乐制作者打造的专业鼓组样本，包含各种风格的鼓点和打击乐",
    price: 79.99,
    type: "Sample",
    seller: "节奏大师",
    coverUrl: "assets/images/products/drum-kit.jpg",
    rating: 4.5,
    ratingCount: 89,
    salesCount: 761
  },
  {
    id: 3,
    name: "氛围钢琴音色",
    description: "富有情感的钢琴音色，完美适合制作氛围音乐、电影配乐或情感旋律",
    price: 49.99,
    type: "Preset",
    seller: "钢琴家工作室",
    coverUrl: "assets/images/products/piano-preset.jpg",
    rating: 4.9,
    ratingCount: 56,
    salesCount: 432
  },
  {
    id: 4,
    name: "说唱节奏loop包",
    description: "包含50个现代说唱和陷阱风格的loop循环，可直接拖入你的DAW使用",
    price: 29.99,
    originalPrice: 39.99,
    type: "Loop",
    seller: "节拍工厂",
    coverUrl: "assets/images/products/hiphop-loops.jpg",
    rating: 4.3,
    ratingCount: 112,
    salesCount: 948
  },
  {
    id: 5,
    name: "电影音效库",
    description: "超过1000个专业录制的音效，适用于电影、游戏和多媒体项目",
    price: 199.99,
    type: "SoundFX",
    seller: "声音设计师",
    coverUrl: "assets/images/products/sfx-library.jpg",
    rating: 4.7,
    ratingCount: 38,
    salesCount: 215,
    featured: true
  },
  {
    id: 6,
    name: "弦乐合奏MIDI包",
    description: "古典和现代风格的弦乐MIDI文件合集，可与任何虚拟乐器一起使用",
    price: 39.99,
    type: "MIDI",
    seller: "古典制作人",
    coverUrl: "assets/images/products/strings-midi.jpg",
    rating: 4.6,
    ratingCount: 47,
    salesCount: 328
  }
];

// 示例购物车
let cart = [];

// 示例用户订单
const sampleOrders = [
  {
    id: "ORD-001",
    date: new Date(2023, 6, 15),
    items: [sampleProducts[0]],
    total: 149.99,
    status: "已完成"
  },
  {
    id: "ORD-002",
    date: new Date(2023, 7, 3),
    items: [sampleProducts[2], sampleProducts[3]],
    total: 79.98,
    status: "已完成"
  }
];

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化产品展示
  loadProducts();
  
  // 初始化分类筛选
  initCategoryFilters();
  
  // 初始化排序功能
  initSortOptions();
  
  // 初始化搜索功能
  initSearchFunction();
  
  // 初始化购物车功能
  initCartFunctions();
});

// 加载产品数据
function loadProducts(filters = {}) {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;
  
  // 清空当前内容
  productsGrid.innerHTML = '';
  
  // 筛选数据
  let filteredProducts = sampleProducts;
  
  // 按分类筛选
  if (filters.category && filters.category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.type === filters.category);
  }
  
  // 按价格筛选
  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
  }
  
  // 按搜索词筛选
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.seller.toLowerCase().includes(term) ||
      product.type.toLowerCase().includes(term)
    );
  }
  
  // 排序
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'priceAsc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // 假设ID越大越新
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
  
  // 检查是否有结果
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-results">
        <p>没有找到匹配的产品。</p>
        <button id="clear-filters" class="btn btn-secondary">清除筛选</button>
      </div>
    `;
    
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        loadProducts({}); // 重置筛选
        
        // 重置UI元素
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => item.classList.remove('active'));
        
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'newest';
        
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        
        const searchInput = document.getElementById('product-search');
        if (searchInput) searchInput.value = '';
      });
    }
    
    return;
  }
  
  // 创建产品卡片并添加到网格
  filteredProducts.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });
  
  // 初始化产品交互
  initProductInteractions();
}

// 创建产品卡片
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;
  
  // 使用默认封面图如果没有提供
  const coverImg = product.coverUrl || 'assets/images/default-product.jpg';
  
  card.innerHTML = `
    <div class="product-image">
      <img src="${coverImg}" alt="${product.name}">
      <div class="product-category">${product.type}</div>
      <div class="product-actions">
        <button class="preview-btn" data-id="${product.id}">
          <i class="fas fa-play"></i> 预览
        </button>
        <button class="wishlist-btn" data-id="${product.id}">
          <i class="far fa-heart"></i>
        </button>
      </div>
      ${product.featured ? '<div class="featured-badge">精选</div>' : ''}
    </div>
    <div class="product-content">
      <h3>${product.name}</h3>
      <p class="product-seller">由 ${product.seller} 出品</p>
      <div class="product-meta">
        <div class="product-rating">
          ${generateRatingStars(product.rating)}
          <span>${product.rating} (${product.ratingCount})</span>
        </div>
        <div class="product-price">
          ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
          <span class="price">¥${product.price.toFixed(2)}</span>
        </div>
      </div>
      <button class="btn btn-primary btn-full add-to-cart-btn" data-id="${product.id}">
        <i class="fas fa-cart-plus"></i> 添加到购物车
      </button>
    </div>
  `;
  
  return card;
}

// 生成星级评分HTML
function generateRatingStars(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // 添加实心星星
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  
  // 添加半星
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // 添加空心星星
  const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  
  return starsHtml;
}

// 初始化分类筛选
function initCategoryFilters() {
  const categoryItems = document.querySelectorAll('.category-item');
  
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      // 移除所有活动类
      categoryItems.forEach(cat => cat.classList.remove('active'));
      
      // 添加活动类到当前项
      item.classList.add('active');
      
      // 获取分类值
      const category = item.dataset.category || 'all';
      
      // 重新加载带筛选的产品
      loadProducts({ category });
    });
  });
}

// 初始化排序选项
function initSortOptions() {
  const sortSelect = document.getElementById('sort-select');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      loadProducts({ sortBy });
    });
  }
}

// 初始化搜索功能
function initSearchFunction() {
  const searchForm = document.getElementById('product-search-form');
  const searchInput = document.getElementById('product-search');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      loadProducts({ searchTerm });
    });
  }
}

// 初始化价格筛选
function initPriceFilter() {
  const applyPriceBtn = document.getElementById('apply-price-filter');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  
  if (applyPriceBtn && minPriceInput && maxPriceInput) {
    applyPriceBtn.addEventListener('click', () => {
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
      
      loadProducts({ minPrice, maxPrice });
    });
  }
}

// 初始化产品交互
function initProductInteractions() {
  // 添加到购物车按钮
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止事件冒泡
      
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
    });
  });
  
  // 预览按钮
  const previewButtons = document.querySelectorAll('.preview-btn');
  
  previewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止事件冒泡
      
      const productId = parseInt(button.dataset.id);
      previewProduct(productId);
    });
  });
  
  // 收藏按钮
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  
  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止事件冒泡
      
      const productId = parseInt(button.dataset.id);
      toggleWishlist(button, productId);
    });
  });
  
  // 产品卡片点击
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const productId = parseInt(card.dataset.id);
      viewProductDetail(productId);
    });
  });
}

// 初始化购物车功能
function initCartFunctions() {
  // 更新购物车计数
  updateCartCount();
  
  // 购物车图标点击
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      toggleCartDropdown();
    });
  }
}

// 添加到购物车
function addToCart(productId) {
  const product = sampleProducts.find(p => p.id === productId);
  
  if (product) {
    // 检查购物车中是否已有此产品
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        coverUrl: product.coverUrl
      });
    }
    
    // 更新购物车UI
    updateCartCount();
    
    // 显示添加成功提示
    showNotification(`${product.name} 已添加到购物车`);
  }
}

// 更新购物车计数
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  
  if (cartCountElement) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    if (totalItems > 0) {
      cartCountElement.classList.remove('hidden');
    } else {
      cartCountElement.classList.add('hidden');
    }
  }
}

// 切换购物车下拉菜单
function toggleCartDropdown() {
  const cartDropdown = document.getElementById('cart-dropdown');
  
  if (cartDropdown) {
    cartDropdown.classList.toggle('show');
    
    if (cartDropdown.classList.contains('show')) {
      updateCartDropdown();
    }
  }
}

// 更新购物车下拉内容
function updateCartDropdown() {
  const cartDropdown = document.getElementById('cart-dropdown');
  
  if (cartDropdown) {
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    
    if (cart.length === 0) {
      cartContent.innerHTML = `
        <div class="empty-cart">
          <p>购物车是空的</p>
        </div>
      `;
    } else {
      let cartItemsHtml = '';
      let totalPrice = 0;
      
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        cartItemsHtml += `
          <div class="cart-item">
            <img src="${item.coverUrl || 'assets/images/default-product.jpg'}" alt="${item.name}">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>¥${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-from-cart" data-id="${item.id}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      });
      
      cartContent.innerHTML = `
        <div class="cart-items">
          ${cartItemsHtml}
        </div>
        <div class="cart-total">
          <p>总计: <span>¥${totalPrice.toFixed(2)}</span></p>
          <button class="btn btn-primary checkout-btn">去结算</button>
        </div>
      `;
    }
    
    // 替换现有内容
    cartDropdown.innerHTML = '';
    cartDropdown.appendChild(cartContent);
    
    // 添加移除按钮事件
    const removeButtons = cartDropdown.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = parseInt(button.dataset.id);
        removeFromCart(productId);
      });
    });
    
    // 添加结算按钮事件
    const checkoutBtn = cartDropdown.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        checkout();
      });
    }
  }
}

// 从购物车移除
function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    const item = cart[itemIndex];
    
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    
    // 更新购物车UI
    updateCartCount();
    updateCartDropdown();
  }
}

// 结算
function checkout() {
  if (cart.length === 0) {
    showNotification('购物车是空的');
    return;
  }
  
  // 这里应该跳转到结算页面或显示结算模态框
  showNotification('正在前往结算页面...');
  
  // 模拟结算成功
  setTimeout(() => {
    // 添加到订单
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000)}`,
      date: new Date(),
      items: [...cart],
      total: totalPrice,
      status: '处理中'
    };
    
    sampleOrders.push(newOrder);
    
    // 清空购物车
    cart = [];
    updateCartCount();
    
    // 关闭下拉菜单
    const cartDropdown = document.getElementById('cart-dropdown');
    if (cartDropdown) {
      cartDropdown.classList.remove('show');
    }
    
    // 显示成功消息
    showNotification('订单已成功提交!');
  }, 1500);
}

// 预览产品
function previewProduct(productId) {
  const product = sampleProducts.find(p => p.id === productId);
  
  if (product) {
    // 这里应该显示预览模态框或播放音频
    showNotification(`正在预览: ${product.name}`);
  }
}

// 切换收藏状态
function toggleWishlist(button, productId) {
  // 切换图标
  const heartIcon = button.querySelector('i');
  
  if (heartIcon.classList.contains('far')) {
    heartIcon.classList.remove('far');
    heartIcon.classList.add('fas');
    heartIcon.style.color = '#e74c3c';
    
    showNotification('已添加到收藏');
  } else {
    heartIcon.classList.remove('fas');
    heartIcon.classList.add('far');
    heartIcon.style.color = '';
    
    showNotification('已从收藏中移除');
  }
}

// 查看产品详情
function viewProductDetail(productId) {
  const product = sampleProducts.find(p => p.id === productId);
  
  if (product) {
    // 这里应该跳转到产品详情页或显示详情模态框
    showNotification(`正在查看: ${product.name} 的详细信息`);
  }
}

// 显示通知
function showNotification(message) {
  // 检查是否已有通知元素
  let notification = document.getElementById('notification');
  
  if (!notification) {
    // 创建通知元素
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // 设置消息
  notification.textContent = message;
  notification.classList.add('active');
  
  // 3秒后隐藏
  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
} 
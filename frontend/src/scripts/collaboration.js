// 协作页面脚本

// 示例项目数据
const sampleProjects = [
  {
    id: 1,
    name: "电子舞曲合作项目",
    description: "正在创作一首现代电子舞曲，需要合成器专家和鼓点制作人",
    owner: {
      id: 101,
      name: "电子音乐制作人",
      avatar: "assets/images/avatars/user1.jpg"
    },
    members: [
      {
        id: 101,
        name: "电子音乐制作人",
        role: "Owner",
        avatar: "assets/images/avatars/user1.jpg"
      },
      {
        id: 102,
        name: "混音大师",
        role: "Member",
        avatar: "assets/images/avatars/user2.jpg"
      }
    ],
    privacy: "public",
    created: new Date(2023, 5, 15),
    lastActivity: new Date(2023, 7, 3),
    deadline: new Date(2023, 8, 30),
    filesCount: 8,
    tags: ["电子", "舞曲", "协作"],
    status: "active",
    hasNewActivity: true
  },
  {
    id: 2,
    name: "流行歌曲编曲",
    description: "为现有旋律创作编曲，需要键盘手、吉他手和编曲",
    owner: {
      id: 103,
      name: "流行音乐制作人",
      avatar: "assets/images/avatars/user3.jpg"
    },
    members: [
      {
        id: 103,
        name: "流行音乐制作人",
        role: "Owner",
        avatar: "assets/images/avatars/user3.jpg"
      },
      {
        id: 104,
        name: "键盘手",
        role: "Member",
        avatar: "assets/images/avatars/user4.jpg"
      },
      {
        id: 105,
        name: "吉他手",
        role: "Member",
        avatar: "assets/images/avatars/user5.jpg"
      }
    ],
    privacy: "private",
    created: new Date(2023, 6, 12),
    lastActivity: new Date(2023, 7, 10),
    deadline: new Date(2023, 8, 15),
    filesCount: 12,
    tags: ["流行", "编曲", "合作"],
    status: "active",
    hasNewActivity: false
  },
  {
    id: 3,
    name: "电影配乐项目",
    description: "为独立短片创作原创配乐，需要管弦乐编曲和音效设计",
    owner: {
      id: 106,
      name: "电影配乐师",
      avatar: "assets/images/avatars/user6.jpg"
    },
    members: [
      {
        id: 106,
        name: "电影配乐师",
        role: "Owner",
        avatar: "assets/images/avatars/user6.jpg"
      },
      {
        id: 107,
        name: "管弦乐编曲",
        role: "Member",
        avatar: "assets/images/avatars/user7.jpg"
      },
      {
        id: 108,
        name: "音效设计师",
        role: "Admin",
        avatar: "assets/images/avatars/user8.jpg"
      },
      {
        id: 109,
        name: "混音工程师",
        role: "Viewer",
        avatar: "assets/images/avatars/user9.jpg"
      }
    ],
    privacy: "public",
    created: new Date(2023, 4, 20),
    lastActivity: new Date(2023, 7, 8),
    deadline: new Date(2023, 9, 5),
    filesCount: 24,
    tags: ["配乐", "电影", "管弦乐"],
    status: "active",
    hasNewActivity: true
  },
  {
    id: 4,
    name: "爵士四重奏录制",
    description: "爵士四重奏现场录制项目，需要钢琴、贝斯、萨克斯和鼓手",
    owner: {
      id: 110,
      name: "爵士乐制作人",
      avatar: "assets/images/avatars/user10.jpg"
    },
    members: [
      {
        id: 110,
        name: "爵士乐制作人",
        role: "Owner",
        avatar: "assets/images/avatars/user10.jpg"
      },
      {
        id: 111,
        name: "钢琴演奏者",
        role: "Member",
        avatar: "assets/images/avatars/user11.jpg"
      }
    ],
    privacy: "private",
    created: new Date(2023, 6, 5),
    lastActivity: new Date(2023, 7, 5),
    deadline: null,
    filesCount: 6,
    tags: ["爵士", "录音", "四重奏"],
    status: "active",
    hasNewActivity: false
  }
];

// 示例邀请数据
const sampleInvitations = [
  {
    id: 1,
    projectId: 1,
    projectName: "电子舞曲合作项目",
    inviterId: 101,
    inviterName: "电子音乐制作人",
    role: "Member",
    createdAt: new Date(2023, 7, 5)
  },
  {
    id: 2,
    projectId: 3,
    projectName: "电影配乐项目",
    inviterId: 106,
    inviterName: "电影配乐师",
    role: "Admin",
    createdAt: new Date(2023, 7, 8)
  }
];

// 模拟当前用户ID
const currentUserId = 101;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化项目列表
  loadProjects();
  
  // 初始化邀请列表
  loadInvitations();
  
  // 初始化创建项目表单
  initProjectForm();
  
  // 初始化筛选功能
  initFilterOptions();
  
  // 初始化搜索功能
  initSearchFunction();
});

// 加载项目数据
function loadProjects(filters = {}) {
  const projectsContainer = document.querySelector('.projects-grid') || document.querySelector('.room-cards');
  if (!projectsContainer) return;
  
  // 清空当前内容
  projectsContainer.innerHTML = '';
  
  // 筛选数据
  let filteredProjects = sampleProjects;
  
  // 根据标签筛选
  if (filters.tab === 'my-projects') {
    // 我参与的项目(当前用户是成员的项目)
    filteredProjects = filteredProjects.filter(project => 
      project.members.some(member => member.id === currentUserId)
    );
  } else if (filters.tab === 'public-projects') {
    // 公开项目
    filteredProjects = filteredProjects.filter(project => project.privacy === 'public');
  }
  
  // 根据隐私设置筛选
  if (filters.privacy) {
    filteredProjects = filteredProjects.filter(project => project.privacy === filters.privacy);
  }
  
  // 按搜索词筛选
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredProjects = filteredProjects.filter(project => 
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  // 检查是否有结果
  if (filteredProjects.length === 0) {
    projectsContainer.innerHTML = `
      <div class="no-results">
        <p>没有找到匹配的项目。</p>
        <button id="clear-filters" class="btn btn-secondary">清除筛选</button>
      </div>
    `;
    
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        loadProjects({}); // 重置筛选
        
        // 重置UI元素
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        const myProjectsBtn = document.querySelector('[data-tab="my-projects"]');
        if (myProjectsBtn) myProjectsBtn.classList.add('active');
        
        const searchInput = document.getElementById('project-search');
        if (searchInput) searchInput.value = '';
      });
    }
    
    return;
  }
  
  // 创建项目卡片并添加到容器
  filteredProjects.forEach(project => {
    const projectCard = createProjectCard(project);
    projectsContainer.appendChild(projectCard);
  });
  
  // 初始化项目卡片交互
  initProjectCardInteractions();
}

// 加载邀请列表
function loadInvitations() {
  const invitationsContainer = document.getElementById('invitations-container');
  if (!invitationsContainer) return;
  
  // 过滤当前用户的邀请
  const userInvitations = sampleInvitations;
  
  // 清空当前内容
  invitationsContainer.innerHTML = '';
  
  // 检查是否有邀请
  if (userInvitations.length === 0) {
    invitationsContainer.innerHTML = '<p class="no-invitations">您没有待处理的邀请。</p>';
    return;
  }
  
  // 创建邀请卡片
  userInvitations.forEach(invitation => {
    const invitationCard = createInvitationCard(invitation);
    invitationsContainer.appendChild(invitationCard);
  });
}

// 创建项目卡片
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.id = project.id;
  
  // 检查当前用户是否为项目所有者
  const isOwner = project.owner.id === currentUserId;
  
  // 计算剩余天数
  const daysRemaining = project.deadline ? getDaysRemaining(project.deadline) : null;
  
  // 获取成员数量
  const memberCount = project.members.length;
  
  card.innerHTML = `
    <div class="project-header">
      <h3>${project.name}</h3>
      <div class="project-badges">
        ${project.privacy === 'private' ? 
          '<span class="badge badge-private"><i class="fas fa-lock"></i> 私密</span>' : 
          '<span class="badge badge-public"><i class="fas fa-globe"></i> 公开</span>'
        }
        ${project.hasNewActivity ? 
          '<span class="badge badge-activity"><i class="fas fa-bell"></i> 新活动</span>' : ''}
      </div>
    </div>
    <p class="project-description">${project.description}</p>
    <div class="project-meta">
      <div class="meta-item">
        <i class="fas fa-users"></i> ${memberCount} 成员
      </div>
      <div class="meta-item">
        <i class="fas fa-file-alt"></i> ${project.filesCount} 文件
      </div>
      ${daysRemaining !== null ? `
        <div class="meta-item ${getDaysRemainingClass(daysRemaining)}">
          <i class="fas fa-clock"></i> ${formatDaysRemaining(daysRemaining)}
        </div>
      ` : ''}
    </div>
    <div class="project-tags">
      ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div class="project-footer">
      <div class="last-activity">
        上次活动: ${formatDate(project.lastActivity)}
      </div>
      <div class="project-actions">
        ${isOwner ? `
          <button class="btn btn-edit" data-id="${project.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-delete" data-id="${project.id}">
            <i class="fas fa-trash"></i>
          </button>
        ` : `
          <button class="btn btn-join" data-id="${project.id}">
            进入项目
          </button>
        `}
      </div>
    </div>
  `;
  
  return card;
}

// 创建邀请卡片
function createInvitationCard(invitation) {
  const card = document.createElement('div');
  card.className = 'invitation-card';
  card.dataset.id = invitation.id;
  
  card.innerHTML = `
    <div class="invitation-info">
      <h3>${invitation.projectName}</h3>
      <p>邀请者: ${invitation.inviterName}</p>
      <p>角色: ${formatRole(invitation.role)}</p>
      <p>邀请时间: ${formatDate(invitation.createdAt)}</p>
    </div>
    <div class="invitation-actions">
      <button class="btn btn-accept" data-id="${invitation.id}">接受</button>
      <button class="btn btn-decline" data-id="${invitation.id}">拒绝</button>
    </div>
  `;
  
  return card;
}

// 初始化项目表单
function initProjectForm() {
  const projectForm = document.getElementById('project-form');
  if (!projectForm) return;
  
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(projectForm);
    const projectData = {
      name: formData.get('name'),
      description: formData.get('description'),
      privacy: formData.get('privacy'),
      deadline: formData.get('deadline') ? new Date(formData.get('deadline')) : null
    };
    
    // 验证表单数据
    if (!projectData.name) {
      showNotification('请输入项目名称', 'error');
      return;
    }
    
    // 创建项目
    createProject(projectData);
    
    // 重置表单
    projectForm.reset();
    
    // 关闭模态框
    const modal = projectForm.closest('.modal');
    if (modal) {
      closeModal(modal);
    }
  });
}

// 创建项目
function createProject(projectData) {
  // 创建新项目
  const newProject = {
    id: sampleProjects.length + 1,
    name: projectData.name,
    description: projectData.description || '无描述',
    owner: {
      id: currentUserId,
      name: "当前用户",
      avatar: "assets/images/avatars/user1.jpg"
    },
    members: [
      {
        id: currentUserId,
        name: "当前用户",
        role: "Owner",
        avatar: "assets/images/avatars/user1.jpg"
      }
    ],
    privacy: projectData.privacy || 'private',
    created: new Date(),
    lastActivity: new Date(),
    deadline: projectData.deadline,
    filesCount: 0,
    tags: [],
    status: 'active',
    hasNewActivity: false
  };
  
  // 添加到项目列表
  sampleProjects.push(newProject);
  
  // 重新加载项目列表
  loadProjects({ tab: 'my-projects' });
  
  // 显示成功通知
  showNotification('项目创建成功', 'success');
}

// 初始化项目卡片交互
function initProjectCardInteractions() {
  // 加入项目按钮
  const joinButtons = document.querySelectorAll('.btn-join');
  
  joinButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const projectId = parseInt(button.dataset.id);
      joinProject(projectId);
    });
  });
  
  // 编辑项目按钮
  const editButtons = document.querySelectorAll('.btn-edit');
  
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const projectId = parseInt(button.dataset.id);
      editProject(projectId);
    });
  });
  
  // 删除项目按钮
  const deleteButtons = document.querySelectorAll('.btn-delete');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const projectId = parseInt(button.dataset.id);
      deleteProject(projectId);
    });
  });
  
  // 项目卡片点击
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = parseInt(card.dataset.id);
      viewProject(projectId);
    });
  });
  
  // 邀请响应按钮
  const acceptButtons = document.querySelectorAll('.btn-accept');
  const declineButtons = document.querySelectorAll('.btn-decline');
  
  acceptButtons.forEach(button => {
    button.addEventListener('click', () => {
      const invitationId = parseInt(button.dataset.id);
      respondToInvitation(invitationId, true);
    });
  });
  
  declineButtons.forEach(button => {
    button.addEventListener('click', () => {
      const invitationId = parseInt(button.dataset.id);
      respondToInvitation(invitationId, false);
    });
  });
}

// 初始化筛选选项
function initFilterOptions() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有活动类
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // 添加活动类到当前按钮
      button.classList.add('active');
      
      // 获取标签值
      const tab = button.dataset.tab;
      
      // 重新加载带筛选的项目
      loadProjects({ tab });
    });
  });
  
  // 隐私筛选下拉菜单
  const privacyFilter = document.getElementById('privacy-filter');
  
  if (privacyFilter) {
    privacyFilter.addEventListener('change', () => {
      const privacy = privacyFilter.value;
      loadProjects({ privacy: privacy === 'all' ? null : privacy });
    });
  }
}

// 初始化搜索功能
function initSearchFunction() {
  const searchForm = document.getElementById('project-search-form');
  const searchInput = document.getElementById('project-search');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      loadProjects({ searchTerm });
    });
    
    // 实时搜索 (可选)
    searchInput.addEventListener('input', debounce(() => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        loadProjects({ searchTerm });
      }
    }, 300));
  }
}

// 加入项目
function joinProject(projectId) {
  const project = sampleProjects.find(p => p.id === projectId);
  
  if (project) {
    // 检查用户是否已经是项目成员
    if (project.members.some(member => member.id === currentUserId)) {
      showNotification('您已经是项目成员', 'info');
      return;
    }
    
    // 添加用户到项目成员
    project.members.push({
      id: currentUserId,
      name: "当前用户",
      role: "Member",
      avatar: "assets/images/avatars/user1.jpg"
    });
    
    // 重新加载项目列表
    loadProjects();
    
    // 显示成功通知
    showNotification('成功加入项目', 'success');
    
    // 进入项目
    viewProject(projectId);
  }
}

// 编辑项目
function editProject(projectId) {
  const project = sampleProjects.find(p => p.id === projectId);
  
  if (project) {
    // 这里应该打开编辑表单并填充数据
    showNotification(`编辑项目: ${project.name}`, 'info');
  }
}

// 删除项目
function deleteProject(projectId) {
  // 确认删除
  if (!confirm('确定要删除这个项目吗？此操作不可撤销。')) {
    return;
  }
  
  // 查找项目索引
  const projectIndex = sampleProjects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    // 从数组中移除
    sampleProjects.splice(projectIndex, 1);
    
    // 重新加载项目列表
    loadProjects();
    
    // 显示成功通知
    showNotification('项目已删除', 'success');
  }
}

// 查看项目
function viewProject(projectId) {
  const project = sampleProjects.find(p => p.id === projectId);
  
  if (project) {
    // 这里应该跳转到项目详情页
    showNotification(`查看项目: ${project.name}`, 'info');
  }
}

// 响应邀请
function respondToInvitation(invitationId, accept) {
  // 查找邀请索引
  const invitationIndex = sampleInvitations.findIndex(inv => inv.id === invitationId);
  
  if (invitationIndex !== -1) {
    const invitation = sampleInvitations[invitationIndex];
    
    if (accept) {
      // 接受邀请 - 将用户添加到项目成员
      const project = sampleProjects.find(p => p.id === invitation.projectId);
      
      if (project) {
        project.members.push({
          id: currentUserId,
          name: "当前用户",
          role: invitation.role,
          avatar: "assets/images/avatars/user1.jpg"
        });
        
        showNotification(`已接受 ${project.name} 的邀请`, 'success');
      }
    } else {
      showNotification('已拒绝邀请', 'info');
    }
    
    // 从邀请列表中移除
    sampleInvitations.splice(invitationIndex, 1);
    
    // 重新加载邀请和项目列表
    loadInvitations();
    loadProjects();
  }
}

// 辅助函数：计算剩余天数
function getDaysRemaining(deadline) {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 辅助函数：格式化剩余天数显示
function formatDaysRemaining(days) {
  if (days < 0) return '已逾期';
  if (days === 0) return '今日截止';
  return `剩余 ${days} 天`;
}

// 辅助函数：获取剩余天数的CSS类
function getDaysRemainingClass(days) {
  if (days < 0) return 'text-danger';
  if (days <= 3) return 'text-warning';
  return 'text-muted';
}

// 辅助函数：格式化日期
function formatDate(date) {
  if (!date) return '无';
  
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
}

// 辅助函数：格式化角色
function formatRole(role) {
  switch (role) {
    case 'Owner':
      return '所有者';
    case 'Admin':
      return '管理员';
    case 'Member':
      return '成员';
    case 'Viewer':
      return '查看者';
    default:
      return role;
  }
}

// 辅助函数：显示通知
function showNotification(message, type = 'info') {
  // 检查是否已有通知元素
  let notification = document.getElementById('notification');
  
  if (!notification) {
    // 创建通知元素
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // 设置消息和类型
  notification.textContent = message;
  notification.className = `notification notification-${type}`;
  notification.classList.add('active');
  
  // 3秒后隐藏
  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
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

// 辅助函数: 打开/关闭模态框
function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
  }
} 
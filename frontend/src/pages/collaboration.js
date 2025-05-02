import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserFriends, FaComments, FaEdit, FaTrash, FaCheck, FaTimes, FaCalendarAlt, FaFileAlt, FaBell, FaLock, FaLockOpen, FaClock, FaSearch } from 'react-icons/fa';

// 项目创建/编辑表单
const ProjectForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [privacy, setPrivacy] = useState(initialData.privacy || 'private');
  const [deadline, setDeadline] = useState(initialData.deadline || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('项目名称不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projectData = { 
        name, 
        description,
        privacy,
        deadline: deadline || null 
      };
      await onSubmit(projectData);
    } catch (err) {
      setError(err.message || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{initialData.id ? '编辑项目' : '创建新项目'}</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          取消
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">项目名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">项目描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows="4"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">隐私设置</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === 'private'}
                onChange={() => setPrivacy('private')}
                className="mr-2"
              />
              <span className="flex items-center">
                <FaLock className="text-gray-600 mr-1" /> 私密项目
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === 'public'}
                onChange={() => setPrivacy('public')}
                className="mr-2"
              />
              <span className="flex items-center">
                <FaLockOpen className="text-gray-600 mr-1" /> 公开项目
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {privacy === 'private' ? '仅项目成员可以查看和编辑' : '所有人可以查看，仅成员可以编辑'}
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">截止日期 (可选)</label>
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-3 py-2 border rounded-md flex-grow"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center transition"
          disabled={loading}
        >
          {loading ? '提交中...' : (initialData.id ? '更新项目' : '创建项目')}
        </button>
      </form>
    </div>
  );
};

// 项目卡片组件
const ProjectCard = ({ project, isOwner, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };
  
  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = project.deadline ? getDaysRemaining(project.deadline) : null;

  const handleView = () => {
    navigate(`/collaboration/projects/${project.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(project);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个项目吗？')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/collaboration/projects/${project.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (onDelete) onDelete();
      } catch (err) {
        console.error('删除失败', err);
      }
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
      onClick={handleView}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl hover:text-purple-700 transition">{project.name}</h3>
          <div className="flex items-center space-x-1">
            {project.privacy === 'private' ? (
              <FaLock className="text-gray-500" size={14} title="私密项目" />
            ) : (
              <FaLockOpen className="text-gray-500" size={14} title="公开项目" />
            )}
            {project.hasNewActivity && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description || '暂无描述'}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <FaUserFriends className="mr-1" />
            <span>{project.memberCount || 1} 成员</span>
          </div>
          
          {project.filesCount !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <FaFileAlt className="mr-1" />
              <span>{project.filesCount} 文件</span>
            </div>
          )}
          
          {project.deadline && (
            <div className={`flex items-center text-sm ${
              daysRemaining < 0 ? 'text-red-500' : 
              daysRemaining < 3 ? 'text-orange-500' : 'text-gray-500'
            }`}>
              <FaClock className="mr-1" />
              <span>
                {daysRemaining < 0 
                  ? '已逾期' 
                  : daysRemaining === 0 
                    ? '今日截止' 
                    : `还剩 ${daysRemaining} 天`
                }
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {project.lastActivityAt && (
              <div>上次活动: {formatDate(project.lastActivityAt)}</div>
            )}
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button 
                onClick={handleEdit}
                className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                title="编辑"
              >
                <FaEdit size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                title="删除"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 项目成员管理组件
const MemberManagement = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取项目成员
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/collaboration/projects/${projectId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMembers(response.data || []);
      
      // 检查当前用户是否为项目所有者
      const currentUserId = localStorage.getItem('userId');
      const owner = response.data.find(member => member.role === 'Owner');
      setIsOwner(owner && owner.userId === currentUserId);
    } catch (err) {
      console.error('获取成员失败', err);
    }
  };

  // 获取邀请列表
  const fetchInvitations = async () => {
    if (!isOwner) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/collaboration/projects/${projectId}/invitations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInvitations(response.data || []);
    } catch (err) {
      console.error('获取邀请失败', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  useEffect(() => {
    if (isOwner) {
      fetchInvitations();
    }
  }, [isOwner, projectId]);

  // 邀请成员
  const inviteMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/api/collaboration/projects/${projectId}/invite`, 
        { email, role },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setEmail('');
      setRole('Member');
      fetchInvitations();
    } catch (err) {
      setError(err.response?.data?.message || '邀请失败');
    } finally {
      setLoading(false);
    }
  };

  // 移除成员
  const removeMember = async (memberId) => {
    if (!isOwner) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/collaboration/projects/${projectId}/members/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchMembers();
    } catch (err) {
      console.error('移除成员失败', err);
    }
  };

  // 取消邀请
  const cancelInvitation = async (invitationId) => {
    if (!isOwner) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/collaboration/projects/${projectId}/invitations/${invitationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchInvitations();
    } catch (err) {
      console.error('取消邀请失败', err);
    }
  };
  
  // 更改成员角色
  const updateMemberRole = async (memberId, newRole) => {
    if (!isOwner) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/collaboration/projects/${projectId}/members/${memberId}`, 
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchMembers();
    } catch (err) {
      console.error('更新成员角色失败', err);
    }
  };
  
  // 过滤成员
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">项目成员 ({members.length})</h3>
        
        {members.length > 0 && (
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索成员..."
                className="w-full px-3 py-2 pl-10 border rounded-md"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {filteredMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold mr-3">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isOwner && member.role !== 'Owner' && (
                  <select
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.id, e.target.value)}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    <option value="Admin">管理员</option>
                    <option value="Member">成员</option>
                    <option value="Viewer">查看者</option>
                  </select>
                )}
                
                <span className={`text-sm px-2 py-1 rounded-full ${
                  member.role === 'Owner' ? 'bg-yellow-100 text-yellow-800' :
                  member.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                  member.role === 'Viewer' ? 'bg-gray-100 text-gray-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {member.role === 'Owner' ? '所有者' :
                   member.role === 'Admin' ? '管理员' :
                   member.role === 'Viewer' ? '查看者' : '成员'}
                </span>
                
                {isOwner && member.role !== 'Owner' && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="移除成员"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isOwner && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4">邀请新成员</h3>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <form onSubmit={inviteMember} className="space-y-3">
            <div>
              <label className="block text-gray-700 mb-2">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">角色</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Admin">管理员</option>
                <option value="Member">成员</option>
                <option value="Viewer">查看者</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                管理员可以邀请和管理成员，成员可以编辑项目内容，查看者只能查看项目
              </p>
            </div>
            
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? '发送中...' : '发送邀请'}
            </button>
          </form>
          
          {invitations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">待定邀请</h4>
              <div className="space-y-2">
                {invitations.map(invite => (
                  <div key={invite.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm">{invite.email}</p>
                      <p className="text-xs text-gray-500">
                        {invite.role === 'Admin' ? '管理员' :
                         invite.role === 'Viewer' ? '查看者' : '成员'}
                      </p>
                    </div>
                    <button
                      onClick={() => cancelInvitation(invite.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="取消邀请"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 主合作页面
const CollaborationPage = () => {
  const [activeTab, setActiveTab] = useState('my-projects');
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  // 获取我参与的项目
  const fetchMyProjects = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      let url = 'http://localhost:3000/api/collaboration/projects/my';
      
      // 添加搜索和过滤参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (privacyFilter !== 'all') params.append('privacy', privacyFilter);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProjects(response.data || []);
    } catch (err) {
      setError('加载项目失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取公开项目
  const fetchPublicProjects = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:3000/api/collaboration/projects/public';
      
      // 添加搜索参数
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await axios.get(url);
      setProjects(response.data || []);
    } catch (err) {
      setError('加载公开项目失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取项目邀请
  const fetchInvitations = async () => {
    if (!isLoggedIn) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/collaboration/invitations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInvitations(response.data || []);
    } catch (err) {
      console.error('获取邀请失败', err);
    }
  };

  // 初始化加载
  useEffect(() => {
    if (isLoggedIn) {
      fetchMyProjects();
      fetchInvitations();
    } else if (activeTab === 'public-projects') {
      fetchPublicProjects();
    }
  }, [isLoggedIn]);
  
  // 搜索和过滤时更新
  useEffect(() => {
    if (activeTab === 'my-projects' && isLoggedIn) {
      fetchMyProjects();
    } else if (activeTab === 'public-projects') {
      fetchPublicProjects();
    }
  }, [searchTerm, privacyFilter, activeTab]);

  // 创建项目
  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/collaboration/projects', projectData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setShowProjectForm(false);
      fetchMyProjects();
      
      return true;
    } catch (err) {
      console.error('创建项目失败', err);
      throw new Error(err.response?.data?.message || '创建失败');
    }
  };

  // 更新项目
  const handleUpdateProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/collaboration/projects/${editingProject.id}`, projectData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setShowProjectForm(false);
      setEditingProject(null);
      fetchMyProjects();
      
      return true;
    } catch (err) {
      console.error('更新项目失败', err);
      throw new Error(err.response?.data?.message || '更新失败');
    }
  };

  // 处理项目表单提交
  const handleProjectSubmit = async (projectData) => {
    if (editingProject) {
      return handleUpdateProject(projectData);
    } else {
      return handleCreateProject(projectData);
    }
  };

  // 处理邀请响应
  const handleInvitationResponse = async (invitationId, accept) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/api/collaboration/invitations/${invitationId}/respond`, 
        { accept },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      fetchInvitations();
      if (accept) {
        fetchMyProjects();
      }
    } catch (err) {
      console.error('响应邀请失败', err);
    }
  };
  
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPrivacyFilter('all');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">协作项目</h1>
        
        {isLoggedIn && (
          <button
            onClick={() => {
              setEditingProject(null);
              setShowProjectForm(!showProjectForm);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center shadow-sm transition"
          >
            <FaPlus className="mr-2" />
            {showProjectForm ? '取消' : '创建项目'}
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {showProjectForm && (
        <ProjectForm
          initialData={editingProject || {}}
          onSubmit={handleProjectSubmit}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}
      
      {invitations.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaBell className="text-purple-600 mr-2" />
            项目邀请
          </h2>
          <div className="space-y-3">
            {invitations.map(invitation => (
              <div key={invitation.id} className="p-3 bg-purple-50 rounded-md border border-purple-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{invitation.projectName}</p>
                    <p className="text-sm text-gray-600">
                      邀请者: {invitation.inviterName}
                    </p>
                    <p className="text-sm text-gray-600">
                      角色: {
                        invitation.role === 'Admin' ? '管理员' :
                        invitation.role === 'Viewer' ? '查看者' : '成员'
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, true)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm flex items-center"
                    >
                      <FaCheck className="mr-1" /> 接受
                    </button>
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, false)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm flex items-center"
                    >
                      <FaTimes className="mr-1" /> 拒绝
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('my-projects')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'my-projects' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              我的项目
            </button>
          )}
          <button
            onClick={() => {
              setActiveTab('public-projects');
              fetchPublicProjects();
            }}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'public-projects' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            公开项目
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索项目..."
              className="w-full px-3 py-2 pl-10 border rounded-md"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {activeTab === 'my-projects' && (
            <div className="flex items-center space-x-4">
              <select
                value={privacyFilter}
                onChange={(e) => setPrivacyFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">所有项目</option>
                <option value="public">仅公开项目</option>
                <option value="private">仅私密项目</option>
              </select>
              
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-800"
              >
                重置筛选
              </button>
            </div>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === 'my-projects' ? '我的项目' : '公开项目'}
          </h2>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isOwner={project.role === 'Owner'}
                  onEdit={handleEditProject}
                  onDelete={fetchMyProjects}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600 mb-4">
                {activeTab === 'my-projects' 
                  ? '您还没有参与任何项目' 
                  : '暂无公开项目'
                }
              </p>
              {activeTab === 'my-projects' && !showProjectForm && (
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  创建第一个项目
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborationPage;
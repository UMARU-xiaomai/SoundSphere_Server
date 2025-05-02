import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserFriends, FaComments, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

// 项目创建/编辑表单
const ProjectForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
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
      const projectData = { name, description };
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
        
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
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
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={handleView}
    >
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{project.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description || '暂无描述'}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <div className="flex items-center">
              <FaUserFriends className="mr-1" />
              <span>{project.memberCount || 1} 成员</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button 
                onClick={handleEdit}
                className="p-1.5 bg-blue-500 text-white rounded-md"
              >
                <FaEdit size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-red-500 text-white rounded-md"
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

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
        { email },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setEmail('');
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
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/collaboration/invitations/${invitationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchInvitations();
    } catch (err) {
      console.error('取消邀请失败', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">项目成员</h2>
      
      {/* 成员列表 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">当前成员</h3>
        {members.length > 0 ? (
          <ul className="divide-y">
            {members.map(member => (
              <li key={member.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{member.user?.username || member.email}</p>
                  <p className="text-sm text-gray-500">{
                    member.role === 'Owner' ? '所有者' : 
                    member.role === 'Editor' ? '编辑者' : '查看者'
                  }</p>
                </div>
                
                {isOwner && member.role !== 'Owner' && (
                  <button 
                    onClick={() => removeMember(member.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">暂无成员</p>
        )}
      </div>
      
      {/* 邀请表单 */}
      {isOwner && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">邀请成员</h3>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={inviteMember} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱地址"
              className="flex-1 px-3 py-2 border rounded-l-md"
              required
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? '邀请中...' : '邀请'}
            </button>
          </form>
        </div>
      )}
      
      {/* 待处理邀请 */}
      {isOwner && invitations.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">待处理邀请</h3>
          <ul className="divide-y">
            {invitations.map(invitation => (
              <li key={invitation.id} className="py-2 flex justify-between items-center">
                <div>
                  <p>{invitation.email}</p>
                  <p className="text-sm text-gray-500">
                    {invitation.status === 'Pending' ? '等待接受' : 
                     invitation.status === 'Accepted' ? '已接受' : '已拒绝'}
                  </p>
                </div>
                
                {invitation.status === 'Pending' && (
                  <button 
                    onClick={() => cancelInvitation(invitation.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    取消
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 主合作页面
const CollaborationPage = () => {
  const [activeTab, setActiveTab] = useState('myProjects');
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  
  const navigate = useNavigate();

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // 获取我的项目
  const fetchMyProjects = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/collaboration/projects/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProjects(response.data || []);
    } catch (err) {
      console.error('获取项目失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取邀请
  const fetchInvitations = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/collaboration/invitations/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInvitations(response.data || []);
    } catch (err) {
      console.error('获取邀请失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理标签切换
  useEffect(() => {
    if (activeTab === 'myProjects') {
      fetchMyProjects();
    } else if (activeTab === 'invitations') {
      fetchInvitations();
    }
  }, [activeTab, isLoggedIn]);

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
    } catch (err) {
      console.error('创建项目失败', err);
      throw new Error(err.response?.data?.message || '创建失败');
    }
  };

  // 更新项目
  const handleUpdateProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/api/collaboration/projects/${editingProject.id}`, 
        projectData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setShowProjectForm(false);
      setEditingProject(null);
      fetchMyProjects();
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
      await axios.post(
        `http://localhost:3000/api/collaboration/invitations/${invitationId}/${accept ? 'accept' : 'reject'}`, 
        {}, 
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
      console.error('处理邀请失败', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">项目协作</h1>
        
        {isLoggedIn && !showProjectForm && !currentProject && (
          <button
            onClick={() => {
              setEditingProject(null);
              setShowProjectForm(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <FaPlus className="mr-2" /> 
            创建项目
          </button>
        )}
        
        {currentProject && (
          <button
            onClick={() => setCurrentProject(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            返回列表
          </button>
        )}
      </div>

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

      {!showProjectForm && !currentProject && (
        <>
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('myProjects')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'myProjects'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  我的项目
                </button>
                
                <button
                  onClick={() => setActiveTab('invitations')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'invitations'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  邀请
                  {invitations.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {invitations.filter(inv => inv.status === 'Pending').length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>加载中...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'myProjects' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {projects.length > 0 ? (
                    projects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        isOwner={project.role === 'Owner'}
                        onEdit={project => {
                          setEditingProject(project);
                          setShowProjectForm(true);
                        }}
                        onDelete={fetchMyProjects}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                      你还没有任何项目
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'invitations' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">项目邀请</h2>
                  
                  {invitations.length > 0 ? (
                    <ul className="divide-y">
                      {invitations.map(invitation => (
                        <li key={invitation.id} className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{invitation.project?.name || '未知项目'}</p>
                              <p className="text-sm text-gray-500">
                                来自: {invitation.inviter?.username || '未知用户'}
                              </p>
                              <p className="text-sm text-gray-500">
                                状态: {
                                  invitation.status === 'Pending' ? '待处理' : 
                                  invitation.status === 'Accepted' ? '已接受' : '已拒绝'
                                }
                              </p>
                            </div>
                            
                            {invitation.status === 'Pending' && (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleInvitationResponse(invitation.id, true)}
                                  className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                  <FaCheck size={14} />
                                </button>
                                <button 
                                  onClick={() => handleInvitationResponse(invitation.id, false)}
                                  className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                  <FaTimes size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-6 text-gray-500">
                      暂无邀请
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {currentProject && (
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentProject.name}</h2>
            <p className="text-gray-600 mb-4">{currentProject.description || '暂无描述'}</p>
          </div>
          
          <MemberManagement projectId={currentProject.id} />
          
          {/* 这里可以添加更多项目协作功能，如任务管理、文件共享等 */}
        </div>
      )}
    </div>
  );
};

export default CollaborationPage;
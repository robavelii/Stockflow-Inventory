import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { Mail, Shield, MoreHorizontal, UserPlus, X, Edit2, Trash2, Check } from 'lucide-react';
import { MOCK_USERS } from '../utils/constants';
import toast from 'react-hot-toast';

interface TeamMember extends UserType {
  isNew?: boolean;
}

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer' as UserType['role'],
  });

  useEffect(() => {
    const saved = localStorage.getItem('stockflow-team-members');
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse team members', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stockflow-team-members', JSON.stringify(members));
  }, [members]);

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', role: 'Viewer' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', role: 'Viewer' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    if (editingMember) {
      setMembers(prev => prev.map(m => 
        m.id === editingMember.id 
          ? { ...m, name: formData.name, email: formData.email, role: formData.role }
          : m
      ));
      toast.success('Team member updated');
    } else {
      const newMember: TeamMember = {
        id: `u${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(/\s/g, '')}`,
        isNew: true,
      };
      setMembers(prev => [...prev, newMember]);
      toast.success('Team member invited');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Team member removed');
    }
    setActiveDropdown(null);
  };

  const handleRoleChange = (id: string, newRole: UserType['role']) => {
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, role: newRole } : m
    ));
    toast.success('Role updated');
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage access and roles</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-slate-900 dark:bg-primary-600 text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-800 dark:hover:bg-primary-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center relative"
          >
            {user.isNew && (
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                New
              </span>
            )}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mb-4 bg-slate-100 dark:bg-gray-700"
            />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-4">
              <Mail className="w-3 h-3" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  user.role === 'Admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400'
                    : user.role === 'Manager'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
            </div>
            <div className="w-full pt-4 border-t border-slate-50 dark:border-gray-700 flex justify-center relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {activeDropdown === user.id && (
                <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <div className="border-t border-slate-100 dark:border-gray-700 my-1" />
                  <div className="px-4 py-1 text-xs text-slate-400 dark:text-slate-500 uppercase">Change Role</div>
                  {(['Admin', 'Manager', 'Viewer'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(user.id, role)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2 ${
                        user.role === role ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {user.role === role && <Check className="w-4 h-4" />}
                      <span className={user.role === role ? '' : 'ml-6'}>{role}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingMember ? 'Edit Team Member' : 'Invite Team Member'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                  placeholder="john@company.com"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserType['role'] }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm"
                >
                  {editingMember ? 'Save Changes' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
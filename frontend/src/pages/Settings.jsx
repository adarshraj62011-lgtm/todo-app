import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiCamera, FiSave, FiUser, FiMail, FiLock } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size cannot exceed 5MB");
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setLoading(true);
      const res = await api.post('/auth/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser({ ...user, profilePhoto: res.data.profilePhoto });
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile photo");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword && { password: formData.newPassword })
      });
      setUser(res.data);
      toast.success("Profile updated successfully!");
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = () => {
    if (user?.profilePhoto) {
      return `http://localhost:5000${user.profilePhoto}`;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in stagger-1 pb-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Settings</h1>

      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Profile Details</h2>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 shrink-0">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl flex items-center justify-center relative">
                {getAvatarUrl() ? (
                  <img src={getAvatarUrl()} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl sm:text-5xl font-bold text-slate-400 dark:text-slate-500">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                
                {/* Overlay for uploading */}
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                  onClick={handlePhotoClick}
                >
                  <FiCamera className="text-white text-3xl" />
                </div>
              </div>
              
              <button 
                className="absolute bottom-0 right-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 hover:bg-blue-600 rounded-full border-4 border-white dark:border-slate-800 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                onClick={handlePhotoClick}
                type="button"
                disabled={loading}
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCamera />}
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium text-center">JPG, GIF or PNG. Max 5MB</p>
          </div>

          {/* Form Section */}
          <form className="flex-1 space-y-6" onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="input-field pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative mt-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="input-field pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Update Password</h3>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password (Leave blank to keep current)</label>
                  <div className="relative mt-1">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      className="input-field pl-10"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                type="submit" 
                className="btn-primary min-w-[150px] shadow-sm shadow-blue-500/20 flex justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><FiSave className="mr-2" /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Key, Check, AlertCircle, X, Database } from 'lucide-react';
import { updateAdminProfile, changeAdminPassword } from '../../services/api';

export default function AdminHeader({ title, subtitle }) {
  const { user } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || 'Pillowala Admin');
  const [email, setEmail] = useState(user?.email || 'admin@pillowala.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);

  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState(null);
  const [passError, setPassError] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    setProfileError(null);
    try {
      const res = await updateAdminProfile({ name, email });
      setProfileMsg(res.message || 'Admin profile updated in DB!');
      const updatedUser = { ...user, name, email };
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters');
      return;
    }

    setChangingPass(true);
    setPassMsg(null);
    setPassError(null);
    try {
      const res = await changeAdminPassword({ currentPassword, newPassword });
      setPassMsg(res.message || 'Admin passcode updated in DB successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || err.message);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-stone-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 hover:border-black text-stone-700 hover:text-black text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Edit Admin Credentials in DB"
          >
            <Key size={13} className="text-amber-600" />
            <span>Admin Credentials</span>
          </button>

          <div className="flex items-center gap-2.5 pl-4 border-l border-stone-200">
            <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-700">
              <User size={15} />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-stone-900 leading-tight">
                {user?.name || name}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                {user?.role || 'Superadmin'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Credentials & DB Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative animate-fadeIn">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-black hover:bg-stone-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono-tech font-bold uppercase tracking-wider border border-emerald-200">
                <Database size={12} />
                <span>Persistent DB Storage Active</span>
              </div>
              <h3 className="text-xl font-display font-black text-stone-900 uppercase tracking-tight">
                Admin Database Credentials
              </h3>
              <p className="text-xs text-stone-500">
                Update your admin ID, email, and passcode directly in the database.
              </p>
            </div>

            {/* 1. Admin Profile Section */}
            <form onSubmit={handleUpdateProfile} className="space-y-3.5 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono-tech">
                Admin Profile & ID
              </h4>

              {profileMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <Check size={14} className="shrink-0" />
                  <span>{profileMsg}</span>
                </div>
              )}
              {profileError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Admin Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Admin Email / ID</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black font-mono-tech"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {savingProfile ? 'Saving in DB...' : 'Save Profile in DB'}
              </button>
            </form>

            {/* 2. Change Passcode Section */}
            <form onSubmit={handleChangePassword} className="space-y-3.5 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono-tech flex items-center gap-1.5">
                <Key size={13} className="text-amber-600" />
                <span>Change Admin Passcode</span>
              </h4>

              {passMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <Check size={14} className="shrink-0" />
                  <span>{passMsg}</span>
                </div>
              )}
              {passError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Passcode (e.g. Admin@12345)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black font-mono-tech"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Passcode"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black font-mono-tech"
                  />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Passcode"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-black font-mono-tech"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {changingPass ? 'Updating Passcode in DB...' : 'Update Passcode in DB'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

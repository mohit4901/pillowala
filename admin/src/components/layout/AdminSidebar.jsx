import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Layers,
  Tag,
  Trophy,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ pendingCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: 'Reviews Moderation',
      path: '/reviews',
      icon: <MessageSquare size={18} />,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      name: 'Monthly Lucky Draw',
      path: '/luckydraw',
      icon: <Trophy size={18} className="text-amber-400" />,
    },
    {
      name: 'Products Catalog',
      path: '/products',
      icon: <Package size={18} />,
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: <Layers size={18} />,
    },
    {
      name: 'Deals & Offers',
      path: '/offers',
      icon: <Tag size={18} />,
    },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-stone-800">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-sm">
            🛏️
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">
              Pillowala
            </h1>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase mt-1 block">
              Control Panel
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 px-3 mb-2">
            Main Management
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-stone-800 space-y-3">
        {/* Customer Site Link */}
        <a
          href="http://127.0.0.1:5180"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            <span>Customer Website</span>
          </span>
          <span className="text-[10px] text-stone-500">Live</span>
        </a>

        {/* User Card & Logout */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-white truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[11px] text-stone-500 truncate">
              {user?.email || 'admin@pillowala.com'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

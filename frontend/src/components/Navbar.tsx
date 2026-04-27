import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, Clapperboard, Bell } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { motion, useScroll, useTransform } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Transition background from transparent to solid black as user scrolls
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(20, 20, 20, 0)", "rgba(20, 20, 20, 0.95)"]
  );
  
  useEffect(() => {
    document.documentElement.classList.add('dark'); // Force dark mode for cinematic feel
  }, []);

  return (
    <motion.nav 
      style={{ backgroundColor }}
      className="fixed top-0 z-50 w-full px-6 md:px-12 py-4 flex items-center justify-between transition-all backdrop-blur-sm"
    >
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 group">
          <Clapperboard className="text-[var(--accent)] w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-extrabold tracking-tighter text-[var(--accent)] outfit">
            CINEMATCH
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white font-bold' : ''}`}>Home</Link>
          <button className="hover:text-white transition-colors">TV Shows</button>
          <button className="hover:text-white transition-colors">Movies</button>
          <button className="hover:text-white transition-colors">My List</button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isAuthenticated && (
           <button className="text-gray-300 hover:text-white transition-colors hidden md:block">
            <Bell className="w-5 h-5" />
           </button>
        )}
        {isAuthenticated ? (
          <div className="flex items-center gap-4 group cursor-pointer relative py-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="absolute right-0 top-12 w-48 py-2 bg-black border border-white/10 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right transform scale-95 group-hover:scale-100">
              <div className="px-4 py-3 text-sm text-white font-bold mb-1 border-b border-white/10 flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-900 flex flex-shrink-0 items-center justify-center text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                 </div>
                 <span className="truncate">{user?.username}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of CineMatch</span>
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-5 py-2 bg-[var(--accent)] text-white rounded font-bold text-sm hover:bg-[var(--accent-hover)] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

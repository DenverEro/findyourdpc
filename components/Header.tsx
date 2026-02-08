
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-stethoscope text-xl"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              findyourdpc.com
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/directory" className={`font-medium transition ${isActive('/directory') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>Find a Doctor</Link>
            <Link to="/blog" className={`font-medium transition ${isActive('/blog') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>Blog</Link>
            <Link to="/contact" className={`font-medium transition ${isActive('/contact') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/provider/login" className="hidden sm:block text-slate-600 hover:text-emerald-600 font-bold text-sm transition">
              Provider Login
            </Link>
            <button className="md:hidden text-slate-500">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

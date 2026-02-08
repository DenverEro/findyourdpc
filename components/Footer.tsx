
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white">
              <i className="fas fa-stethoscope"></i>
            </div>
            <span className="text-xl font-bold text-white">findyourdpc.com</span>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <nav className="flex items-center justify-center md:justify-end space-x-8">
              <Link to="/directory" className="hover:text-emerald-400 transition font-medium">Find Your DPC</Link>
              <Link to="/blog" className="hover:text-emerald-400 transition font-medium">Blog</Link>
              <Link to="/contact" className="hover:text-emerald-400 transition font-medium">Contact us</Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} findyourdpc.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

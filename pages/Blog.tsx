
import React from 'react';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';

interface BlogProps {
  blogs: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogs }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">DPC Insights</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Direct Primary Care, from the patient and physician perspective.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {blog.category}
                  </span>
                  <span className="text-slate-400 text-xs">{blog.date}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition mb-3">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm mb-6 flex-grow">
                  {blog.excerpt}
                </p>
                <Link to={`/blog/${blog.slug}`} className="text-emerald-600 font-bold text-sm flex items-center group-hover:underline">
                  Read Article <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

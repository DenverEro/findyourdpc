
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Practice, BlogPost } from '../types';
import PracticeCard from '../components/PracticeCard';

interface HomeProps {
  practices: Practice[];
  blogs: BlogPost[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  setSearchQuery: (val: string) => void;
  setLocationFilter: (val: string) => void;
}

const Home: React.FC<HomeProps> = ({
  practices,
  blogs,
  favorites,
  toggleFavorite,
  setSearchQuery,
  setLocationFilter
}) => {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState('');
  const [localLocation, setLocalLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setLocationFilter(localLocation);
    navigate('/directory');
  };

  const featuredPractices = practices.slice(0, 2);
  const featuredBlogs = blogs.slice(0, 2);

  return (
    <div className="bg-slate-50">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000"
            alt="Healthcare landing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full pt-20">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300">New Standard of Care</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
              Doctors who actually <span className="text-emerald-400">listen.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-xl leading-relaxed opacity-90">
              No insurance required. $0 co-pays. Unlimited visits. Just a simple monthly membership for elite primary care.
            </p>

            {/* Hero Search Bar - Polished vertical alignment */}
            <form onSubmit={handleSearch} className="max-w-2xl bg-white/10 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col md:flex-row md:items-stretch gap-2">
              <div className="relative flex-grow group w-full flex items-center">
                <i className="fas fa-search absolute left-6 text-emerald-400 group-focus-within:text-white transition-colors z-10"></i>
                <input
                  type="text"
                  placeholder="Doctor or specialty..."
                  className="w-full pl-14 pr-4 py-5 rounded-2xl bg-white/10 border-0 focus:ring-2 focus:ring-emerald-400/50 text-white placeholder:text-white/60 text-base"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>
              <div className="relative flex-grow group w-full flex items-center">
                <i className="fas fa-map-marker-alt absolute left-6 text-emerald-400 group-focus-within:text-white transition-colors z-10"></i>
                <input
                  type="text"
                  placeholder="City or Zip..."
                  className="w-full pl-14 pr-4 py-5 rounded-2xl bg-white/10 border-0 focus:ring-2 focus:ring-emerald-400/50 text-white placeholder:text-white/60 text-base"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-900/20 whitespace-nowrap flex items-center justify-center">
                Find Care
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center border-r border-slate-100 last:border-0">
              <div className="text-3xl font-black text-slate-900">70+</div>
              <div className="text-sm text-slate-500 font-medium">Practices Listed</div>
            </div>
            <div className="text-center border-r border-slate-100 last:border-0">
              <div className="text-3xl font-black text-emerald-600">4.9/5</div>
              <div className="text-sm text-slate-500 font-medium">Avg. Patient Rating</div>
            </div>
            <div className="text-center border-r border-slate-100 last:border-0">
              <div className="text-3xl font-black text-slate-900">45 Min</div>
              <div className="text-sm text-slate-500 font-medium">Avg. Visit Length</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-600">24/7</div>
              <div className="text-sm text-slate-500 font-medium">Direct Doctor Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">How Direct Primary Care Works</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Reclaiming the relationship between you and your doctor by removing the middle-man.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: 'fa-id-card',
                title: 'Membership Basis',
                text: 'Think of it like a gym membership for your health. A low monthly fee covers all your primary care.',
                color: 'bg-emerald-100 text-emerald-600'
              },
              {
                icon: 'fa-comments',
                title: 'Unlimited Access',
                text: 'Text, email, or video chat with your doctor directly. Same-day or next-day appointments are standard.',
                color: 'bg-sky-100 text-sky-600'
              },
              {
                icon: 'fa-hand-holding-heart',
                title: 'Pure Care',
                text: 'Your doctor works for you, not the insurance company. This means longer visits and better outcomes.',
                color: 'bg-emerald-100 text-emerald-600'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Practices Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Featured Practices</h2>
              <p className="text-lg text-slate-500">Discover elite practices that prioritize patient outcomes over volume.</p>
            </div>
            <Link to="/directory" className="group text-emerald-600 font-bold flex items-center bg-emerald-50 px-6 py-3 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">
              See Full Directory <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuredPractices.map(practice => (
              <PracticeCard
                key={practice.id}
                practice={practice}
                isFavorite={favorites.includes(practice.id)}
                onToggleFavorite={() => toggleFavorite(practice.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Informative Articles - Hidden for launch
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Patient Education</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Understanding the DPC movement and how it affects your wallet and your health.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredBlogs.map(blog => (
              <Link to={`/blog/${blog.slug}`} key={blog.id} className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                  <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={blog.title} />
                </div>
                <div className="md:w-2/3 p-8 flex flex-col justify-center">
                  <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-3">{blog.category}</div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-300 transition leading-tight">{blog.title}</h3>
                  <p className="text-slate-400 mb-6 line-clamp-2">{blog.excerpt}</p>
                  <div className="text-white font-bold text-sm flex items-center">
                    Read More <i className="fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Physician CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-12 md:p-24 text-white text-center md:text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <i className="fas fa-stethoscope text-[20rem] -rotate-12"></i>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Are you a DPC Provider?</h2>
              <p className="text-xl text-emerald-50 mb-10 opacity-90 leading-relaxed">
                Join our nationwide network and connect with patients who value direct care.
                Claim your practice for <span className="underline font-bold underline-offset-8">$50/month</span>.
              </p>
              <p className="text-emerald-100 mb-8 text-xl leading-relaxed">
                Get a verified listing badge, patient leads, and a provider portal to manage your profile.
              </p>
              <Link to="/provider/login" className="inline-block bg-white text-emerald-700 font-bold px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95 text-lg">
                Provider Login
              </Link>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 max-w-sm rotate-2 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center text-emerald-900">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Grow Faster</div>
                    <div className="text-emerald-100 text-sm">300% more patient inquiries</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-white/20 rounded-full w-full"></div>
                  <div className="h-2 bg-white/20 rounded-full w-4/5"></div>
                  <div className="h-2 bg-white/20 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

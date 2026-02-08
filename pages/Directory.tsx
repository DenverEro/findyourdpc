
import React, { useState } from 'react';
import { Practice } from '../types';
import PracticeCard from '../components/PracticeCard';

interface DirectoryProps {
  practices: Practice[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  locationFilter: string;
  setLocationFilter: (val: string) => void;
  maxDistance: number;
  setMaxDistance: (val: number) => void;
  userCoords: { lat: number; lng: number } | null;
}

const Directory: React.FC<DirectoryProps> = ({ 
  practices, 
  favorites, 
  toggleFavorite,
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  maxDistance,
  setMaxDistance,
  userCoords
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const distanceOptions = [
    { label: '10 miles', value: 10 },
    { label: '25 miles', value: 25 },
    { label: '50 miles', value: 50 },
    { label: '100 miles', value: 100 }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Search Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=2000" 
            alt="Doctor's office background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 via-emerald-900/70 to-slate-900/60"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 w-full">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Find Your <span className="text-emerald-400">Perfect Care.</span></h1>
          <p className="text-sky-50 text-xl mb-12 opacity-90 max-w-2xl mx-auto">Discover Direct Primary Care clinics near you. Search by doctor, specialty, or location.</p>
          
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col md:flex-row md:items-stretch gap-2">
            <div className="relative flex-grow group flex items-center">
              <i className="fas fa-search absolute left-6 text-emerald-400 group-focus-within:text-white transition-colors z-10"></i>
              <input 
                type="text" 
                placeholder="Doctor or specialty..."
                className="w-full pl-14 pr-4 py-5 rounded-2xl bg-white/10 border-0 focus:ring-2 focus:ring-emerald-400/50 text-white placeholder:text-white/60 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex-grow group flex items-center">
              <i className="fas fa-map-marker-alt absolute left-6 text-emerald-400 group-focus-within:text-white transition-colors z-10"></i>
              <input 
                type="text" 
                placeholder="City or Zip..."
                className="w-full pl-14 pr-4 py-5 rounded-2xl bg-white/10 border-0 focus:ring-2 focus:ring-emerald-400/50 text-white placeholder:text-white/60 text-base"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center justify-center">
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {practices.length} {practices.length === 1 ? 'Practice' : 'Practices'} Found
            </h2>
            {(searchQuery || locationFilter) && (
              <p className="text-slate-500">
                Showing results for {searchQuery && `"${searchQuery}"`} {locationFilter && `in "${locationFilter}"`}
                {userCoords && ` (${maxDistance} mile radius)`}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 relative">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition flex items-center gap-2"
              >
                <i className="fas fa-sliders-h"></i> 
                More Filters
                {showFilters && <span className="ml-1 w-2 h-2 bg-emerald-500 rounded-full"></span>}
              </button>
              
              {/* Filters Dropdown */}
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 min-w-[200px] z-20">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Maximum Distance
                      </label>
                      <div className="space-y-2">
                        {distanceOptions.map((option) => (
                          <label 
                            key={option.value} 
                            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
                          >
                            <input
                              type="radio"
                              name="distance"
                              value={option.value}
                              checked={maxDistance === option.value}
                              onChange={() => setMaxDistance(option.value)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-slate-700 text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-medium focus:ring-emerald-500 focus:border-emerald-500">
              <option>Recommended</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        {practices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practices.map(practice => (
              <PracticeCard 
                key={practice.id} 
                practice={practice} 
                isFavorite={favorites.includes(practice.id)} 
                onToggleFavorite={() => toggleFavorite(practice.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-3xl">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No practices found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Try adjusting your filters or searching in a different area to find DPC clinics.</p>
            <button 
              onClick={() => { setSearchQuery(''); setLocationFilter(''); setMaxDistance(100); }}
              className="text-emerald-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Directory;

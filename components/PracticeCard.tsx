
import React, { useState } from 'react';
import { Practice } from '../types';
import { Link } from 'react-router-dom';
import { logEvent } from '../src/analytics';
import ClaimPracticeModal from './ClaimPracticeModal';

interface PracticeCardProps {
  practice: Practice;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ practice, isFavorite, onToggleFavorite }) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full relative">
      {/* Image Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={practice.image}
          alt={practice.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        {/* Heart Favorite Button - HIDDEN V1 */}
        {/* <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500'}`}
          >
            <i className={`fa-heart ${isFavorite ? 'fas' : 'far'} text-lg`}></i>
          </button>
        </div> */}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {practice.isClaimed && (
            <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm uppercase tracking-widest border border-white/20">
              <i className="fas fa-check-circle"></i> Claimed
            </div>
          )}
          {practice.isAccepting && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 shadow-sm uppercase tracking-widest border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Accepting
            </div>
          )}
          {practice.isHSACompliant && (
            <div className="bg-sky-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm uppercase tracking-widest border border-white/20">
              <i className="fas fa-file-invoice-dollar"></i> HSA Compliant
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/${practice.slug}`} className="block flex-grow">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition leading-tight pr-2">
              {practice.name}
            </h3>
          </Link>
          <div className="flex items-center bg-white border border-slate-100 px-2.5 py-1 rounded-xl text-sm font-bold shrink-0 shadow-sm">
            <i className="fas fa-star text-amber-400 mr-1.5"></i>
            <span className="text-slate-800">{practice.googleRating || practice.rating}</span>
            <span className="text-[10px] text-slate-400 font-medium ml-1">({practice.googleReviewsCount || practice.reviewsCount})</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-4 flex items-center font-medium">
          <i className="fas fa-user-md mr-2 text-emerald-500"></i>
          {practice.doctor}
        </p>

        <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {practice.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {practice.tags.map(tag => (
            <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
          <div className="text-slate-400 text-xs font-medium">
            <i className="fas fa-map-marker-alt mr-1.5 text-emerald-400"></i>
            {practice.city}, {practice.state}
          </div>
          <div className="text-emerald-700 font-black text-sm">
            {practice.priceRange}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
        <Link
          to={`/${practice.slug}`}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-2xl border border-slate-200 transition text-center text-sm active:scale-95"
        >
          Details
        </Link>
        {!practice.isClaimed ? (
          <button
            onClick={() => {
              logEvent('Conversion', 'Click Claim Button', practice.name);
              setIsClaimModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-emerald-100 text-sm active:scale-95"
          >
            Claim
          </button>
        ) : (
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-sky-100 text-sm active:scale-95">
            Book
          </button>
        )}
      </div>

      {/* Claim Practice Modal */}
      <ClaimPracticeModal
        practice={practice}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </div>
  );
};

export default PracticeCard;

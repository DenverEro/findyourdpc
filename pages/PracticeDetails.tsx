
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_REVIEWS } from '../constants';
import { Practice, Review } from '../types';
import ClaimPracticeModal from '../components/ClaimPracticeModal';
import DOMPurify from 'dompurify';
import { logEvent } from '../src/analytics';


interface PracticeDetailsProps {
  practices: Practice[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const PracticeDetails: React.FC<PracticeDetailsProps> = ({ practices, favorites, toggleFavorite }) => {
  const sanitizer = DOMPurify(window);
  const { state, city, clinicSlug, id } = useParams<{ state?: string; city?: string; clinicSlug?: string; id?: string }>();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Review Form State
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    let found = null;
    if (state && city && clinicSlug) {
      const fullSlug = `${state}/${city}/${clinicSlug}`.toLowerCase();
      found = practices.find(p => p.slug.toLowerCase() === fullSlug);
    } else if (id) {
      found = practices.find(p => p.id === id);
    }

    if (found) {
      // 1. Set static data first
      setPractice(found);
      setReviews(MOCK_REVIEWS.filter(r => r.practiceId === found!.id));

      // 2. Fetch overrides from backend (if any)
      fetch(`http://localhost:4004/api/provider/${found.id}`)
        .then(res => res.json())
        .then(overrides => {
          if (overrides && Object.keys(overrides).length > 0) {
            setPractice(prev => prev ? { ...prev, ...overrides } : prev);
          }
        })
        .catch(err => console.error('Failed to load dynamic practice data:', err));
    }
    window.scrollTo(0, 0);
  }, [state, city, clinicSlug, id, practices]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent || !authorName) return;

    const newReview: Review = {
      id: Date.now().toString(),
      practiceId: practice?.id || '',
      author: authorName,
      rating: reviewRating,
      content: reviewContent,
      date: 'Just now'
    };

    setReviews([newReview, ...reviews]);
    setIsReviewModalOpen(false);
    setReviewContent('');
    setAuthorName('');
    setReviewRating(5);
  };

  if (!practice) return <div className="p-20 text-center">Practice not found.</div>;

  const isFavorite = favorites.includes(practice.id);

  return (
    <div className="bg-slate-50 pb-20">
      {/* Cover Image Header */}
      <div className="h-[40vh] md:h-[60vh] relative overflow-hidden">
        <img src={practice.image} className="w-full h-full object-cover" alt={practice.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {practice.isClaimed && (
                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> Claimed
                </span>
              )}
              {practice.isHSACompliant && (
                <span className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-file-invoice-dollar"></i> HSA Compliant
                </span>
              )}
              {practice.isAccepting && (
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Accepting Patients
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-4 leading-tight">{practice.name}</h1>
            <div className="flex items-center gap-6">
              <p className="text-xl md:text-2xl opacity-90 font-medium">Led by {practice.doctor}</p>
              <div className="h-6 w-px bg-white/30 hidden md:block"></div>
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <i className="fas fa-star text-amber-400 mr-3 text-lg"></i>
                <span className="font-black text-lg">{practice.googleRating || practice.rating}</span>
                <span className="opacity-70 text-sm ml-2 font-medium">({practice.googleReviewsCount || reviews.length} Google Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-black text-slate-900">About this Practice</h2>
                {/* <button
                  onClick={() => toggleFavorite(practice.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${isFavorite ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'}`}
                >
                  <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </button> */}
              </div>

              <div
                className="text-slate-600 text-xl leading-relaxed mb-10 prose prose-emerald max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(practice.description) }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practice.tags.map(tag => (
                  <div key={tag} className="flex items-center p-5 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border border-emerald-100 transition hover:bg-emerald-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm text-lg">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Patient Voices</h2>
                  <p className="text-slate-500 mt-2">Verified experiences from real patients.</p>
                </div>
                {/* HIDDEN FOR V1 - Write a Review button
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg shadow-emerald-100 active:scale-95"
                >
                  Write a Review
                </button>
                */}
              </div>

              <div className="space-y-8">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-emerald-200">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl uppercase">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg">{review.author}</div>
                          <div className="text-slate-400 text-sm">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`${i < review.rating ? 'fas' : 'far'} fa-star text-xs`}></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed italic">"{review.content}"</p>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-400">
                    No reviews yet. Be the first to share your experience!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-28">
              <div className="text-center mb-8">
                <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Monthly Membership</div>
                <div className="text-4xl font-black text-emerald-600 mb-6">{practice.priceRange}</div>

                {practice.pricingBreakdown && practice.pricingBreakdown.length > 0 && (
                  <div className="border-t border-slate-100 pt-6 space-y-3">
                    {practice.pricingBreakdown.map((line, idx) => {
                      const [label, price] = line.includes(':') ? line.split(':') : [line, ''];
                      return (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">{label.trim()}</span>
                          <span className="text-slate-900 font-black">{price.trim()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 mr-4 transition">
                    <i className="fas fa-map-marker-alt text-emerald-600"></i>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Clinic Address</div>
                    <div className="text-slate-800 font-bold leading-tight">
                      {practice.address && (
                        <>
                          {practice.address}<br />
                        </>
                      )}
                      {practice.city}, {practice.state} {practice.zip}
                    </div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 mr-4 transition">
                    <i className="fas fa-phone text-emerald-600"></i>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Phone Number</div>
                    <div className="text-slate-800 font-bold text-lg">{practice.phone}</div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 mr-4 transition">
                    <i className="fas fa-globe text-emerald-600"></i>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Official Website</div>
                    <a href={practice.website} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline break-all">
                      {practice.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>

              {/* HIDDEN FOR V1 - Book a Consult and Message Doctor buttons
              <div className="space-y-4">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 transition active:scale-95 text-lg flex items-center justify-center gap-3">
                  <i className="fas fa-calendar-check"></i>
                  Book a Consult
                </button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-5 rounded-2xl transition active:scale-95">
                  Message Doctor
                </button>
              </div>
              */}

              {!practice.isClaimed && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                    <p className="text-sm text-emerald-800 font-bold mb-4">
                      Are you {practice.doctor}?
                    </p>
                    <p className="text-xs text-emerald-700/70 mb-6 leading-relaxed">
                      Claim this practice to respond to reviews, update your availability, and accept new patients directly.
                    </p>
                    <button
                      onClick={() => {
                        logEvent('Conversion', 'Click Claim Button', practice.name);
                        setIsClaimModalOpen(true);
                      }}
                      className="w-full bg-white text-emerald-700 font-black py-3 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                    >
                      Claim Practice $50/mo <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Practice Modal */}
      <ClaimPracticeModal
        practice={practice}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-600 p-8 text-white">
              <h3 className="text-2xl font-black">Share Your Experience</h3>
              <p className="opacity-80">Tell others about your care at {practice.name}</p>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full p-4 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Star Rating</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition ${star <= reviewRating ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Your Review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How was your visit?..."
                  className="w-full p-4 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-grow py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeDetails;

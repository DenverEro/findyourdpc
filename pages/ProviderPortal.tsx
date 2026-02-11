
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Practice } from '../types';
import { loadMichiganPractices } from '../data/dataLoader';

interface ProviderOverride {
    description?: string;
    website?: string;
    phone?: string;
    updatedAt?: string;
}

const ProviderPortal: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [practice, setPractice] = useState<Practice | null>(null);
    const [overrides, setOverrides] = useState<ProviderOverride>({});
    const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Load session and practice data
    useEffect(() => {
        const verifyAccess = async () => {
            const token = localStorage.getItem('dpc_session_token');
            const sessionId = localStorage.getItem('dpc_session_id');
            const practiceId = localStorage.getItem('dpc_practice_id');

            if (!token && !sessionId) {
                // Clear potentially stale data
                localStorage.removeItem('dpc_session_id');
                navigate('/provider/login');
                return;
            }

            if (!practiceId) {
                navigate('/');
                return;
            }

            try {
                // Verify session with backend (security check)
                // Only if we don't have a JWT token yet or usage legacy session
                if (!token && sessionId && sessionId !== 'authenticated_via_jwt') {
                    const verifyRes = await fetch('/api/verify-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId })
                    });
                    const verifyData = await verifyRes.json();

                    if (!verifyData.success) {
                        throw new Error('Invalid session');
                    }
                }


                // Load base practice data
                const allPractices = loadMichiganPractices();
                const basePractice = allPractices.find(p => p.id === practiceId);

                if (!basePractice) {
                    throw new Error('Practice not found locally');
                }

                setPractice(basePractice);

                // Load overrides from backend
                const overrideRes = await fetch(`/api/provider/${practiceId}`);
                const overrideData = await overrideRes.json();
                setOverrides(overrideData);

            } catch (err) {
                console.error('Portal access denied:', err);
                localStorage.removeItem('dpc_session_id');
                localStorage.removeItem('dpc_session_token');
                navigate('/provider/login');
            } finally {
                setIsLoading(false);
            }
        };

        verifyAccess();
    }, [navigate]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!practice) return;

        setIsSaving(true);
        setSaveMessage('');

        try {
            await fetch(`/api/provider/${practice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(overrides)
            });
            setSaveMessage('Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            setSaveMessage('Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-emerald-600 font-bold animate-pulse text-xl">Loading Dashboard...</div>
            </div>
        );
    }

    if (!practice) return null;

    // Merge base data with overrides for display
    const displayPractice = { ...practice, ...overrides };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-emerald-600 font-black text-xl tracking-tighter">FindYourDPC</Link>
                        <span className="text-slate-300">/</span>
                        <span className="font-bold text-slate-700">Provider Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-sm text-slate-500 font-medium">Logged in as <strong>{displayPractice.name}</strong></span>
                        <button
                            onClick={() => {
                                localStorage.removeItem('dpc_session_id');
                                navigate('/');
                            }}
                            className="text-sm font-bold text-red-500 hover:text-red-600"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-1">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'profile'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <i className="fas fa-clinic-medical w-5 text-center"></i> Edit Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('subscription')}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'subscription'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <i className="fas fa-credit-card w-5 text-center"></i> Subscription
                            </button>
                            <a
                                href={`/#/${practice.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full text-left px-4 py-3 rounded-xl font-bold bg-white text-slate-600 hover:bg-slate-50 transition flex items-center gap-3"
                            >
                                <i className="fas fa-external-link-alt w-5 text-center"></i> View Public Listing
                            </a>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-black text-slate-900 mb-6">Edit Practice Profile</h2>

                                <form onSubmit={handleSaveProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Practice Name</label>
                                            <input
                                                type="text"
                                                disabled
                                                value={practice.name}
                                                className="w-full p-4 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                                title="Contact support to change practice name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={overrides.phone ?? practice.phone}
                                                onChange={e => setOverrides(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full p-4 rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Website URL</label>
                                            <input
                                                type="url"
                                                value={overrides.website ?? practice.website}
                                                onChange={e => setOverrides(prev => ({ ...prev, website: e.target.value }))}
                                                className="w-full p-4 rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Practice Description</label>
                                            <textarea
                                                rows={8}
                                                value={overrides.description ?? practice.description}
                                                onChange={e => setOverrides(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full p-4 rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                                                placeholder="Describe your practice philosophy, services, and what makes you unique..."
                                            />
                                            <p className="text-xs text-slate-400 mt-2 text-right">Plain text only. HTML is not supported.</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center gap-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition shadow-lg shadow-emerald-200 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        {saveMessage && (
                                            <span className={`text-sm font-bold animate-in fade-in ${saveMessage.includes('Failed') ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {saveMessage}
                                            </span>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'subscription' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <i className="fas fa-certificate text-9xl text-emerald-900"></i>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-4">
                                            Active Subscription
                                        </span>
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">Practice Listing Monthly</h2>
                                        <p className="text-slate-500 mb-8 text-lg">$50.00 / month</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mb-8">
                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Status</div>
                                                <div className="font-bold text-emerald-600 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    Active & Verified
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Billing Cycle</div>
                                                <div className="font-bold text-slate-700">Monthly via Stripe</div>
                                            </div>
                                        </div>

                                        <button className="text-slate-400 font-bold hover:text-slate-600 transition text-sm">
                                            Manage Payment Method on Stripe <i className="fas fa-external-link-alt ml-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProviderPortal;

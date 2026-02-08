
import React, { useState, useEffect } from 'react';
import { Practice } from '../types';
import { logEvent } from '../src/analytics';

interface ClaimPracticeModalProps {
    practice: Practice;
    isOpen: boolean;
    onClose: () => void;
}

type ClaimStep = 'INIT' | 'NPI_VERIFY' | 'EMAIL_VERIFY' | 'ACCOUNT_SETUP' | 'CHECKOUT' | 'SUCCESS';

const ClaimPracticeModal: React.FC<ClaimPracticeModalProps> = ({ practice, isOpen, onClose }) => {
    const [step, setStep] = useState<ClaimStep>('INIT');
    const [npiNumber, setNpiNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleNpiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4004/api/verify-npi/${npiNumber}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'NPI verification failed');
            }

            // Step: Send verification code automatically after NPI check
            await fetch('http://localhost:4004/api/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, clinicName: practice.name })
            });

            setStep('EMAIL_VERIFY');
        } catch (err: any) {
            setError(err.message || 'An error occurred during NPI verification.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4004/api/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setStep('ACCOUNT_SETUP');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:4004/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, practiceId: practice.id })
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            // Store token for immediate access after checkout
            localStorage.setItem('dpc_session_token', data.token);
            setStep('CHECKOUT');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        setError(null);
        const apiUrl = 'http://localhost:4004/api/create-checkout-session';
        console.log(`[FRONTEND] Initiating checkout at ${apiUrl} using POST`);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    practiceId: practice.id,
                    email: email
                })
            });

            console.log(`[FRONTEND] Response Status: ${response.status}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server responded with ${response.status}`);
            }

            if (data.url) {
                console.log(`[FRONTEND] Redirecting to Stripe: ${data.url}`);
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received from server');
            }
        } catch (err: any) {
            console.error('[FRONTEND] Checkout Error:', err);
            setError(err.message || 'Stripe checkout failed to initialize');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'INIT':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900">Claim {practice.name}</h3>
                        <p className="text-slate-500">To start the claim process, please provide your NPI number and professional email address.</p>
                        <form onSubmit={handleNpiSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Individual NPI Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="10-digit NPI"
                                    className="w-full p-4 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={npiNumber}
                                    onChange={(e) => setNpiNumber(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Practice Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="doctor@practice.com"
                                    className="w-full p-4 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying NPI...' : 'Verify NPI & Continue'}
                            </button>
                        </form>
                    </div>
                );
            case 'EMAIL_VERIFY':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900">Check Your Email</h3>
                        <p className="text-slate-500">We've sent a 6-digit verification code to <strong>{email}</strong>.</p>
                        <form onSubmit={handleEmailVerify} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">6-Digit Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full p-4 rounded-2xl border-slate-200 text-center text-3xl font-black tracking-[1em] focus:ring-emerald-500 focus:border-emerald-500"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>
                            <button type="button" className="w-full text-slate-400 font-bold hover:text-emerald-600 transition text-sm">
                                Didn't receive code? Resend in 54s
                            </button>
                        </form>
                    </div>
                );
            case 'ACCOUNT_SETUP':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900">Create Provider Account</h3>
                        <p className="text-slate-500">Set up your credentials to manage your clinic listing and respond to patients.</p>
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            <button
                                onClick={handleRegister}
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition disabled:opacity-50"
                            >
                                {isLoading ? 'Creating Account...' : 'Continue to Payment'}
                            </button>
                        </div>
                    </div>
                );
            case 'CHECKOUT':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900">Final Step: Activation</h3>
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-emerald-800">Practice Listing Monthly</span>
                                <span className="font-black text-emerald-900">$50.00</span>
                            </div>
                            <p className="text-xs text-emerald-700 opacity-70 leading-relaxed">
                                Includes verified badge, detailed profile, patient messaging, and analytics.
                            </p>
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 transition text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <i className="fas fa-credit-card"></i> {isLoading ? 'Preparing Checkout...' : 'Pay with Stripe'}
                        </button>
                    </div>
                );
            case 'SUCCESS':
                // Check if we've already logged this event to prevent duplicates on re-render
                // (Optional optimization, but simple call is fine for MVP)
                logEvent('Conversion', 'Claim Success', practice.name);

                return (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-4xl mx-auto mb-6 animate-bounce">
                            <i className="fas fa-check"></i>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">Congratulations!</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">Your claim for <strong>{practice.name}</strong> is verified and active. You can now manage your listing from the provider portal.</p>
                        <button
                            onClick={onClose}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition"
                        >
                            Go to Provider Portal
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 w-full flex">
                    {['INIT', 'EMAIL_VERIFY', 'ACCOUNT_SETUP', 'CHECKOUT', 'SUCCESS'].map((s, idx) => {
                        const steps = ['INIT', 'EMAIL_VERIFY', 'ACCOUNT_SETUP', 'CHECKOUT', 'SUCCESS'];
                        const currentIdx = steps.indexOf(step);
                        return (
                            <div
                                key={s}
                                className={`h-full flex-grow transition-all duration-700 ${idx <= currentIdx ? 'bg-emerald-500' : 'bg-transparent'}`}
                            ></div>
                        );
                    })}
                </div>

                <div className="p-10 md:p-12">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default ClaimPracticeModal;

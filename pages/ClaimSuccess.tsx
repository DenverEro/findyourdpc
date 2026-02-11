
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const ClaimSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            setErrorMsg('No session ID found.');
            return;
        }

        const verifySession = async () => {
            try {
                const response = await fetch('/api/verify-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId })
                });
                const data = await response.json();

                if (data.success) {
                    if (data.practiceId) {
                        localStorage.setItem('dpc_session_id', sessionId);
                        localStorage.setItem('dpc_practice_id', data.practiceId);
                    }
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMsg('Payment verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setErrorMsg('Server verification error.');
            }
        };

        verifySession();
    }, [sessionId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-xl font-bold text-slate-500 animate-pulse">Verifying Payment...</div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center">
                    <div className="text-red-500 text-5xl mb-4"><i className="fas fa-exclamation-circle"></i></div>
                    <h1 className="text-2xl font-black text-slate-900 mb-4">Verification Failed</h1>
                    <p className="text-slate-500 mb-6">{errorMsg}</p>
                    <Link to="/" className="text-emerald-600 font-bold hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-5xl mx-auto mb-8 animate-bounce">
                    <i className="fas fa-check"></i>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-6">Payment Verified!</h1>
                <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                    Your practice claim is now active. You have been granted full access to your provider portal where you can update your listing and connect with patients.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/provider/portal"
                        className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 transition active:scale-95 text-lg"
                    >
                        Access Provider Portal
                    </Link>
                    <Link
                        to="/"
                        className="block w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-5 rounded-2xl border border-slate-200 transition"
                    >
                        Return Home
                    </Link>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-100 text-slate-400 text-sm">
                    A confirmation email and receipt have been sent to your inbox.
                </div>
            </div>
        </div>
    );
};

export default ClaimSuccess;

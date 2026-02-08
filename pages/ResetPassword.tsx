
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isStep1, setIsStep1] = useState(!token); // Step 1: Request Link, Step 2: Reset
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequestLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:4004/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('If an account exists, a reset link has been sent.');
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to request reset');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:4004/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('Password updated! Redirecting to login...');
                setTimeout(() => navigate('/provider/login'), 2000);
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    <span className="text-emerald-600 font-black text-3xl tracking-tighter">FindYourDPC</span>
                </Link>
                <h2 className="text-center text-3xl font-black text-slate-900">
                    {isStep1 ? 'Reset Password' : 'Set New Password'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-3xl sm:px-10 border border-slate-100">
                    {isStep1 ? (
                        <form className="space-y-6" onSubmit={handleRequestLink}>
                            <p className="text-sm text-slate-500 text-center mb-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>

                            {message && <div className="text-emerald-600 font-bold text-center text-sm bg-emerald-50 p-3 rounded-lg">{message}</div>}
                            {error && <div className="text-red-500 font-bold text-center text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-200 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition"
                            >
                                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>

                            <div className="text-center mt-4">
                                <Link to="/provider/login" className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <p className="text-sm text-slate-500 text-center mb-4">
                                Enter your new password below.
                            </p>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>

                            {message && <div className="text-emerald-600 font-bold text-center text-sm bg-emerald-50 p-3 rounded-lg">{message}</div>}
                            {error && <div className="text-red-500 font-bold text-center text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-200 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

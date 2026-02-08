
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logEvent } from '../src/analytics';

const ProviderLogin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect logic
    const from = (location.state as any)?.from?.pathname || '/provider/portal';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:4004/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            // Store Auth
            localStorage.setItem('dpc_session_token', data.token);
            localStorage.setItem('dpc_practice_id', data.practiceId);

            // Allow access (we might need to set session_id too if legacy code depends on it, but we should switch to token)
            localStorage.setItem('dpc_session_id', 'authenticated_via_jwt');

            logEvent('User', 'Login Success', data.practiceId);

            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Login failed');
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
                <h2 className="text-center text-3xl font-black text-slate-900">Provider Login</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
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

                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-200 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500 font-medium">
                                    Forgot your password?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/provider/reset-password" className="text-emerald-600 hover:text-emerald-500 font-bold">
                                Reset it via email
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderLogin;

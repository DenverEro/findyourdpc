
import React from 'react';
import { Link } from 'react-router-dom';

const ClaimFailed: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-5xl mx-auto mb-8">
                    <i className="fas fa-times"></i>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-6">Payment Cancelled</h1>
                <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                    The checkout process was interrupted. No charges were made, and your practice claim remains pending.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/directory"
                        className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 transition active:scale-95 text-lg"
                    >
                        Try Again
                    </Link>
                    <Link
                        to="/"
                        className="block w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-5 rounded-2xl border border-slate-200 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClaimFailed;

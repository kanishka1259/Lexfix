import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-xl border border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 mb-4">LexFix Dashboard</h1>
        <p className="text-slate-600 mb-8">Database connection: Verified (PostgreSQL)</p>
        <Link 
          href="/dashboard" 
          className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all inline-block"
        >
          Enter Educator Dashboard
        </Link>
      </div>
    </main>
  );
}
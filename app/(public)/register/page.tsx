'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.fullName);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Register</h1>
        <p className="text-slate-500 mb-8">Join Mall of Westeros today</p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-sm mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
          </div>
          <div>
            <label className="block font-medium text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
          </div>
          <div>
            <label className="block font-medium text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-medium text-sm mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-full font-medium disabled:opacity-50">
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { FaCity, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(formData);

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));

            toast.success('Login successful!');

            // Redirect based on role
            const role = response.data.data.role;
            if (role === 'admin') {
                router.push('/dashboard/admin');
            } else if (role === 'authority') {
                router.push('/dashboard/authority');
            } else {
                router.push('/dashboard/citizen');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-4">
                        <FaCity className="text-5xl text-primary-600" />
                        <h1 className="text-4xl font-bold text-gradient">CivicLens</h1>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                    <p className="text-slate-600">Sign in to your account to continue</p>
                </div>

                {/* Login Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="label">
                                <FaEnvelope className="inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                <FaLock className="inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="loading-spinner mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                    <p className="text-xs text-blue-800">
                        <strong>Citizen:</strong> citizen@demo.com / password123<br />
                        <strong>Authority:</strong> authority@demo.com / password123<br />
                        <strong>Admin:</strong> admin@demo.com / password123
                    </p>
                </div>
            </div>
        </div>
    );
}

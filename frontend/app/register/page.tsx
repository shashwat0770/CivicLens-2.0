'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { FaCity, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'citizen',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authAPI.register(registerData);

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));

            toast.success('Registration successful!');

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
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-4">
                        <FaCity className="text-5xl text-primary-600" />
                        <h1 className="text-4xl font-bold text-gradient">CivicLens</h1>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                    <p className="text-slate-600">Join us in making your city better</p>
                </div>

                {/* Registration Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="label">
                                    <FaUser className="inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

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
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
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

                            <div>
                                <label htmlFor="confirmPassword" className="label">
                                    <FaLock className="inline mr-2" />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="phone" className="label">
                                    <FaPhone className="inline mr-2" />
                                    Phone Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="label">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="citizen">Citizen</option>
                                    <option value="authority">Authority</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="label">
                                <FaMapMarkerAlt className="inline mr-2" />
                                Address (Optional)
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="123 Main St, City, State"
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
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

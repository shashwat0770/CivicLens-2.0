'use client';

import Link from 'next/link';
import { FaCity, FaChartLine, FaShieldAlt, FaMapMarkedAlt } from 'react-icons/fa';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 opacity-10"></div>

                <nav className="relative z-10 container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaCity className="text-4xl text-primary-600" />
                            <h1 className="text-3xl font-bold text-gradient">CivicLens</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="btn-secondary">
                                Login
                            </Link>
                            <Link href="/register" className="btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="relative z-10 container mx-auto px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-6xl font-extrabold mb-6 animate-fade-in">
                            <span className="text-gradient">Smart Civic Complaint</span>
                            <br />
                            <span className="text-slate-800">Platform for Your City</span>
                        </h2>
                        <p className="text-xl text-slate-600 mb-10 animate-slide-up">
                            Report civic issues, track progress in real-time, and make your community better.
                            Join thousands of citizens making a difference.
                        </p>
                        <div className="flex items-center justify-center space-x-6 animate-slide-up">
                            <Link href="/register" className="btn-primary text-lg px-8 py-4">
                                Report an Issue
                            </Link>
                            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                                Track Complaints
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-6 py-20">
                <h3 className="text-4xl font-bold text-center mb-16 text-slate-800">
                    Why Choose <span className="text-gradient">CivicLens</span>?
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="stat-card text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaMapMarkedAlt className="text-3xl text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-slate-800">Geo-Tagged Reports</h4>
                        <p className="text-slate-600">
                            Pin exact locations using Google Maps for accurate issue reporting
                        </p>
                    </div>

                    <div className="stat-card text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaChartLine className="text-3xl text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-slate-800">Real-Time Tracking</h4>
                        <p className="text-slate-600">
                            Monitor complaint status and progress updates instantly
                        </p>
                    </div>

                    <div className="stat-card text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaShieldAlt className="text-3xl text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-slate-800">Secure & Private</h4>
                        <p className="text-slate-600">
                            Your data is protected with enterprise-grade security
                        </p>
                    </div>

                    <div className="stat-card text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaCity className="text-3xl text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-slate-800">100+ Categories</h4>
                        <p className="text-slate-600">
                            From potholes to pollution - report any civic issue
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center mb-16 text-slate-800">
                        How It <span className="text-gradient">Works</span>
                    </h3>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-xl">
                                1
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-slate-800">Report Issue</h4>
                            <p className="text-slate-600">
                                Submit a complaint with photos, location, and description
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-xl">
                                2
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-slate-800">Track Progress</h4>
                            <p className="text-slate-600">
                                Monitor real-time updates from authorities on your dashboard
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-xl">
                                3
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-slate-800">Get Resolved</h4>
                            <p className="text-slate-600">
                                Receive notifications when your issue is resolved
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-4xl font-bold text-white mb-6">
                        Ready to Make a Difference?
                    </h3>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join our community of active citizens and help build a better city
                    </p>
                    <Link href="/register" className="inline-block bg-white text-primary-600 font-bold text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                        Start Reporting Now
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <FaCity className="text-3xl text-primary-400" />
                        <h4 className="text-2xl font-bold">CivicLens</h4>
                    </div>
                    <p className="text-slate-400 mb-6">
                        Smart Civic Complaint Platform - Making Cities Better Together
                    </p>
                    <p className="text-slate-500 text-sm">
                        © 2024 CivicLens. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

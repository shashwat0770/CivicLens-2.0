'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaCity, FaUser, FaSignOutAlt, FaHome, FaChartBar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        return `/dashboard/${user.role}`;
    };

    return (
        <nav className="bg-white shadow-lg border-b border-slate-200">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={getDashboardLink()} className="flex items-center space-x-3">
                        <FaCity className="text-3xl text-primary-600" />
                        <span className="text-2xl font-bold text-gradient">CivicLens</span>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="flex items-center space-x-6">
                            <Link
                                href={getDashboardLink()}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${pathname === getDashboardLink()
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <FaHome />
                                <span>Dashboard</span>
                            </Link>

                            {/* User Menu */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3 px-4 py-2 bg-slate-100 rounded-lg">
                                    <FaUser className="text-slate-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

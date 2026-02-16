'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { adminAPI, complaintAPI } from '@/services/api';
import { User, Complaint, DashboardStats } from '@/types';
import toast from 'react-hot-toast';
import {
    FaUsers,
    FaClipboardList,
    FaCheckCircle,
    FaUserShield,
    FaChartBar,
    FaUserCog
} from 'react-icons/fa';
import { getStatusColor, getPriorityColor, formatDate, STATUS_LABELS, PRIORITY_LABELS } from '@/utils/constants';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [authorities, setAuthorities] = useState<User[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'complaints'>('overview');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
            router.push(`/dashboard/${parsedUser.role}`);
            return;
        }

        setUser(parsedUser);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [dashboardRes, usersRes, authoritiesRes, complaintsRes] = await Promise.all([
                adminAPI.getDashboard(),
                adminAPI.getUsers(),
                adminAPI.getAuthorities(),
                complaintAPI.getAll({ limit: 100 }),
            ]);

            setStats(dashboardRes.data.data);
            setUsers(usersRes.data.data);
            setAuthorities(authoritiesRes.data.data);
            setComplaints(complaintsRes.data.data);
        } catch (error: any) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            toast.success('User role updated successfully!');
            fetchDashboardData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const handleToggleStatus = async (userId: string) => {
        try {
            await adminAPI.toggleUserStatus(userId);
            toast.success('User status updated!');
            fetchDashboardData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleAssignComplaint = async (complaintId: string, authorityId: string) => {
        try {
            await complaintAPI.assign(complaintId, authorityId);
            toast.success('Complaint assigned successfully!');
            fetchDashboardData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to assign complaint');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-600">System overview and management</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'overview'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <FaChartBar className="inline mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'users'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <FaUserCog className="inline mr-2" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('complaints')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'complaints'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <FaClipboardList className="inline mr-2" />
                        Complaints
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="stat-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold mb-1">Total Complaints</p>
                                        <p className="text-3xl font-bold text-slate-800">{stats.overview.totalComplaints}</p>
                                    </div>
                                    <FaClipboardList className="text-4xl text-blue-500" />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold mb-1">Total Users</p>
                                        <p className="text-3xl font-bold text-slate-800">{stats.overview.totalUsers}</p>
                                    </div>
                                    <FaUsers className="text-4xl text-purple-500" />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold mb-1">Resolved</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.overview.resolvedComplaints}</p>
                                    </div>
                                    <FaCheckCircle className="text-4xl text-green-500" />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold mb-1">Resolution Rate</p>
                                        <p className="text-3xl font-bold text-primary-600">{stats.overview.resolutionRate}</p>
                                    </div>
                                    <FaChartBar className="text-4xl text-primary-500" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">User Distribution</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Citizens</span>
                                        <span className="font-bold text-blue-600">{stats.overview.totalCitizens}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Authorities</span>
                                        <span className="font-bold text-purple-600">{stats.overview.totalAuthorities}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Avg Resolution Time</span>
                                        <span className="font-bold text-green-600">{stats.overview.avgResolutionTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Status Distribution</h3>
                                <div className="space-y-3">
                                    {stats.statusDistribution.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between">
                                            <span className="text-slate-600 capitalize">{item._id.replace('_', ' ')}</span>
                                            <span className="font-bold text-primary-600">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Top Categories</h3>
                                <div className="space-y-3">
                                    {stats.categoryBreakdown.slice(0, 5).map((item) => (
                                        <div key={item._id} className="flex items-center justify-between">
                                            <span className="text-slate-600 text-sm">{item._id}</span>
                                            <span className="font-bold text-primary-600">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Recent Complaints</h3>
                            <div className="space-y-4">
                                {stats.recentComplaints.map((complaint) => (
                                    <div key={complaint._id} className="border border-slate-200 rounded-xl p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{complaint.title}</h4>
                                                <p className="text-sm text-slate-600 mt-1">{complaint.category}</p>
                                            </div>
                                            <span className={`badge ${complaint.status === 'resolved' ? 'badge-resolved' : 'badge-submitted'}`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="card">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">User Management</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">{u.name}</td>
                                            <td className="py-3 px-4">{u.email}</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    className="input-field text-sm py-1"
                                                >
                                                    <option value="citizen">Citizen</option>
                                                    <option value="authority">Authority</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`badge ${u.isActive ? 'badge-resolved' : 'badge-rejected'}`}>
                                                    {u.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleToggleStatus(u._id)}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                                >
                                                    Toggle Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Complaints Tab */}
                {activeTab === 'complaints' && (
                    <div className="card">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">All Complaints</h3>

                        {complaints.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg">No complaints in the system yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {complaints.map((complaint) => {
                                    const reporter =
                                        typeof complaint.reportedBy === 'object' && complaint.reportedBy !== null
                                            ? (complaint.reportedBy as User)
                                            : null;
                                    const assignee =
                                        typeof complaint.assignedTo === 'object' && complaint.assignedTo !== null
                                            ? (complaint.assignedTo as User)
                                            : null;

                                    return (
                                        <div
                                            key={complaint._id}
                                            className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h4
                                                        className="text-xl font-bold text-slate-800 mb-2 cursor-pointer hover:text-primary-600 transition-colors"
                                                        onClick={() => router.push(`/complaint/${complaint._id}`)}
                                                    >
                                                        {complaint.title}
                                                    </h4>
                                                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                                                        {complaint.description}
                                                    </p>
                                                    <div className="flex items-center flex-wrap gap-2 mb-3">
                                                        <span className={`badge ${getStatusColor(complaint.status)}`}>
                                                            {STATUS_LABELS[complaint.status] || complaint.status}
                                                        </span>
                                                        <span className={`badge ${getPriorityColor(complaint.priority)}`}>
                                                            {PRIORITY_LABELS[complaint.priority] || complaint.priority}
                                                        </span>
                                                        <span className="badge bg-slate-100 text-slate-700">
                                                            {complaint.category}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        {reporter && (
                                                            <span>
                                                                Reported by: <strong>{reporter.name}</strong>
                                                            </span>
                                                        )}
                                                        <span className="mx-2">&bull;</span>
                                                        <span>{formatDate(complaint.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-3xl font-bold text-primary-600 mb-2">
                                                        {complaint.progressPercentage}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                                                <div
                                                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${complaint.progressPercentage}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm text-slate-600 font-semibold">Assign to:</span>
                                                    <select
                                                        value={assignee ? assignee._id : ''}
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleAssignComplaint(complaint._id, e.target.value);
                                                            }
                                                        }}
                                                        className="input-field text-sm py-1 w-64"
                                                    >
                                                        <option value="">
                                                            {assignee ? assignee.name : '— Select Authority —'}
                                                        </option>
                                                        {authorities.map((auth) => (
                                                            <option key={auth._id} value={auth._id}>
                                                                {auth.name} ({auth.email})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/complaint/${complaint._id}`)}
                                                    className="btn-secondary text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

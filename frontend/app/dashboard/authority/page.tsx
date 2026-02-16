'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { complaintAPI } from '@/services/api';
import { Complaint, User } from '@/types';
import toast from 'react-hot-toast';
import {
    FaClipboardList,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaEdit
} from 'react-icons/fa';
import { getStatusColor, getPriorityColor, formatDate } from '@/utils/constants';

export default function AuthorityDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateData, setUpdateData] = useState({
        comment: '',
        progressPercentage: 0,
        newStatus: '',
    });
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'authority') {
            router.push(`/dashboard/${parsedUser.role}`);
            return;
        }

        setUser(parsedUser);
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await complaintAPI.getAll();
            const data = response.data.data;
            setComplaints(data);

            setStats({
                total: data.length,
                pending: data.filter((c: Complaint) => c.status === 'submitted' || c.status === 'in_review').length,
                in_progress: data.filter((c: Complaint) => c.status === 'in_progress').length,
                resolved: data.filter((c: Complaint) => c.status === 'resolved').length,
            });
        } catch (error: any) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateComplaint = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedComplaint || !updateData.comment) {
            toast.error('Please provide all required information');
            return;
        }

        try {
            await complaintAPI.addUpdate(selectedComplaint._id, updateData);
            toast.success('Complaint updated successfully!');
            setShowUpdateForm(false);
            setSelectedComplaint(null);
            setUpdateData({ comment: '', progressPercentage: 0, newStatus: '' });
            fetchComplaints();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update complaint');
        }
    };

    const openUpdateForm = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setUpdateData({
            comment: '',
            progressPercentage: complaint.progressPercentage,
            newStatus: complaint.status,
        });
        setShowUpdateForm(true);
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
                        Authority Dashboard
                    </h1>
                    <p className="text-slate-600">Manage and update assigned complaints</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold mb-1">Assigned to Me</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                            </div>
                            <FaClipboardList className="text-4xl text-blue-500" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold mb-1">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <FaClock className="text-4xl text-yellow-500" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold mb-1">In Progress</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.in_progress}</p>
                            </div>
                            <FaExclamationCircle className="text-4xl text-purple-500" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold mb-1">Resolved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                            </div>
                            <FaCheckCircle className="text-4xl text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Update Form Modal */}
                {showUpdateForm && selectedComplaint && (
                    <div className="card mb-8 animate-slide-up">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">
                            Update Complaint: {selectedComplaint.title}
                        </h3>

                        <form onSubmit={handleUpdateComplaint} className="space-y-6">
                            <div>
                                <label className="label">Status</label>
                                <select
                                    value={updateData.newStatus}
                                    onChange={(e) => setUpdateData({ ...updateData, newStatus: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="submitted">Submitted</option>
                                    <option value="in_review">In Review</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Progress Percentage: {updateData.progressPercentage}%</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={updateData.progressPercentage}
                                    onChange={(e) => setUpdateData({ ...updateData, progressPercentage: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="label">Update Comment *</label>
                                <textarea
                                    value={updateData.comment}
                                    onChange={(e) => setUpdateData({ ...updateData, comment: e.target.value })}
                                    className="input-field"
                                    rows={4}
                                    placeholder="Provide details about the progress..."
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <button type="submit" className="btn-primary">
                                    Submit Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUpdateForm(false);
                                        setSelectedComplaint(null);
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Complaints List */}
                <div className="card">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Assigned Complaints</h3>

                    {complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg">No complaints assigned yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map((complaint) => (
                                <div
                                    key={complaint._id}
                                    className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">{complaint.title}</h4>
                                            <p className="text-slate-600 text-sm mb-3">{complaint.description}</p>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className={`badge ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className={`badge ${getPriorityColor(complaint.priority)}`}>
                                                    {complaint.priority.toUpperCase()}
                                                </span>
                                                <span className="text-sm text-slate-500">{complaint.category}</span>
                                                <span className="text-sm text-slate-500">•</span>
                                                <span className="text-sm text-slate-500">{formatDate(complaint.createdAt)}</span>
                                            </div>
                                            {complaint.address && (
                                                <p className="text-sm text-slate-500">📍 {complaint.address}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-primary-600 mb-2">{complaint.progressPercentage}%</div>
                                            <button
                                                onClick={() => openUpdateForm(complaint)}
                                                className="btn-primary flex items-center space-x-2 text-sm"
                                            >
                                                <FaEdit />
                                                <span>Update</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                                            style={{ width: `${complaint.progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

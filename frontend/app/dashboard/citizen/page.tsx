'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { complaintAPI } from '@/services/api';
import { Complaint, User } from '@/types';
import toast from 'react-hot-toast';
import {
    FaPlus,
    FaMapMarkedAlt,
    FaClipboardList,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle
} from 'react-icons/fa';
import { getStatusColor, formatDate, COMPLAINT_CATEGORIES } from '@/utils/constants';

export default function CitizenDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        submitted: 0,
        in_progress: 0,
        resolved: 0,
    });

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        latitude: 0,
        longitude: 0,
        address: '',
        priority: 'medium',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'citizen') {
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

            // Calculate stats
            setStats({
                total: data.length,
                submitted: data.filter((c: Complaint) => c.status === 'submitted').length,
                in_progress: data.filter((c: Complaint) => c.status === 'in_progress' || c.status === 'in_review').length,
                resolved: data.filter((c: Complaint) => c.status === 'resolved').length,
            });
        } catch (error: any) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    toast.success('Location captured!');
                },
                (error) => {
                    toast.error('Failed to get location. Please enter manually.');
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            toast.error('Please provide location');
            return;
        }

        setSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('latitude', formData.latitude.toString());
            submitData.append('longitude', formData.longitude.toString());
            submitData.append('address', formData.address);
            submitData.append('priority', formData.priority);

            if (selectedImage) {
                submitData.append('image', selectedImage);
            }

            await complaintAPI.create(submitData);

            toast.success('Complaint submitted successfully!');
            setShowForm(false);

            // Reset form
            setFormData({
                title: '',
                description: '',
                category: '',
                latitude: 0,
                longitude: 0,
                address: '',
                priority: 'medium',
            });
            setSelectedImage(null);

            fetchComplaints();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setSubmitting(false);
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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">
                        Welcome back, <span className="text-gradient">{user?.name}</span>
                    </h1>
                    <p className="text-slate-600">Manage your civic complaints and track their progress</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold mb-1">Total Complaints</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                            </div>
                            <FaClipboardList className="text-4xl text-blue-500" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold mb-1">Submitted</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.submitted}</p>
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

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Submit New Complaint</span>
                    </button>
                </div>

                {/* Complaint Form */}
                {showForm && (
                    <div className="card mb-8 animate-slide-up">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Submit New Complaint</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Complaint Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Brief title of the issue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {COMPLAINT_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    rows={4}
                                    placeholder="Detailed description of the issue"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="label">Latitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="0.000000"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Longitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="0.000000"
                                        required
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="btn-secondary w-full flex items-center justify-center space-x-2"
                                    >
                                        <FaMapMarkedAlt />
                                        <span>Get My Location</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Street address or landmark"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Upload Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Complaint'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">My Complaints</h3>

                    {complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg">No complaints submitted yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary mt-4"
                            >
                                Submit Your First Complaint
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map((complaint) => (
                                <div
                                    key={complaint._id}
                                    className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => router.push(`/complaint/${complaint._id}`)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">{complaint.title}</h4>
                                            <p className="text-slate-600 text-sm mb-3">{complaint.description}</p>
                                            <div className="flex items-center space-x-3">
                                                <span className={`badge ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-sm text-slate-500">{complaint.category}</span>
                                                <span className="text-sm text-slate-500">•</span>
                                                <span className="text-sm text-slate-500">{formatDate(complaint.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-primary-600">{complaint.progressPercentage}%</div>
                                            <div className="text-sm text-slate-500">Progress</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
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

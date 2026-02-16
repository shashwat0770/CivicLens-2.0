'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { complaintAPI } from '@/services/api';
import { Complaint, ComplaintUpdate, User } from '@/types';
import toast from 'react-hot-toast';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUser,
    FaExclamationTriangle,
    FaHistory,
    FaImage,
} from 'react-icons/fa';
import {
    getStatusColor,
    getPriorityColor,
    formatDate,
    STATUS_LABELS,
    PRIORITY_LABELS,
} from '@/utils/constants';

export default function ComplaintDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));

        if (id) {
            fetchComplaint();
        }
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const response = await complaintAPI.getById(id);
            setComplaint(response.data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch complaint');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const getReporterName = (): string => {
        if (!complaint) return '';
        if (typeof complaint.reportedBy === 'object' && complaint.reportedBy !== null) {
            return (complaint.reportedBy as User).name;
        }
        return 'Unknown';
    };

    const getAssigneeName = (): string => {
        if (!complaint || !complaint.assignedTo) return 'Unassigned';
        if (typeof complaint.assignedTo === 'object' && complaint.assignedTo !== null) {
            return (complaint.assignedTo as User).name;
        }
        return 'Unknown';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 text-lg mb-4">Complaint not found</p>
                    <button onClick={() => router.back()} className="btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const updates = (complaint.updates || []).filter(
        (u): u is ComplaintUpdate => typeof u === 'object' && u !== null
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-slate-600 hover:text-primary-600 font-semibold mb-6 transition-colors"
                >
                    <FaArrowLeft />
                    <span>Back to Dashboard</span>
                </button>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column — Complaint Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-3">
                                        {complaint.title}
                                    </h1>
                                    <div className="flex items-center flex-wrap gap-3 mb-4">
                                        <span className={`badge ${getStatusColor(complaint.status)}`}>
                                            {STATUS_LABELS[complaint.status] || complaint.status}
                                        </span>
                                        <span className={`badge ${getPriorityColor(complaint.priority)}`}>
                                            {PRIORITY_LABELS[complaint.priority] || complaint.priority} Priority
                                        </span>
                                        <span className="badge bg-slate-100 text-slate-700">
                                            {complaint.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-4xl font-bold text-primary-600">
                                        {complaint.progressPercentage}%
                                    </div>
                                    <div className="text-sm text-slate-500">Progress</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-3 mb-6">
                                <div
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${complaint.progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                                <p className="text-slate-600 leading-relaxed">{complaint.description}</p>
                            </div>
                        </div>

                        {/* Image */}
                        {complaint.imageUrl && (
                            <div className="card">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                                    <FaImage className="text-primary-600" />
                                    <span>Attached Image</span>
                                </h3>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${complaint.imageUrl}`}
                                    alt="Complaint"
                                    className="rounded-xl w-full max-h-96 object-cover shadow-md"
                                />
                            </div>
                        )}

                        {/* Updates Timeline */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
                                <FaHistory className="text-primary-600" />
                                <span>Progress Updates</span>
                            </h3>

                            {updates.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No updates yet</p>
                            ) : (
                                <div className="space-y-6">
                                    {updates.map((update, index) => {
                                        const updater =
                                            typeof update.updatedBy === 'object' && update.updatedBy !== null
                                                ? (update.updatedBy as User)
                                                : null;

                                        return (
                                            <div key={update._id} className="relative pl-8">
                                                {/* Timeline line */}
                                                {index < updates.length - 1 && (
                                                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                                                )}
                                                {/* Timeline dot */}
                                                <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            {updater && (
                                                                <span className="font-semibold text-slate-800">
                                                                    {updater.name}
                                                                </span>
                                                            )}
                                                            {update.newStatus && (
                                                                <span
                                                                    className={`badge text-xs ${getStatusColor(update.newStatus)}`}
                                                                >
                                                                    {STATUS_LABELS[update.newStatus] || update.newStatus}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-slate-500">
                                                            {formatDate(update.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600">{update.comment}</p>
                                                    <div className="mt-2 text-sm text-primary-600 font-semibold">
                                                        Progress: {update.progressPercentage}%
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column — Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata Card */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <FaUser className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-slate-500">Reported By</p>
                                        <p className="font-semibold text-slate-800">{getReporterName()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <FaUser className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-slate-500">Assigned To</p>
                                        <p className="font-semibold text-slate-800">{getAssigneeName()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <FaCalendarAlt className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-slate-500">Created</p>
                                        <p className="font-semibold text-slate-800">{formatDate(complaint.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <FaCalendarAlt className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-slate-500">Last Updated</p>
                                        <p className="font-semibold text-slate-800">{formatDate(complaint.updatedAt)}</p>
                                    </div>
                                </div>

                                {complaint.resolvedAt && (
                                    <div className="flex items-start space-x-3">
                                        <FaCalendarAlt className="text-green-500 mt-1" />
                                        <div>
                                            <p className="text-sm text-slate-500">Resolved</p>
                                            <p className="font-semibold text-green-700">
                                                {formatDate(complaint.resolvedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>Location</span>
                            </h3>
                            {complaint.address && (
                                <p className="text-slate-600 mb-3">{complaint.address}</p>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-500">Latitude</p>
                                    <p className="font-mono font-semibold text-slate-800">
                                        {complaint.latitude.toFixed(6)}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-500">Longitude</p>
                                    <p className="font-mono font-semibold text-slate-800">
                                        {complaint.longitude.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                            <a
                                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary w-full mt-4 text-center block text-sm"
                            >
                                <FaMapMarkerAlt className="inline mr-2" />
                                View on Google Maps
                            </a>
                        </div>

                        {/* Priority Card */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                                <FaExclamationTriangle className="text-orange-500" />
                                <span>Priority Level</span>
                            </h3>
                            <div
                                className={`text-center py-4 rounded-xl font-bold text-lg ${getPriorityColor(complaint.priority)}`}
                            >
                                {PRIORITY_LABELS[complaint.priority] || complaint.priority}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

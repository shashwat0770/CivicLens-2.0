export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'citizen' | 'authority' | 'admin';
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface Complaint {
    _id: string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    address?: string;
    imageUrl?: string;
    status: 'submitted' | 'in_review' | 'in_progress' | 'resolved' | 'rejected';
    progressPercentage: number;
    reportedBy: User | string;
    assignedTo?: User | string;
    updates: ComplaintUpdate[] | string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ComplaintUpdate {
    _id: string;
    complaintId: string;
    updatedBy: User | string;
    comment: string;
    progressPercentage: number;
    previousStatus?: string;
    newStatus?: string;
    attachments?: string[];
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: User;
    token: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
}

export interface DashboardStats {
    overview: {
        totalComplaints: number;
        totalUsers: number;
        totalCitizens: number;
        totalAuthorities: number;
        resolvedComplaints: number;
        resolutionRate: string;
        avgResolutionTime: string;
    };
    statusDistribution: Array<{ _id: string; count: number }>;
    categoryBreakdown: Array<{ _id: string; count: number }>;
    priorityDistribution: Array<{ _id: string; count: number }>;
    recentComplaints: Complaint[];
}

export interface Location {
    lat: number;
    lng: number;
}

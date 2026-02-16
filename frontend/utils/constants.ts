export const COMPLAINT_CATEGORIES = [
    // Infrastructure
    'Road Damage',
    'Pothole',
    'Street Light',
    'Drainage',
    'Sewage',
    'Water Supply',
    'Electricity',
    'Bridge Repair',
    'Footpath Damage',
    'Traffic Signal',

    // Sanitation
    'Garbage Collection',
    'Waste Disposal',
    'Public Toilet',
    'Littering',
    'Stray Animals',
    'Mosquito Breeding',
    'Pest Control',
    'Dead Animal Removal',

    // Public Safety
    'Crime',
    'Vandalism',
    'Illegal Construction',
    'Encroachment',
    'Noise Pollution',
    'Air Pollution',
    'Water Pollution',
    'Fire Hazard',
    'Building Safety',

    // Parks & Recreation
    'Park Maintenance',
    'Playground Equipment',
    'Tree Cutting',
    'Garden Maintenance',

    // Transportation
    'Public Transport',
    'Parking Issue',
    'Traffic Congestion',
    'Road Signage',

    // Utilities
    'Gas Leak',
    'Water Leak',
    'Power Outage',
    'Telecom Issue',

    // Health
    'Hospital Services',
    'Ambulance',
    'Medical Waste',
    'Health Hazard',

    // Education
    'School Infrastructure',
    'Library Services',

    // Others
    'Corruption',
    'Government Services',
    'Document Services',
    'Other',
];

export const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    in_review: 'In Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
};

export const PRIORITY_LABELS: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
};

export const ROLE_LABELS: Record<string, string> = {
    citizen: 'Citizen',
    authority: 'Authority',
    admin: 'Admin',
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        submitted: 'bg-blue-100 text-blue-800',
        in_review: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-purple-100 text-purple-800',
        resolved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
        low: 'bg-slate-100 text-slate-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
};

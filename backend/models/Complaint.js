const mongoose = require('mongoose');

/**
 * Complaint Schema
 * Core entity for civic complaints with geolocation and status tracking
 */
const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a complaint title'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a complaint description'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: [
                // Infrastructure
                'Road Damage', 'Pothole', 'Street Light', 'Drainage', 'Sewage', 'Water Supply',
                'Electricity', 'Bridge Repair', 'Footpath Damage', 'Traffic Signal',
                // Sanitation
                'Garbage Collection', 'Waste Disposal', 'Public Toilet', 'Littering', 'Stray Animals',
                'Mosquito Breeding', 'Pest Control', 'Dead Animal Removal',
                // Public Safety
                'Crime', 'Vandalism', 'Illegal Construction', 'Encroachment', 'Noise Pollution',
                'Air Pollution', 'Water Pollution', 'Fire Hazard', 'Building Safety',
                // Parks & Recreation
                'Park Maintenance', 'Playground Equipment', 'Tree Cutting', 'Garden Maintenance',
                // Transportation
                'Public Transport', 'Parking Issue', 'Traffic Congestion', 'Road Signage',
                // Utilities
                'Gas Leak', 'Water Leak', 'Power Outage', 'Telecom Issue',
                // Health
                'Hospital Services', 'Ambulance', 'Medical Waste', 'Health Hazard',
                // Education
                'School Infrastructure', 'Library Services',
                // Others
                'Corruption', 'Government Services', 'Document Services', 'Other',
            ],
        },
        latitude: {
            type: Number,
            required: [true, 'Please provide latitude'],
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            required: [true, 'Please provide longitude'],
            min: -180,
            max: 180,
        },
        address: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['submitted', 'in_review', 'in_progress', 'resolved', 'rejected'],
            default: 'submitted',
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        updates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ComplaintUpdate',
            },
        ],
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance optimization
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ reportedBy: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ latitude: 1, longitude: 1 }); // Geospatial queries

// Update resolvedAt when status changes to resolved
complaintSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
        this.resolvedAt = new Date();
        this.progressPercentage = 100;
    }
    next();
});

module.exports = mongoose.model('Complaint', complaintSchema);

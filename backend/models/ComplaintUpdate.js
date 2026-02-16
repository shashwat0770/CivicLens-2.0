const mongoose = require('mongoose');

/**
 * ComplaintUpdate Schema
 * Tracks all updates and progress changes for complaints
 */
const complaintUpdateSchema = new mongoose.Schema(
    {
        complaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
            required: [true, 'Please provide an update comment'],
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        progressPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        previousStatus: {
            type: String,
            enum: ['submitted', 'in_review', 'in_progress', 'resolved', 'rejected'],
        },
        newStatus: {
            type: String,
            enum: ['submitted', 'in_review', 'in_progress', 'resolved', 'rejected'],
        },
        attachments: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for faster complaint lookups
complaintUpdateSchema.index({ complaintId: 1, createdAt: -1 });

module.exports = mongoose.model('ComplaintUpdate', complaintUpdateSchema);

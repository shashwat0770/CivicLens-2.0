const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const path = require('path');

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Private (Citizen)
 */
exports.createComplaint = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            latitude,
            longitude,
            address,
            priority,
        } = req.body;

        // Validation
        if (!title || !description || !category || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Handle image upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Create complaint
        const complaint = await Complaint.create({
            title,
            description,
            category,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address,
            imageUrl,
            priority: priority || 'medium',
            reportedBy: req.user.id,
        });

        // Populate user details
        await complaint.populate('reportedBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            data: complaint,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all complaints (with filters)
 * @route   GET /api/complaints
 * @access  Private
 */
exports.getComplaints = async (req, res, next) => {
    try {
        const {
            status,
            category,
            priority,
            reportedBy,
            assignedTo,
            page = 1,
            limit = 10,
            sortBy = '-createdAt',
        } = req.query;

        // Build query
        const query = {};

        // Role-based filtering
        if (req.user.role === 'citizen') {
            query.reportedBy = req.user.id;
        } else if (req.user.role === 'authority') {
            query.assignedTo = req.user.id;
        }
        // Admin can see all complaints

        // Apply filters
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (reportedBy) query.reportedBy = reportedBy;
        if (assignedTo) query.assignedTo = assignedTo;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const complaints = await Complaint.find(query)
            .populate('reportedBy', 'name email phone')
            .populate('assignedTo', 'name email phone')
            .sort(sortBy)
            .limit(parseInt(limit))
            .skip(skip);

        // Get total count
        const total = await Complaint.countDocuments(query);

        res.status(200).json({
            success: true,
            count: complaints.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: complaints,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
exports.getComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('reportedBy', 'name email phone address')
            .populate('assignedTo', 'name email phone')
            .populate({
                path: 'updates',
                populate: {
                    path: 'updatedBy',
                    select: 'name email role',
                },
                options: { sort: { createdAt: -1 } },
            });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Check authorization
        if (
            req.user.role === 'citizen' &&
            complaint.reportedBy._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint',
            });
        }

        if (
            req.user.role === 'authority' &&
            (!complaint.assignedTo ||
                complaint.assignedTo._id.toString() !== req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint',
            });
        }

        res.status(200).json({
            success: true,
            data: complaint,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update complaint
 * @route   PUT /api/complaints/:id
 * @access  Private (Authority, Admin)
 */
exports.updateComplaint = async (req, res, next) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Check authorization for authority
        if (
            req.user.role === 'authority' &&
            (!complaint.assignedTo ||
                complaint.assignedTo.toString() !== req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this complaint',
            });
        }

        const { status, priority } = req.body;

        const fieldsToUpdate = {};
        if (status) fieldsToUpdate.status = status;
        if (priority) fieldsToUpdate.priority = priority;

        complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true,
            }
        ).populate('reportedBy assignedTo', 'name email');

        res.status(200).json({
            success: true,
            message: 'Complaint updated successfully',
            data: complaint,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private (Admin only)
 */
exports.deleteComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Delete all updates associated with this complaint
        await ComplaintUpdate.deleteMany({ complaintId: req.params.id });

        // Delete complaint
        await complaint.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Complaint deleted successfully',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Assign complaint to authority
 * @route   POST /api/complaints/:id/assign
 * @access  Private (Admin only)
 */
exports.assignComplaint = async (req, res, next) => {
    try {
        const { authorityId } = req.body;

        if (!authorityId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide authority ID',
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Verify authority exists and has correct role
        const User = require('../models/User');
        const authority = await User.findById(authorityId);

        if (!authority || authority.role !== 'authority') {
            return res.status(400).json({
                success: false,
                message: 'Invalid authority ID',
            });
        }

        complaint.assignedTo = authorityId;
        if (complaint.status === 'submitted') {
            complaint.status = 'in_review';
        }
        await complaint.save();

        await complaint.populate('reportedBy assignedTo', 'name email');

        res.status(200).json({
            success: true,
            message: 'Complaint assigned successfully',
            data: complaint,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add progress update to complaint
 * @route   POST /api/complaints/:id/update-progress
 * @access  Private (Authority, Admin)
 */
exports.addProgressUpdate = async (req, res, next) => {
    try {
        const { comment, progressPercentage, newStatus } = req.body;

        if (!comment || progressPercentage === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide comment and progress percentage',
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Check authorization for authority
        if (
            req.user.role === 'authority' &&
            (!complaint.assignedTo ||
                complaint.assignedTo.toString() !== req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this complaint',
            });
        }

        // Create update
        const update = await ComplaintUpdate.create({
            complaintId: req.params.id,
            updatedBy: req.user.id,
            comment,
            progressPercentage: parseInt(progressPercentage),
            previousStatus: complaint.status,
            newStatus: newStatus || complaint.status,
        });

        // Update complaint
        complaint.progressPercentage = parseInt(progressPercentage);
        if (newStatus) {
            complaint.status = newStatus;
        }
        complaint.updates.push(update._id);
        await complaint.save();

        await update.populate('updatedBy', 'name email role');

        res.status(201).json({
            success: true,
            message: 'Progress update added successfully',
            data: update,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get complaints on map (all with coordinates)
 * @route   GET /api/complaints/map
 * @access  Private
 */
exports.getComplaintsForMap = async (req, res, next) => {
    try {
        const { status, category } = req.query;

        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const complaints = await Complaint.find(query)
            .select('title category status latitude longitude priority createdAt')
            .populate('reportedBy', 'name')
            .limit(500); // Limit for performance

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints,
        });
    } catch (error) {
        next(error);
    }
};

const User = require('../models/User');
const Complaint = require('../models/Complaint');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin only)
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Total counts
        const totalComplaints = await Complaint.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalCitizens = await User.countDocuments({ role: 'citizen' });
        const totalAuthorities = await User.countDocuments({ role: 'authority' });

        // Status distribution
        const statusDistribution = await Complaint.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Category breakdown (top 10)
        const categoryBreakdown = await Complaint.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Priority distribution
        const priorityDistribution = await Complaint.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Resolution rate
        const resolvedComplaints = await Complaint.countDocuments({
            status: 'resolved',
        });
        const resolutionRate =
            totalComplaints > 0
                ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2)
                : 0;

        // Recent complaints
        const recentComplaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email');

        // Average resolution time (for resolved complaints)
        const resolvedWithTime = await Complaint.find({
            status: 'resolved',
            resolvedAt: { $exists: true },
        }).select('createdAt resolvedAt');

        let avgResolutionTime = 0;
        if (resolvedWithTime.length > 0) {
            const totalTime = resolvedWithTime.reduce((acc, complaint) => {
                const diff = complaint.resolvedAt - complaint.createdAt;
                return acc + diff;
            }, 0);
            avgResolutionTime = Math.round(
                totalTime / resolvedWithTime.length / (1000 * 60 * 60 * 24)
            ); // Convert to days
        }

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalComplaints,
                    totalUsers,
                    totalCitizens,
                    totalAuthorities,
                    resolvedComplaints,
                    resolutionRate: `${resolutionRate}%`,
                    avgResolutionTime: `${avgResolutionTime} days`,
                },
                statusDistribution,
                categoryBreakdown,
                priorityDistribution,
                recentComplaints,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, isActive, page = 1, limit = 20 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role || !['citizen', 'authority', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid role (citizen, authority, admin)',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Toggle user active status
 * @route   PUT /api/admin/users/:id/toggle-status
 * @access  Private (Admin only)
 */
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all authorities (for assignment)
 * @route   GET /api/admin/authorities
 * @access  Private (Admin only)
 */
exports.getAuthorities = async (req, res, next) => {
    try {
        const authorities = await User.find({
            role: 'authority',
            isActive: true,
        }).select('name email phone');

        res.status(200).json({
            success: true,
            count: authorities.length,
            data: authorities,
        });
    } catch (error) {
        next(error);
    }
};

const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getAuthorities,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/**
 * Admin Routes
 * All routes require admin role
 */

router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Get authorities for assignment
router.get('/authorities', getAuthorities);

module.exports = router;

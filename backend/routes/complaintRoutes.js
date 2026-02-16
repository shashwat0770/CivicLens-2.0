const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateComplaint,
    deleteComplaint,
    assignComplaint,
    addProgressUpdate,
    getComplaintsForMap,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * Complaint Routes
 */

// Map route (should be before /:id to avoid conflicts)
router.get('/map', protect, getComplaintsForMap);

// General complaint routes
router
    .route('/')
    .get(protect, getComplaints)
    .post(protect, authorize('citizen'), upload.single('image'), createComplaint);

router
    .route('/:id')
    .get(protect, getComplaint)
    .put(protect, authorize('authority', 'admin'), updateComplaint)
    .delete(protect, authorize('admin'), deleteComplaint);

// Assignment route (admin only)
router.post(
    '/:id/assign',
    protect,
    authorize('admin'),
    assignComplaint
);

// Progress update route (authority and admin)
router.post(
    '/:id/update-progress',
    protect,
    authorize('authority', 'admin'),
    addProgressUpdate
);

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { startKeepAlive } = require('./utils/keepAlive');

// Import routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB & start keep-alive ping
connectDB().then(() => {
    startKeepAlive();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CivicLens API is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🏙️ Welcome to CivicLens API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            complaints: '/api/complaints',
            admin: '/api/admin',
            health: '/api/health',
        },
    });
});

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🏙️  CivicLens - Smart Civic Complaint Platform');
    console.log('═══════════════════════════════════════════════════');
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

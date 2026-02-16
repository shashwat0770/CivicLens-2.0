const mongoose = require('mongoose');

let intervalId = null;

const PING_INTERVAL_MS = 25 * 60 * 1000; // 25 minutes

/**
 * Sends a lightweight ping to MongoDB Atlas every 25 minutes
 * to prevent M0 free-tier auto-pause due to inactivity.
 * Reuses the existing Mongoose connection — no duplicate clients.
 */
function startKeepAlive() {
    if (intervalId) {
        console.log('⚡ Keep-alive already running');
        return;
    }

    console.log(`💓 MongoDB keep-alive started (interval: ${PING_INTERVAL_MS / 60000} min)`);

    intervalId = setInterval(async () => {
        try {
            const state = mongoose.connection.readyState;
            if (state !== 1) {
                console.warn(`⚠️  Keep-alive skipped — Mongoose state: ${state} (not connected)`);
                return;
            }

            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log(`💓 Ping OK — ${new Date().toISOString()}`);
        } catch (err) {
            console.error('❌ Keep-alive ping failed:', err.message);
        }
    }, PING_INTERVAL_MS);
}

function stopKeepAlive() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('🛑 Keep-alive stopped');
    }
}

module.exports = { startKeepAlive, stopKeepAlive };

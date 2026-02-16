require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const DEMO_USERS = [
    {
        name: 'Demo Citizen',
        email: 'citizen@demo.com',
        password: 'password123',
        role: 'citizen',
        phone: '+1 234 567 8901',
        address: '123 Main Street, Cityville',
    },
    {
        name: 'Demo Authority',
        email: 'authority@demo.com',
        password: 'password123',
        role: 'authority',
        phone: '+1 234 567 8902',
        address: 'City Municipal Office',
    },
    {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'password123',
        role: 'admin',
        phone: '+1 234 567 8903',
        address: 'City Hall, Admin Block',
    },
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        for (const userData of DEMO_USERS) {
            const exists = await User.findOne({ email: userData.email });
            if (exists) {
                console.log(`⏭️  User "${userData.email}" already exists — skipping`);
                continue;
            }

            await User.create(userData);
            console.log(`✅ Created ${userData.role}: ${userData.email}`);
        }

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedUsers();

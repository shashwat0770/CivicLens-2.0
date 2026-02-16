# 🚀 CivicLens Deployment Guide

Complete guide for deploying CivicLens to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Google Maps API Setup](#google-maps-api-setup)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] MongoDB Atlas cluster is created and accessible
- [ ] Google Maps API key is obtained and configured
- [ ] All environment variables are documented
- [ ] Code is tested locally
- [ ] Git repository is created (GitHub/GitLab)
- [ ] All dependencies are listed in package.json
- [ ] .gitignore is properly configured

### 📋 Required Accounts

1. **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas (FREE)
2. **Render** or **Railway** - https://render.com or https://railway.app (FREE tier available)
3. **Vercel** - https://vercel.com (FREE)
4. **Google Cloud Console** - https://console.cloud.google.com (FREE tier)

---

## Backend Deployment (Render)

### Step 1: Prepare Your Code

1. Ensure your `package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Create a `render.yaml` (optional but recommended):
```yaml
services:
  - type: web
    name: civiclens-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### Step 2: Deploy to Render

1. **Sign up/Login** to [Render](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing CivicLens

3. **Configure Service**
   - **Name**: `civiclens-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**

   Click "Advanced" → "Add Environment Variable" and add:

   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://tripathishashwatftp_db_user:6J0jTWj4En0Bg9fb@cluster0.fkuqvfs.mongodb.net/civiclens?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

   **⚠️ IMPORTANT**: Change `JWT_SECRET` to a strong random string!

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be available at: `https://civiclens-backend.onrender.com`

6. **Test Backend**
   ```bash
   curl https://civiclens-backend.onrender.com/api/health
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "CivicLens API is running",
     "timestamp": "2024-..."
   }
   ```

### Alternative: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Railway will auto-deploy

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update `next.config.js` for production:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'civiclens-backend.onrender.com'],
  },
  output: 'standalone', // Optional: for smaller builds
}

module.exports = nextConfig
```

2. Ensure `.env.local` is in `.gitignore` (it should be)

### Step 2: Deploy to Vercel

1. **Sign up/Login** to [Vercel](https://vercel.com)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**

   In the "Environment Variables" section, add:

   ```
   NEXT_PUBLIC_API_URL=https://civiclens-backend.onrender.com/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

   **Replace** `https://civiclens-backend.onrender.com` with your actual Render backend URL!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - Your app will be live at: `https://civiclens.vercel.app` (or custom domain)

6. **Configure Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Database Setup (MongoDB Atlas)

Your MongoDB is already configured! But here's how to verify:

### Verify Connection

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login with your credentials
3. Navigate to your cluster (Cluster0)
4. Click "Connect" → "Connect your application"
5. Verify connection string matches your `.env`:
   ```
   mongodb+srv://tripathishashwatftp_db_user:6J0jTWj4En0Bg9fb@cluster0.fkuqvfs.mongodb.net/civiclens?retryWrites=true&w=majority
   ```

### Configure Network Access

1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Render/Railway to connect
4. Click "Confirm"

### Create Database User (Already Done)

Your user is already created:
- Username: `tripathishashwatftp_db_user`
- Password: `6J0jTWj4En0Bg9fb`

### Monitor Database

- Go to "Metrics" tab to see connection stats
- Go to "Collections" to view your data
- Expected collections: `users`, `complaints`, `complaintupdates`

---

## Google Maps API Setup

### Step 1: Create Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "CivicLens"
3. Select the project

### Step 2: Enable APIs

1. Go to "APIs & Services" → "Library"
2. Search and enable:
   - **Maps JavaScript API**
   - **Geocoding API** (optional, for address lookup)
   - **Places API** (optional, for location search)

### Step 3: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Click "Restrict Key" (recommended)

### Step 4: Restrict API Key (Security)

1. **Application Restrictions**:
   - Select "HTTP referrers (websites)"
   - Add your domains:
     ```
     https://civiclens.vercel.app/*
     https://*.vercel.app/*
     http://localhost:3000/*
     ```

2. **API Restrictions**:
   - Select "Restrict key"
   - Select: Maps JavaScript API, Geocoding API, Places API

3. Save

### Step 5: Update Environment Variables

Update both backend and frontend `.env` files with your API key:

**Backend (.env)**:
```
GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key
```

Then redeploy both services.

---

## Post-Deployment Testing

### 1. Test Backend Health

```bash
curl https://your-backend-url.onrender.com/api/health
```

### 2. Test Registration

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "citizen"
  }'
```

### 3. Test Frontend

1. Visit your Vercel URL
2. Register a new account
3. Login
4. Submit a test complaint
5. Verify it appears in the dashboard

### 4. Create Admin User

Use the API to create an admin:

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@civiclens.com",
    "password": "SecureAdminPass123!",
    "role": "admin"
  }'
```

Save the admin credentials securely!

---

## Backend CORS Configuration

Update `server.js` to allow your Vercel domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://civiclens.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

Commit and push to trigger redeployment.

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Ensure backend is running (check Render logs)
3. Verify CORS is configured correctly
4. Check browser console for errors

### Issue: MongoDB connection failed

**Solution**:
1. Verify MongoDB Atlas Network Access allows 0.0.0.0/0
2. Check connection string is correct
3. Verify database user has read/write permissions
4. Check Render logs for specific error

### Issue: Google Maps not loading

**Solution**:
1. Verify API key is correct in environment variables
2. Check API key restrictions allow your domain
3. Ensure Maps JavaScript API is enabled
4. Check browser console for specific errors

### Issue: Image uploads failing

**Solution**:
1. Render's free tier has ephemeral storage
2. Consider using cloud storage (AWS S3, Cloudinary)
3. For now, images will be lost on server restart
4. Implement cloud storage for production

### Issue: Slow backend response

**Solution**:
1. Render free tier spins down after inactivity
2. First request after idle takes 30-60 seconds
3. Upgrade to paid tier for always-on service
4. Or use Railway which has better free tier

---

## Production Optimizations

### 1. Enable Compression

Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Enable Helmet for Security

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Set up Cloud Storage

For production, use Cloudinary or AWS S3 for image uploads instead of local storage.

---

## Monitoring & Maintenance

### Backend Monitoring (Render)

1. Go to your service dashboard
2. Check "Logs" tab for errors
3. Monitor "Metrics" for performance
4. Set up "Alerts" for downtime

### Frontend Monitoring (Vercel)

1. Go to project dashboard
2. Check "Analytics" for traffic
3. Monitor "Logs" for errors
4. Review "Deployments" history

### Database Monitoring (MongoDB Atlas)

1. Check "Metrics" for performance
2. Monitor "Real-time" tab for active connections
3. Set up "Alerts" for high usage
4. Review "Performance Advisor" for optimization tips

---

## Backup Strategy

### Database Backups

MongoDB Atlas automatically backs up your data. To create manual backup:

1. Go to "Backup" tab in Atlas
2. Click "Take Snapshot Now"
3. Download backup if needed

### Code Backups

- Your code is in Git (GitHub/GitLab)
- Vercel and Render keep deployment history
- Tag releases: `git tag v1.0.0 && git push --tags`

---

## Scaling Considerations

### When to Upgrade

- **Backend**: Upgrade Render when you exceed free tier limits
- **Database**: Upgrade MongoDB when you exceed 512MB storage
- **Frontend**: Vercel scales automatically

### Performance Tips

1. Add database indexes for frequently queried fields
2. Implement caching (Redis)
3. Use CDN for static assets
4. Optimize images before upload
5. Implement pagination for large datasets

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS only (enforced by Vercel/Render)
- [ ] Restrict Google Maps API key
- [ ] Enable MongoDB IP whitelist
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use helmet.js for security headers
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com

---

**Congratulations! 🎉 Your CivicLens platform is now live!**

Share your deployment URL and start making your city better! 🏙️

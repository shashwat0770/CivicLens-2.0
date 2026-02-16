# 🚀 Quick Setup Guide for CivicLens

## Step-by-Step Installation

### 1. Install Backend Dependencies

```powershell
cd a:\CivicLens\backend
npm install
```

### 2. Install Frontend Dependencies

```powershell
cd a:\CivicLens\frontend
npm install
```

### 3. Configure Environment Variables

#### Backend (.env)
The backend `.env` file is already configured with your MongoDB credentials:
```
MONGO_URI=mongodb+srv://tripathishashwatftp_db_user:6J0jTWj4En0Bg9fb@cluster0.fkuqvfs.mongodb.net/civiclens?retryWrites=true&w=majority
```

**IMPORTANT**: Get a Google Maps API Key:
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Update in backend `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

#### Frontend (.env.local)
Update the Google Maps API key:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Start the Backend Server

```powershell
cd a:\CivicLens\backend
npm run dev
```

You should see:
```
═══════════════════════════════════════════════════
🏙️  CivicLens - Smart Civic Complaint Platform
═══════════════════════════════════════════════════
🚀 Server running in development mode
📡 Server: http://localhost:5000
🔗 API Base: http://localhost:5000/api
💚 Health Check: http://localhost:5000/api/health
═══════════════════════════════════════════════════
✅ MongoDB Connected: cluster0.fkuqvfs.mongodb.net
📊 Database: civiclens
```

### 5. Start the Frontend Server (New Terminal)

```powershell
cd a:\CivicLens\frontend
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### 6. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 7. Create Your First Admin User

You can register through the UI or use this API call:

```powershell
# Using PowerShell
$body = @{
    name = "Admin User"
    email = "admin@civiclens.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

Or use the registration page at http://localhost:3000/register

### 8. Test the Application

1. **Register** as a citizen at http://localhost:3000/register
2. **Login** at http://localhost:3000/login
3. **Submit a complaint** from the citizen dashboard
4. **Track progress** in real-time

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: Check your internet connection and verify the MongoDB URI is correct in `.env`

### Issue: Port 5000 already in use
**Solution**: Change the PORT in backend `.env` to another port (e.g., 5001)

### Issue: Frontend can't connect to backend
**Solution**: Ensure backend is running and update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Issue: Google Maps not loading
**Solution**: 
1. Verify you have a valid Google Maps API key
2. Enable "Maps JavaScript API" in Google Cloud Console
3. Update the key in both backend `.env` and frontend `.env.local`

### Issue: Image upload fails
**Solution**: Ensure the `uploads` folder exists in the backend directory:
```powershell
cd a:\CivicLens\backend
mkdir uploads
```

## Production Deployment Checklist

### Backend (Render/Railway)
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure CORS for your frontend domain
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Enable MongoDB connection string with SSL

### Frontend (Vercel)
- [ ] Update NEXT_PUBLIC_API_URL to production backend URL
- [ ] Add Google Maps API key
- [ ] Test all routes
- [ ] Enable analytics (optional)

## Testing the API

### Test Health Endpoint
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

### Test Registration
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "citizen"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Test Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

## Next Steps

1. **Customize Categories**: Edit `backend/models/Complaint.js` to add/remove categories
2. **Add Email Notifications**: Integrate SendGrid or Nodemailer
3. **Add SMS Alerts**: Integrate Twilio
4. **Enhance Maps**: Add clustering and heatmaps
5. **Add Analytics**: Integrate Google Analytics
6. **Add PWA Support**: Make it installable on mobile

## Support

For issues or questions:
1. Check the main README.md
2. Review API documentation
3. Check browser console for errors
4. Check backend terminal for errors

---

**Happy Building! 🏙️**

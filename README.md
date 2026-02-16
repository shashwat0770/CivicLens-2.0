# 🏙️ CivicLens - Smart Civic Complaint Platform

A complete, production-ready full-stack web application for reporting and managing civic complaints with real-time tracking, geolocation, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)

## ✨ Features

### For Citizens
- 📝 Submit civic complaints with photos
- 📍 Geotag complaint locations using Google Maps
- 📊 Track complaint status in real-time
- 🔔 View progress updates and history
- 🗺️ Interactive map view of all complaints

### For Authorities
- 📋 View assigned complaints
- ✅ Update complaint status and progress
- 💬 Add comments and updates
- 🎯 Filter complaints by status/category
- 📈 Track resolution metrics

### For Admins
- 👥 Manage users and roles
- 🎯 Assign complaints to authorities
- 📊 Comprehensive dashboard analytics
- 📈 View resolution rates and statistics
- 🗂️ Manage all complaints system-wide

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Maps**: Google Maps JavaScript API
- **Charts**: Chart.js
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt.js
- **File Upload**: Multer
- **Validation**: Express Validator
- **CORS**: Enabled

## 📁 Project Structure

```
CivicLens/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── complaintController.js # Complaint CRUD operations
│   │   └── adminController.js    # Admin operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   ├── errorHandler.js       # Global error handling
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Complaint.js          # Complaint schema
│   │   └── ComplaintUpdate.js    # Update schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── complaintRoutes.js    # Complaint endpoints
│   │   └── adminRoutes.js        # Admin endpoints
│   ├── uploads/                  # Uploaded images
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── dashboard/
    │   │   ├── citizen/          # Citizen dashboard
    │   │   ├── authority/        # Authority dashboard
    │   │   └── admin/            # Admin dashboard
    │   ├── login/                # Login page
    │   ├── register/             # Registration page
    │   ├── layout.tsx            # Root layout
    │   ├── page.tsx              # Landing page
    │   └── globals.css           # Global styles
    ├── components/
    │   ├── Navbar.tsx            # Navigation bar
    │   ├── Map.tsx               # Google Maps component
    │   ├── ComplaintForm.tsx     # Complaint submission form
    │   └── ComplaintCard.tsx     # Complaint display card
    ├── services/
    │   └── api.ts                # API client & endpoints
    ├── types/
    │   └── index.ts              # TypeScript definitions
    ├── utils/
    │   └── constants.ts          # Constants & helpers
    ├── .env.local                # Frontend environment variables
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Google Maps API Key** - [Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CivicLens
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already created with your MongoDB credentials)
# Verify the .env file contains:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://tripathishashwatftp_db_user:6J0jTWj4En0Bg9fb@cluster0.fkuqvfs.mongodb.net/civiclens?retryWrites=true&w=majority
JWT_SECRET=civiclens_super_secret_jwt_key_2024_production_ready
JWT_EXPIRE=7d
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Create uploads directory
mkdir uploads
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
# Update with your Google Maps API key:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🏃 Running Locally

### Start Backend Server

```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen",
  "phone": "+1234567890",
  "address": "123 Main St"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": { ...user },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": { ...user },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ...user }
}
```

### Complaint Endpoints

#### Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- title: "Pothole on Main Street"
- description: "Large pothole causing traffic issues"
- category: "Pothole"
- latitude: 40.7128
- longitude: -74.0060
- address: "Main Street, City"
- priority: "high"
- image: <file>

Response:
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": { ...complaint }
}
```

#### Get All Complaints
```http
GET /api/complaints?status=submitted&category=Pothole&page=1&limit=10
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [ ...complaints ]
}
```

#### Get Single Complaint
```http
GET /api/complaints/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ...complaint with populated fields }
}
```

#### Update Complaint Status
```http
PUT /api/complaints/:id
Authorization: Bearer <token> (Authority/Admin)
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "high"
}

Response:
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": { ...complaint }
}
```

#### Assign Complaint
```http
POST /api/complaints/:id/assign
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "authorityId": "authority_user_id"
}

Response:
{
  "success": true,
  "message": "Complaint assigned successfully",
  "data": { ...complaint }
}
```

#### Add Progress Update
```http
POST /api/complaints/:id/update-progress
Authorization: Bearer <token> (Authority/Admin)
Content-Type: application/json

{
  "comment": "Work started on fixing the pothole",
  "progressPercentage": 50,
  "newStatus": "in_progress"
}

Response:
{
  "success": true,
  "message": "Progress update added successfully",
  "data": { ...update }
}
```

#### Get Complaints for Map
```http
GET /api/complaints/map?status=submitted
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 100,
  "data": [ ...complaints with coordinates ]
}
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Bearer <token> (Admin only)

Response:
{
  "success": true,
  "data": {
    "overview": {
      "totalComplaints": 150,
      "totalUsers": 75,
      "totalCitizens": 60,
      "totalAuthorities": 14,
      "resolvedComplaints": 45,
      "resolutionRate": "30.00%",
      "avgResolutionTime": "5 days"
    },
    "statusDistribution": [...],
    "categoryBreakdown": [...],
    "priorityDistribution": [...],
    "recentComplaints": [...]
  }
}
```

#### Get All Users
```http
GET /api/admin/users?role=citizen&page=1&limit=20
Authorization: Bearer <token> (Admin only)

Response:
{
  "success": true,
  "count": 20,
  "total": 75,
  "page": 1,
  "pages": 4,
  "data": [ ...users ]
}
```

#### Update User Role
```http
PUT /api/admin/users/:id/role
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "role": "authority"
}

Response:
{
  "success": true,
  "message": "User role updated successfully",
  "data": { ...user }
}
```

## 🌐 Deployment

### Backend Deployment (Render/Railway)

#### Using Render:

1. Create account on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables from `.env`
6. Deploy

#### Using Railway:

1. Create account on [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy automatically

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
6. Deploy

### Post-Deployment

1. Update frontend `.env.local` with production API URL
2. Update CORS settings in backend if needed
3. Test all functionality
4. Create initial admin user via API or database

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | your_secret_key |
| JWT_EXPIRE | Token expiration | 7d |
| GOOGLE_MAPS_API_KEY | Google Maps API key | AIza... |
| MAX_FILE_SIZE | Max upload size in bytes | 5242880 |
| UPLOAD_PATH | Upload directory | ./uploads |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:5000/api |
| NEXT_PUBLIC_GOOGLE_MAPS_API_KEY | Google Maps API key | AIza... |

## 👥 User Roles

### Citizen
- Submit complaints
- View own complaints
- Track complaint progress
- View complaint map

### Authority
- View assigned complaints
- Update complaint status
- Add progress updates
- Manage assigned cases

### Admin
- Full system access
- Assign complaints
- Manage users
- View analytics
- Change user roles

## 🎨 Complaint Categories (100+)

The system supports 50+ complaint categories including:

**Infrastructure**: Road Damage, Pothole, Street Light, Drainage, Sewage, Water Supply, Electricity, Bridge Repair, Footpath Damage, Traffic Signal

**Sanitation**: Garbage Collection, Waste Disposal, Public Toilet, Littering, Stray Animals, Mosquito Breeding, Pest Control, Dead Animal Removal

**Public Safety**: Crime, Vandalism, Illegal Construction, Encroachment, Noise Pollution, Air Pollution, Water Pollution, Fire Hazard, Building Safety

**Parks & Recreation**: Park Maintenance, Playground Equipment, Tree Cutting, Garden Maintenance

**Transportation**: Public Transport, Parking Issue, Traffic Congestion, Road Signage

**Utilities**: Gas Leak, Water Leak, Power Outage, Telecom Issue

**Health**: Hospital Services, Ambulance, Medical Waste, Health Hazard

**Education**: School Infrastructure, Library Services

**Others**: Corruption, Government Services, Document Services, Other

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Protected routes
- ✅ CORS configuration
- ✅ File upload restrictions
- ✅ MongoDB injection prevention

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for making cities better

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Google Maps for geolocation services
- Next.js team for the amazing framework
- TailwindCSS for beautiful styling

---

**Need Help?** Open an issue or contact support.

**Happy Coding! 🚀**

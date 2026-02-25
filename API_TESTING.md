# 🧪 CivicLens API Testing Guide

Quick reference for testing all API endpoints using PowerShell or curl.

## 🔧 Setup

```powershell
# Set your backend URL
$API_URL = "http://localhost:5000/api"
# Or for production:
# $API_URL = "https://your-backend.onrender.com/api"
```

---

## 1️⃣ Authentication Tests

### Register New User (Citizen)

```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    role = "citizen"
    phone = "+1234567890"
    address = "123 Main St"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
Write-Host "User ID: $($response.data._id)"
```

### Register Authority

```powershell
$body = @{
    name = "Authority User"
    email = "authority@example.com"
    password = "password123"
    role = "authority"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Register Admin

```powershell
$body = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $body -ContentType "application/json"
$adminToken = $adminResponse.token
```

### Login

```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Logged in! Token: $token"
```

### Get Current User

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "$API_URL/auth/me" -Method GET -Headers $headers
```

---

## 2️⃣ Complaint Tests

### Create Complaint (Text Only)

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$body = @{
    title = "Pothole on Main Street"
    description = "Large pothole causing traffic issues near intersection"
    category = "Pothole"
    latitude = 40.7128
    longitude = -74.0060
    address = "Main Street, New York, NY"
    priority = "high"
} | ConvertTo-Json

$complaint = Invoke-RestMethod -Uri "$API_URL/complaints" -Method POST -Body $body -Headers $headers -ContentType "application/json"
$complaintId = $complaint.data._id
Write-Host "Complaint created! ID: $complaintId"
```

### Create Complaint with Image (Using curl)

```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Broken Street Light" \
  -F "description=Street light not working for 3 days" \
  -F "category=Street Light" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060" \
  -F "address=5th Avenue, NY" \
  -F "priority=medium" \
  -F "image=@/path/to/image.jpg"
```

### Get All Complaints

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "$API_URL/complaints" -Method GET -Headers $headers
```

### Get Complaints with Filters

```powershell
$params = @{
    status = "submitted"
    category = "Pothole"
    page = 1
    limit = 10
}

$queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"

Invoke-RestMethod -Uri "$API_URL/complaints?$queryString" -Method GET -Headers $headers
```

### Get Single Complaint

```powershell
Invoke-RestMethod -Uri "$API_URL/complaints/$complaintId" -Method GET -Headers $headers
```

### Update Complaint Status (Authority/Admin)

```powershell
$headers = @{
    Authorization = "Bearer $authorityToken"
}

$body = @{
    status = "in_progress"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/complaints/$complaintId" -Method PUT -Body $body -Headers $headers -ContentType "application/json"
```

### Add Progress Update (Authority/Admin)

```powershell
$headers = @{
    Authorization = "Bearer $authorityToken"
}

$body = @{
    comment = "Work has started on fixing the pothole. Expected completion in 2 days."
    progressPercentage = 50
    newStatus = "in_progress"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/complaints/$complaintId/update-progress" -Method POST -Body $body -Headers $headers -ContentType "application/json"
```

### Get Complaints for Map

```powershell
Invoke-RestMethod -Uri "$API_URL/complaints/map" -Method GET -Headers $headers
```

---

## 3️⃣ Admin Tests

### Get Dashboard Statistics

```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

$stats = Invoke-RestMethod -Uri "$API_URL/admin/dashboard" -Method GET -Headers $headers
$stats.data | ConvertTo-Json -Depth 5
```

### Get All Users

```powershell
Invoke-RestMethod -Uri "$API_URL/admin/users" -Method GET -Headers $headers
```

### Get Users by Role

```powershell
Invoke-RestMethod -Uri "$API_URL/admin/users?role=citizen" -Method GET -Headers $headers
```

### Update User Role

```powershell
$userId = "USER_ID_HERE"

$body = @{
    role = "authority"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/admin/users/$userId/role" -Method PUT -Body $body -Headers $headers -ContentType "application/json"
```

### Toggle User Status

```powershell
Invoke-RestMethod -Uri "$API_URL/admin/users/$userId/toggle-status" -Method PUT -Headers $headers
```

### Assign Complaint to Authority

```powershell
$authorityId = "AUTHORITY_USER_ID"

$body = @{
    authorityId = $authorityId
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/complaints/$complaintId/assign" -Method POST -Body $body -Headers $headers -ContentType "application/json"
```

### Get All Authorities

```powershell
Invoke-RestMethod -Uri "$API_URL/admin/authorities" -Method GET -Headers $headers
```

---

## 4️⃣ Health Check

### Check API Health

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

Expected response:
```json
{
  "success": true,
  "message": "CivicLens API is running",
  "timestamp": "2024-..."
}
```

---

## 5️⃣ Complete Test Flow

### Full Workflow Test

```powershell
# 1. Register Citizen
$citizenBody = @{
    name = "Test Citizen"
    email = "citizen@test.com"
    password = "test123"
    role = "citizen"
} | ConvertTo-Json

$citizenRes = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $citizenBody -ContentType "application/json"
$citizenToken = $citizenRes.token

# 2. Register Authority
$authorityBody = @{
    name = "Test Authority"
    email = "authority@test.com"
    password = "test123"
    role = "authority"
} | ConvertTo-Json

$authorityRes = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $authorityBody -ContentType "application/json"
$authorityToken = $authorityRes.token
$authorityId = $authorityRes.data._id

# 3. Register Admin
$adminBody = @{
    name = "Test Admin"
    email = "admin@test.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

$adminRes = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $adminBody -ContentType "application/json"
$adminToken = $adminRes.token

# 4. Citizen submits complaint
$headers = @{ Authorization = "Bearer $citizenToken" }

$complaintBody = @{
    title = "Test Complaint"
    description = "This is a test complaint"
    category = "Pothole"
    latitude = 40.7128
    longitude = -74.0060
    priority = "medium"
} | ConvertTo-Json

$complaintRes = Invoke-RestMethod -Uri "$API_URL/complaints" -Method POST -Body $complaintBody -Headers $headers -ContentType "application/json"
$complaintId = $complaintRes.data._id

Write-Host "✅ Complaint created: $complaintId"

# 5. Admin assigns complaint to authority
$headers = @{ Authorization = "Bearer $adminToken" }

$assignBody = @{
    authorityId = $authorityId
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/complaints/$complaintId/assign" -Method POST -Body $assignBody -Headers $headers -ContentType "application/json"

Write-Host "✅ Complaint assigned to authority"

# 6. Authority updates complaint
$headers = @{ Authorization = "Bearer $authorityToken" }

$updateBody = @{
    comment = "Work in progress"
    progressPercentage = 50
    newStatus = "in_progress"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/complaints/$complaintId/update-progress" -Method POST -Body $updateBody -Headers $headers -ContentType "application/json"

Write-Host "✅ Complaint updated by authority"

# 7. Get dashboard stats
$headers = @{ Authorization = "Bearer $adminToken" }
$stats = Invoke-RestMethod -Uri "$API_URL/admin/dashboard" -Method GET -Headers $headers

Write-Host "✅ Dashboard stats retrieved"
Write-Host "Total Complaints: $($stats.data.overview.totalComplaints)"
Write-Host "Total Users: $($stats.data.overview.totalUsers)"

Write-Host "`n🎉 Complete workflow test passed!"
```

---

## 6️⃣ Error Testing

### Test Invalid Login

```powershell
$body = @{
    email = "wrong@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $body -ContentType "application/json"
} catch {
    Write-Host "❌ Expected error: $($_.Exception.Message)"
}
```

### Test Unauthorized Access

```powershell
try {
    Invoke-RestMethod -Uri "$API_URL/admin/dashboard" -Method GET
} catch {
    Write-Host "❌ Expected error: Unauthorized"
}
```

### Test Invalid Complaint Data

```powershell
$headers = @{ Authorization = "Bearer $token" }

$body = @{
    title = "Test"
    # Missing required fields
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$API_URL/complaints" -Method POST -Body $body -Headers $headers -ContentType "application/json"
} catch {
    Write-Host "❌ Expected error: Missing required fields"
}
```

---

## 7️⃣ Performance Testing

### Bulk Create Complaints

```powershell
$headers = @{ Authorization = "Bearer $citizenToken" }

1..10 | ForEach-Object {
    $body = @{
        title = "Test Complaint $_"
        description = "Description for complaint $_"
        category = "Pothole"
        latitude = 40.7128 + ($_ * 0.01)
        longitude = -74.0060 + ($_ * 0.01)
        priority = "medium"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$API_URL/complaints" -Method POST -Body $body -Headers $headers -ContentType "application/json"
    Write-Host "Created complaint $_"
}
```

---

## 📊 Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [ ... ]
}
```

---

## 🔍 Debugging Tips

### View Full Response

```powershell
$response = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 5
```

### Check Response Headers

```powershell
$response = Invoke-WebRequest -Uri "$API_URL/health" -Method GET
$response.Headers
```

### Save Token for Reuse

```powershell
# Save token to file
$token | Out-File -FilePath "token.txt"

# Load token from file
$token = Get-Content "token.txt"
```

---

## ✅ Testing Checklist

- [ ] Health check works
- [ ] Can register citizen
- [ ] Can register authority
- [ ] Can register admin
- [ ] Can login with valid credentials
- [ ] Cannot login with invalid credentials
- [ ] Can get current user
- [ ] Can create complaint
- [ ] Can get all complaints
- [ ] Can get single complaint
- [ ] Can update complaint (authority)
- [ ] Can add progress update
- [ ] Can assign complaint (admin)
- [ ] Can get dashboard stats (admin)
- [ ] Can manage users (admin)
- [ ] Unauthorized requests fail properly

---

**Happy Testing! 🧪**

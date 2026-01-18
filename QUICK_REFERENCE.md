# Quick Reference Card

## 🚀 START THE PROJECT (30 seconds)

### Terminal 1
```bash
cd government-portal/backend
npm install
npm run dev
```

### Terminal 2
```bash
cd government-portal/frontend
npm install
npm start
```

## 🔑 ADMIN LOGIN CREDENTIALS
- **Username:** admin
- **Password:** admin@123

## 📍 URLS
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

## 📁 IMPORTANT FILES

### Backend
- `server.js` - Main server file
- `models/Job.js` - Job schema
- `controllers/jobController.js` - Job logic
- `routes/jobRoutes.js` - Job endpoints

### Frontend
- `App.js` - Main app component
- `pages/AdminDashboard.js` - Admin panel
- `pages/AdminLogin.js` - Login page
- `services/api.js` - API calls
- `styles/main.css` - All styling

## 🗄️ DATABASE
- **Name:** government-portal
- **Connection:** mongodb://localhost:27017/government-portal
- **Collections:** jobs, admins

## 📋 KEY ENDPOINTS

### Public
- `GET /api/jobs` - All jobs
- `GET /api/jobs/:id` - Single job
- `GET /api/jobs/search?query=X` - Search
- `GET /api/jobs/:id/download` - Download PDF

### Admin (Need Token)
- `POST /api/admin/login` - Login
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

## 🔧 COMMON COMMANDS

```bash
# Backend
cd backend && npm run dev          # Start dev server
npm install                         # Install deps
npm start                          # Production

# Frontend
cd frontend && npm start           # Start dev
npm run build                      # Build for prod
npm install                        # Install deps

# Database
mongod                             # Start MongoDB
mongo                              # Open MongoDB shell
```

## ⚙️ ENVIRONMENT VARIABLES

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/government-portal
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🆘 QUICK FIXES

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `netstat -ano \| findstr :5000` then `taskkill /PID <pid> /F` |
| MongoDB not found | Install MongoDB or start `mongod` |
| Blank page | Clear cache, check console errors |
| Login fails | Check .env credentials, restart backend |
| PDF upload fails | Check file < 10MB, PDF format |
| CORS error | Check backend CORS config |

## 📊 JOB FORM FIELDS

**Required:**
- Job Title
- Department
- Description
- Last Date to Apply
- PDF File

**Optional:**
- Number of Positions
- Salary
- Eligibility
- Application Link
- Status (Active/Closed/Expired)

## 🎨 COLOR SCHEME
- Primary: #1e3a5f (Navy Blue)
- Secondary: #f39c12 (Orange)
- Success: #27ae60 (Green)
- Danger: #e74c3c (Red)
- Background: #f5f5f5 (Light Gray)

## 📱 RESPONSIVE BREAKPOINTS
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## 🔐 SECURITY
- Passwords: hashed with bcryptjs
- Auth: JWT tokens (24hr expiry)
- Files: PDF only, 10MB limit
- Routes: Protected with middleware

## 📚 DOCUMENTATION
- `README.md` - Full documentation
- `SETUP.md` - Installation guide
- `API_DOCUMENTATION.md` - API reference
- `COMPLETE_GUIDE.md` - Complete guide
- `PROJECT_OVERVIEW.md` - Overview

## 💡 TIPS
1. First time? Follow SETUP.md
2. Having issues? Check troubleshooting
3. Want to customize? See COMPLETE_GUIDE.md
4. Need API reference? See API_DOCUMENTATION.md
5. Deploy? See COMPLETE_GUIDE.md deployment section

## 🎯 WHAT YOU CAN DO

### As a Public User
- ✅ Browse job listings
- ✅ Search by keywords
- ✅ Filter by department
- ✅ Download PDF files
- ✅ Click apply links

### As an Admin
- ✅ Login securely
- ✅ Add job notifications
- ✅ Edit job details
- ✅ Delete jobs
- ✅ Upload PDFs
- ✅ Manage status

---

**Quick tip:** Bookmark this file for quick reference! 📌

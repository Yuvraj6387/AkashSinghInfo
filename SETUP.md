# Setup Instructions

## Quick Start Guide

### System Requirements
- Node.js 14+ 
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Modern web browser
- 4GB RAM minimum

### Step 1: Clone and Navigate to Project
```bash
cd government-portal
```

### Step 2: Backend Setup

#### Install MongoDB (if not installed)
- **Windows:** Download from https://www.mongodb.com/try/download/community
- **Mac:** `brew install mongodb-community`
- **Linux:** Follow MongoDB official documentation

#### Start MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Setup Backend
```bash
cd backend
npm install
```

#### Configure Backend (.env file)
Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/government-portal
JWT_SECRET=your_secure_random_key_12345
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
NODE_ENV=development
```

#### Run Backend
```bash
npm run dev
```
Expected output: `Server running on port 5000`

### Step 3: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
```

#### Run Frontend
```bash
npm start
```
Application will open automatically at `http://localhost:3000`

### Step 4: Testing the Application

#### Public User Testing
1. Go to `http://localhost:3000`
2. View job list (currently empty on first run)
3. Test search functionality

#### Admin Testing
1. Click "Admin Login" button
2. Enter credentials:
   - Username: `admin`
   - Password: `admin@123`
3. Click "Admin Dashboard"
4. Add a test job:
   - Title: "Software Engineer"
   - Department: "IT"
   - Description: "Test job description"
   - Last Date: Pick a future date
   - Upload a PDF (use any PDF file)
   - Click "Create Job"
5. Go back to home page and verify job appears

## API Base URL
- Backend: http://localhost:5000
- Frontend API calls: http://localhost:5000/api

## Database Connection
- Default: `mongodb://localhost:27017/government-portal`
- For MongoDB Atlas: Update connection string in `.env`

## File Uploads
- PDF files stored in: `backend/uploads/`
- Maximum file size: 10MB
- Only PDF format allowed

## Important Notes

1. **First Time Setup:** Backend will create MongoDB collections automatically
2. **Admin Credentials:** Change default credentials in production
3. **JWT Secret:** Use a complex random string in production
4. **CORS:** Only allows localhost:3000 by default (modify in backend/server.js for production)

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Refused
- Ensure MongoDB is running
- Check if port 27017 is available
- Verify connection string in .env

### Node modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment Checklist

- [ ] Change ADMIN_USERNAME and ADMIN_PASSWORD
- [ ] Generate new JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS
- [ ] Configure environment variables on hosting platform
- [ ] Test all API endpoints
- [ ] Set up backup strategy

## Helpful Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm start           # Start production server

# Frontend
cd frontend
npm start           # Start development server
npm run build       # Build for production

# Database
# Reset database (WARNING: deletes all data)
# Connect to MongoDB and run:
# db.dropDatabase()
```

## Need Help?
1. Check the README.md for detailed documentation
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check console logs for error messages
5. Verify .env files are configured correctly

---

Happy coding! 🚀

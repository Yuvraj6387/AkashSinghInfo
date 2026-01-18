# Government Job Notification Portal - MERN Stack

A full-stack MERN (MongoDB, Express, React, Node.js) application for a government job notification portal.

## Features

### Public Features
- ✅ View latest government job notifications
- ✅ Search jobs by title, department, and keywords
- ✅ Filter jobs by department
- ✅ Download PDF notifications
- ✅ Responsive design (mobile + desktop)
- ✅ Job deadline alerts
- ✅ Direct application links

### Admin Features
- ✅ Secure admin login with JWT authentication
- ✅ Add new job notifications
- ✅ Edit existing job notifications
- ✅ Delete job notifications
- ✅ Upload PDF files for job notifications
- ✅ Manage job status (Active, Closed, Expired)
- ✅ Add additional job details (salary, positions, eligibility, etc.)

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Multer** - File upload middleware
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS** - Custom styling
- **Bootstrap** - Optional UI framework

## Project Structure

```
government-portal/
├── backend/
│   ├── controllers/
│   │   ├── jobController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Job.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── jobRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobList.js
│   │   │   ├── JobCard.js
│   │   │   ├── Navigation.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Edit `.env` file and update:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/government-portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
NODE_ENV=development
```

4. **Start MongoDB:**
```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas connection string
```

5. **Start the backend server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Edit `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server:**
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## API Endpoints

### Public Endpoints

#### Get All Jobs
```
GET /api/jobs
Response: Array of job objects
```

#### Get Job by ID
```
GET /api/jobs/:id
Response: Single job object
```

#### Search Jobs
```
GET /api/jobs/search?query=keyword&department=department_name
Response: Filtered jobs array
```

#### Download PDF
```
GET /api/jobs/:id/download
Response: PDF file
```

### Admin Endpoints (Protected - Requires JWT Token)

#### Admin Login
```
POST /api/admin/login
Body: { username, password }
Response: { token, admin }
```

#### Verify Token
```
GET /api/admin/verify
Headers: Authorization: Bearer <token>
Response: { admin }
```

#### Create Job (Admin)
```
POST /api/jobs
Headers: Authorization: Bearer <token>
Body: FormData with:
  - title
  - department
  - description
  - lastDateToApply
  - numberOfPositions (optional)
  - eligibility (optional)
  - salary (optional)
  - applicationLink (optional)
  - pdf (file)
Response: Created job object
```

#### Update Job (Admin)
```
PUT /api/jobs/:id
Headers: Authorization: Bearer <token>
Body: FormData (same as create, pdf optional)
Response: Updated job object
```

#### Delete Job (Admin)
```
DELETE /api/jobs/:id
Headers: Authorization: Bearer <token>
Response: Success message
```

## Default Admin Credentials

For demo purposes, the default credentials are:
- **Username:** admin
- **Password:** admin@123

⚠️ **Important:** Change these credentials in production!

## Usage

### For Public Users

1. Open the application at `http://localhost:3000`
2. Browse the latest government job notifications
3. Use the search bar to find specific jobs
4. Filter by department using the dropdown
5. Click "Download PDF" to get the official notification
6. Click "Apply Online" if available

### For Admin Users

1. Click "Admin Login" in the navigation bar
2. Enter credentials (default: admin/admin@123)
3. Click "Admin Dashboard"
4. Use the sidebar to navigate:
   - **Job List:** View all jobs with edit/delete options
   - **Add Job:** Create new job notifications
5. Fill in job details and upload PDF
6. Submit to save

## Features Breakdown

### Job Card Display
- Job title with department badge
- Short description
- Upload date and last application date
- Number of positions (if specified)
- Salary range (if specified)
- Eligibility requirements (if specified)
- Deadline warning when application closes within 7 days
- Download PDF button
- Direct apply link button

### Search & Filter
- Real-time search functionality
- Filter by department
- Search across title, description, and department
- Clear filters option

### Admin Dashboard
- Secure login system
- JWT-based authentication
- Add new jobs with PDF upload
- Edit job details
- Update PDF files
- Delete old notifications
- Status management (Active, Closed, Expired)
- Job list with sorting

### Responsive Design
- Mobile-optimized interface
- Tablet-friendly layout
- Desktop experience
- Touch-friendly buttons
- Responsive tables
- Mobile navigation

## Security Features

1. **Authentication:** JWT-based admin authentication
2. **Password Hashing:** bcryptjs for secure password storage
3. **File Validation:** Only PDF files allowed (10MB limit)
4. **Protected Routes:** Admin routes require valid JWT token
5. **CORS:** Configured for secure cross-origin requests
6. **Input Validation:** Form validation on frontend and backend

## Database Models

### Job Schema
```javascript
{
  title: String,
  department: String,
  description: String,
  lastDateToApply: Date,
  uploadDate: Date,
  pdfFileName: String,
  pdfPath: String,
  numberOfPositions: Number,
  eligibility: String,
  salary: String,
  applicationLink: String,
  status: String (Active/Closed/Expired),
  timestamps: true
}
```

### Admin Schema
```javascript
{
  username: String,
  password: String (hashed),
  email: String,
  createdAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify MongoDB port (default: 27017)

### CORS Error
- Check CORS configuration in server.js
- Ensure frontend URL is in whitelist
- Clear browser cache

### File Upload Error
- Ensure uploads folder exists
- Check file size (max 10MB)
- Verify PDF format

### Token Expiration
- Clear localStorage and login again
- Increase expiration time in server.js if needed

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Change JWT_SECRET to a secure random string
3. Change admin credentials
4. Use MongoDB Atlas for database
5. Deploy to Heroku, AWS, or any Node.js host

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3
3. Update REACT_APP_API_URL to production backend URL

## Future Enhancements

- Email notifications for new jobs
- User accounts for job seeker registration
- Job application tracking
- Advanced filtering and sorting
- Email alerts for saved jobs
- Admin analytics dashboard
- Multiple admin users management
- Job categories and tags
- User reviews and ratings

## License

This project is created for educational and demonstration purposes.

## Support

For issues or questions, please create an issue or contact support.

## Author

Created by AkashSinghInfo

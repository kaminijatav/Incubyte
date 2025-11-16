# Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed (check with `node --version`)
- ✅ MongoDB installed and running (check with `mongod --version`)

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system.

### 3. Configure Backend
Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 6. Create an Admin User (Optional)
```bash
cd backend
node scripts/createAdmin.js admin admin@example.com password123
```

Then login with:
- Email: `admin@example.com`
- Password: `password123`

## First Steps
1. Register a new user account
2. Login with your credentials
3. View the dashboard with sweets (empty initially)
4. If you're an admin, click "Add New Sweet" to add items

## Running Tests
```bash
cd backend
npm test
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `backend/.env`

### Port Already in Use
- Change `PORT` in `backend/.env` if 5000 is taken
- React dev server will prompt to use different port if 3000 is taken

### CORS Errors
- Make sure backend is running before frontend
- Check that `proxy` in `frontend/package.json` points to correct backend URL

## Need Help?
Check the main [README.md](README.md) for detailed documentation.


# 🚀 Project Run Steps - Sweet Shop Management System

Follow these steps to get the project up and running on your local machine.

## Step 1: Prerequisites Check ✅

Before starting, make sure you have:

1. **Node.js** installed (version 14 or higher)
   ```bash
   node --version
   ```
   If not installed, download from: https://nodejs.org/

2. **MongoDB** installed and running
   ```bash
   mongod --version
   ```
   If not installed, download from: https://www.mongodb.com/try/download/community

3. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

---

## Step 2: Start MongoDB 🗄️

**Windows:**
- If MongoDB is installed as a service, it should start automatically
- If not, open Command Prompt as Administrator and run:
  ```bash
  mongod
  ```
- Or start MongoDB service:
  ```bash
  net start MongoDB
  ```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running:**
- You should see: `waiting for connections on port 27017`
- Or test connection:
  ```bash
  mongosh
  ```

---

## Step 3: Install Dependencies 📦

Open your terminal in the project root directory (`Incubyte`).

### Option A: Install All at Once
```bash
# Install root dependencies (optional)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Option B: Use Convenience Script (if available)
```bash
npm run install:all
```

**Expected output:**
- Backend: `added XXX packages`
- Frontend: `added XXX packages`

---

## Step 4: Configure Environment Variables ⚙️

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a `.env` file:
   ```bash
   # Windows (PowerShell)
   New-Item .env
   
   # Windows (CMD)
   type nul > .env
   
   # macOS/Linux
   touch .env
   ```

3. Open `.env` file and add the following content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   NODE_ENV=development
   ```

   **Important Notes:**
   - Make sure MongoDB is running on `localhost:27017`
   - Change `JWT_SECRET` to a strong random string (at least 32 characters)
   - The database name `sweet-shop` will be created automatically

---

## Step 5: Start the Backend Server 🔧

1. Open **Terminal 1** (or Command Prompt)

2. Navigate to backend folder:
   ```bash
   cd backend
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   **Expected output:**
   ```
   Connected to MongoDB
   Server is running on port 5000
   ```

4. **Keep this terminal open!** The server must keep running.

5. Test the backend:
   - Open browser: http://localhost:5000/api/health
   - You should see: `{"status":"OK","message":"Sweet Shop API is running"}`

---

## Step 6: Start the Frontend Application 🎨

1. Open **Terminal 2** (a new terminal window)

2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   **Expected output:**
   ```
   Compiled successfully!
   
   You can now view sweet-shop-frontend in the browser.
   
     Local:            http://localhost:3000
   ```

4. The browser should automatically open to http://localhost:3000
   - If not, manually open: http://localhost:3000

5. **Keep this terminal open too!**

---

## Step 7: Create Your First User 👤

1. In the browser (http://localhost:3000), you should see the **Login** page

2. Click **"Register here"** or navigate to: http://localhost:3000/register

3. Fill in the registration form:
   - **Username**: Choose a username (min 3 characters)
   - **Email**: Enter your email
   - **Password**: Enter password (min 6 characters)

4. Click **"Register"**

5. You will be automatically logged in and redirected to the Dashboard

---

## Step 8: Create an Admin User (Optional) 🔐

To access admin features (add, edit, delete sweets), create an admin user:

1. Open **Terminal 3** (new terminal)

2. Navigate to backend folder:
   ```bash
   cd backend
   ```

3. Run the admin creation script:
   ```bash
   node scripts/createAdmin.js admin admin@example.com password123
   ```

   Replace:
   - `admin` - your desired username
   - `admin@example.com` - your email
   - `password123` - your password

4. **Expected output:**
   ```
   Admin user created successfully!
   Admin credentials:
   Username: admin
   Email: admin@example.com
   Role: admin
   ```

5. Logout from your current account and login with the admin credentials

---

## Step 9: Test the Application 🧪

### As Regular User:
1. ✅ View all sweets (initially empty)
2. ✅ Search and filter sweets
3. ✅ Purchase sweets (when available)

### As Admin User:
1. ✅ Click **"Add New Sweet"** button
2. ✅ Fill in sweet details:
   - Name: e.g., "Chocolate Bar"
   - Category: Select from dropdown
   - Price: e.g., 2.50
   - Quantity: e.g., 100
   - Description: (optional)
3. ✅ Click **"Add Sweet"**
4. ✅ Edit sweets (click "Edit" button)
5. ✅ Delete sweets (click "Delete" button)
6. ✅ Restock inventory (enter quantity and click "Restock")

---

## Step 10: Run Tests (Optional) 🧪

1. Open a new terminal

2. Navigate to backend:
   ```bash
   cd backend
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run tests with coverage:
   ```bash
   npm test -- --coverage
   ```

---

## 🛑 Stopping the Application

To stop the servers:

1. **Backend**: In Terminal 1, press `Ctrl + C`
2. **Frontend**: In Terminal 2, press `Ctrl + C`

---

## ❌ Troubleshooting

### Problem: MongoDB Connection Error
**Solution:**
- Make sure MongoDB is running
- Check MongoDB service: `net start MongoDB` (Windows)
- Verify connection string in `backend/.env`

### Problem: Port 5000 Already in Use
**Solution:**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `proxy` in `frontend/package.json` to match

### Problem: Port 3000 Already in Use
**Solution:**
- React will prompt you to use a different port
- Type `Y` to accept, or manually set: `PORT=3001 npm start`

### Problem: "Cannot find module" errors
**Solution:**
- Make sure you ran `npm install` in both `backend` and `frontend` folders
- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Problem: CORS Errors
**Solution:**
- Make sure backend is running before frontend
- Check that `proxy` in `frontend/package.json` is set to `http://localhost:5000`

### Problem: Authentication Errors
**Solution:**
- Check that JWT_SECRET is set in `backend/.env`
- Clear browser localStorage and try again
- Check browser console for errors

---

## 📋 Quick Command Reference

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm start

# Create admin user (Terminal 3)
cd backend
node scripts/createAdmin.js admin admin@example.com password123

# Run tests
cd backend
npm test
```

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Dashboard loads without errors
- [ ] (Admin) Can add new sweets
- [ ] (Admin) Can edit/delete sweets
- [ ] Can search and filter sweets
- [ ] Can purchase sweets

---

## 🎉 You're All Set!

Your Sweet Shop Management System is now running! 

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

Happy coding! 🍬


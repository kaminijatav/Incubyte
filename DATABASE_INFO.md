# 🗄️ Database Information - Sweet Shop Management System

## Database Type
**MongoDB** - A NoSQL document database

**Important**: MongoDB is NOT a file-based database. It stores data in a data directory on your system, not as a single file in the project.

---

## 📋 Database Details

### Database Name
```
sweet-shop
```

### Connection String
```
mongodb://localhost:27017/sweet-shop
```

### Default Port
```
27017
```

### Host
```
localhost (127.0.0.1)
```

---

## 📁 Database Configuration

### Configuration File Location
The database connection is configured in:
- **File**: `backend/.env`
- **Key**: `MONGODB_URI`

### Example `.env` File
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

---

## 📊 Database Collections (Tables)

MongoDB uses "collections" instead of tables. This project has **2 collections**:

### 1. **users** Collection
Stores user account information.

**Schema Fields**:
- `_id` - Unique identifier (auto-generated)
- `username` - User's username (unique, required)
- `email` - User's email (unique, required)
- `password` - Hashed password (required)
- `role` - User role: `"user"` or `"admin"` (default: "user")
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-generated)

**Model File**: `backend/models/User.js`

### 2. **sweets** Collection
Stores sweet product information.

**Schema Fields**:
- `_id` - Unique identifier (auto-generated)
- `name` - Sweet name (required, 2-100 characters)
- `category` - Category: "Chocolate", "Candy", "Biscuit", "Cake", "Ice Cream", "Other" (required)
- `price` - Price in dollars (required, must be >= 0)
- `quantity` - Stock quantity (required, must be >= 0)
- `description` - Optional description (max 500 characters)
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-generated)

**Model File**: `backend/models/Sweet.js`

---

## 📂 MongoDB Data Storage Location

MongoDB stores data in a data directory on your system, NOT in the project folder.

### Windows Default Location
```
C:\Program Files\MongoDB\Server\<version>\data\db
```
or
```
C:\data\db
```

### macOS Default Location
```
/usr/local/var/mongodb
```

### Linux Default Location
```
/var/lib/mongodb
```

**Note**: The exact location depends on your MongoDB installation.

---

## 🔍 How to Access the Database

### Method 1: Using MongoDB Shell (mongosh)

1. **Open terminal/command prompt**

2. **Connect to MongoDB**:
   ```bash
   mongosh
   ```
   or
   ```bash
   mongosh mongodb://localhost:27017
   ```

3. **Switch to your database**:
   ```javascript
   use sweet-shop
   ```

4. **View collections**:
   ```javascript
   show collections
   ```

5. **View all users**:
   ```javascript
   db.users.find().pretty()
   ```

6. **View all sweets**:
   ```javascript
   db.sweets.find().pretty()
   ```

7. **Count documents**:
   ```javascript
   db.users.countDocuments()
   db.sweets.countDocuments()
   ```

8. **Find specific document**:
   ```javascript
   // Find user by email
   db.users.findOne({ email: "admin@example.com" })
   
   // Find sweet by name
   db.sweets.findOne({ name: "Chocolate Bar" })
   ```

9. **Exit**:
   ```javascript
   exit
   ```

---

### Method 2: Using MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass**:
   - https://www.mongodb.com/try/download/compass

2. **Connect**:
   - Connection String: `mongodb://localhost:27017`
   - Click "Connect"

3. **Select Database**:
   - Click on `sweet-shop` database

4. **View Collections**:
   - Click on `users` or `sweets` collection
   - Browse documents in a user-friendly interface

---

## 🛠️ Common Database Operations

### View All Users
```javascript
db.users.find().pretty()
```

### View All Sweets
```javascript
db.sweets.find().pretty()
```

### Find Admin Users
```javascript
db.users.find({ role: "admin" }).pretty()
```

### Find Sweets by Category
```javascript
db.sweets.find({ category: "Chocolate" }).pretty()
```

### Find Sweets in Price Range
```javascript
db.sweets.find({ price: { $gte: 1, $lte: 5 } }).pretty()
```

### Count Documents
```javascript
db.users.countDocuments()
db.sweets.countDocuments()
```

### Delete All Users (⚠️ Careful!)
```javascript
db.users.deleteMany({})
```

### Delete All Sweets (⚠️ Careful!)
```javascript
db.sweets.deleteMany({})
```

### Update User Role to Admin
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Update Sweet Price
```javascript
db.sweets.updateOne(
  { name: "Chocolate Bar" },
  { $set: { price: 3.50 } }
)
```

---

## 📝 Database Connection in Code

The database connection is established in:
- **File**: `backend/server.js`
- **Line**: ~26

```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
```

---

## 🔐 Database Security Notes

1. **No Authentication by Default**: The default connection string doesn't include username/password
   - For production, add authentication:
   ```
   mongodb://username:password@localhost:27017/sweet-shop
   ```

2. **JWT Secret**: Stored in `.env` file (not in database)
   - Used for token generation, not database access

3. **Password Hashing**: User passwords are hashed using bcrypt before storage
   - Never stored in plain text

---

## 🗑️ How to Reset/Clear Database

### Option 1: Delete Specific Collection
```javascript
// In mongosh
use sweet-shop
db.users.deleteMany({})
db.sweets.deleteMany({})
```

### Option 2: Delete Entire Database
```javascript
// In mongosh
use sweet-shop
db.dropDatabase()
```

### Option 3: Stop MongoDB and Delete Data Directory
⚠️ **Warning**: This deletes ALL databases, not just sweet-shop!

1. Stop MongoDB service
2. Delete the data directory (location depends on OS)
3. Restart MongoDB

---

## 📊 Database Statistics

To view database statistics:

```javascript
// In mongosh
use sweet-shop
db.stats()
```

To view collection statistics:

```javascript
db.users.stats()
db.sweets.stats()
```

---

## 🔄 Backup and Restore

### Backup Database
```bash
mongodump --db=sweet-shop --out=/path/to/backup
```

### Restore Database
```bash
mongorestore --db=sweet-shop /path/to/backup/sweet-shop
```

---

## 📍 Quick Reference

| Item | Value |
|------|-------|
| **Database Type** | MongoDB (NoSQL) |
| **Database Name** | `sweet-shop` |
| **Connection String** | `mongodb://localhost:27017/sweet-shop` |
| **Port** | `27017` |
| **Host** | `localhost` |
| **Collections** | `users`, `sweets` |
| **Config File** | `backend/.env` |
| **Connection Code** | `backend/server.js` |

---

## ❓ FAQ

**Q: Where is the database file?**
A: MongoDB doesn't use a single file. Data is stored in MongoDB's data directory on your system.

**Q: Can I see the database in the project folder?**
A: No, the database is stored separately by MongoDB. You can only access it through MongoDB tools.

**Q: How do I know if data is being saved?**
A: Use `mongosh` to connect and check, or use MongoDB Compass GUI.

**Q: Can I change the database name?**
A: Yes, change it in `backend/.env` file: `MONGODB_URI=mongodb://localhost:27017/your-database-name`

**Q: How do I export data?**
A: Use `mongoexport` command or MongoDB Compass export feature.

---

## 🆘 Troubleshooting

### Database Not Found
- MongoDB creates the database automatically on first connection
- Make sure MongoDB is running
- Check connection string in `.env` file

### Connection Refused
- MongoDB might not be running
- Check if port 27017 is available
- Verify MongoDB service is started

### Cannot Connect
- Check `backend/.env` file exists and has correct `MONGODB_URI`
- Verify MongoDB is running: `mongosh`
- Check firewall settings

---

For more information, visit: https://docs.mongodb.com/


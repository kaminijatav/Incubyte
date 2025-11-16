const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const jwt = require('jsonwebtoken');

describe('Sweets API', () => {
  let userToken;
  let adminToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create regular user
    regularUser = new User({
      username: 'regularuser',
      email: 'regular@example.com',
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();
    userToken = jwt.sign({ userId: regularUser._id }, process.env.JWT_SECRET || 'fallback-secret');

    // Create admin user
    adminUser = new User({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET || 'fallback-secret');
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet as admin', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.name).toBe(sweetData.name);
      expect(response.body.sweet.category).toBe(sweetData.category);
      expect(response.body.sweet.price).toBe(sweetData.price);
      expect(response.body.sweet.quantity).toBe(sweetData.quantity);
    });

    it('should not create sweet without authentication', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);
    });

    it('should not create sweet as regular user', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.message).toContain('Admin privileges');
    });

    it('should not create sweet with invalid data', async () => {
      const sweetData = {
        name: 'A', // Too short
        category: 'InvalidCategory',
        price: -10, // Negative price
        quantity: -5 // Negative quantity
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Lollipop', category: 'Candy', price: 1.00, quantity: 200 },
        { name: 'Cookie', category: 'Biscuit', price: 1.50, quantity: 150 }
      ]);
    });

    it('should get all sweets with authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sweets');
      expect(response.body.sweets.length).toBe(3);
    });

    it('should not get sweets without authentication', async () => {
      await request(app)
        .get('/api/sweets')
        .expect(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.00, quantity: 80 },
        { name: 'Lollipop', category: 'Candy', price: 1.00, quantity: 200 },
        { name: 'Cookie', category: 'Biscuit', price: 1.50, quantity: 150 }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets.length).toBe(2);
      expect(response.body.sweets.every(s => s.name.toLowerCase().includes('chocolate'))).toBe(true);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets.length).toBe(2);
      expect(response.body.sweets.every(s => s.category === 'Chocolate')).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=1.5&maxPrice=2.5')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets.length).toBeGreaterThan(0);
      expect(response.body.sweets.every(s => s.price >= 1.5 && s.price <= 2.5)).toBe(true);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should update sweet as admin', async () => {
      const updateData = {
        name: 'Updated Chocolate Bar',
        price: 3.00
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.sweet.name).toBe(updateData.name);
      expect(response.body.sweet.price).toBe(updateData.price);
    });

    it('should not update sweet as regular user', async () => {
      const updateData = { name: 'Updated Name' };

      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should delete sweet as admin', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should not delete sweet as regular user', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(95);
      expect(response.body.purchasedQuantity).toBe(5);
    });

    it('should purchase default quantity of 1', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweet.quantity).toBe(99);
      expect(response.body.purchasedQuantity).toBe(1);
    });

    it('should not purchase if insufficient stock', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 150 })
        .expect(400);
    });

    it('should not purchase without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .expect(401);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(150);
      expect(response.body.restockedQuantity).toBe(50);
    });

    it('should not restock as regular user', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);
    });

    it('should not restock without quantity', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });
  });
});


const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const Sweet = require('../models/Sweet');
const upload = require('../middleware/upload');

// @route   POST /api/sweets
// @desc    Add a new sweet (Protected)
// @access  Private (Admin)
router.post('/', [auth, adminAuth], upload.single('image'), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('category')
    .isIn(['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Ice Cream', 'Other'])
    .withMessage('Invalid category'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sweetData = {
      ...req.body,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity)
    };

    // Add image path if file was uploaded
    if (req.file) {
      sweetData.image = `/uploads/${req.file.filename}`;
    }

    const sweet = new Sweet(sweetData);
    await sweet.save();

    res.status(201).json({
      message: 'Sweet added successfully',
      sweet
    });
  } catch (error) {
    console.error('Add sweet error:', error);
    res.status(500).json({ message: 'Server error while adding sweet' });
  }
});

// @route   GET /api/sweets
// @desc    Get all sweets (Protected)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json({ sweets, count: sweets.length });
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ message: 'Server error while fetching sweets' });
  }
});

// @route   GET /api/sweets/search
// @desc    Search sweets by name, category, or price range (Protected)
// @access  Private
router.get('/search', auth, [
  query('name').optional().trim(),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.json({ sweets, count: sweets.length });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ message: 'Server error while searching sweets' });
  }
});

// @route   GET /api/sweets/:id
// @desc    Get a single sweet by ID (Protected)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json({ sweet });
  } catch (error) {
    console.error('Get sweet error:', error);
    res.status(500).json({ message: 'Server error while fetching sweet' });
  }
});

// @route   PUT /api/sweets/:id
// @desc    Update a sweet (Protected)
// @access  Private (Admin)
router.put('/:id', [auth, adminAuth], upload.single('image'), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('category').optional().isIn(['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Ice Cream', 'Other']),
  body('price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = { ...req.body };
    
    // Convert price and quantity if provided
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.quantity) updateData.quantity = parseInt(updateData.quantity);

    // Add image path if new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.json({
      message: 'Sweet updated successfully',
      sweet
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ message: 'Server error while updating sweet' });
  }
});

// @route   DELETE /api/sweets/:id
// @desc    Delete a sweet (Protected)
// @access  Private (Admin)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ message: 'Server error while deleting sweet' });
  }
});

// @route   POST /api/sweets/:id/purchase
// @desc    Purchase a sweet, decreasing quantity (Protected)
// @access  Private
router.post('/:id/purchase', auth, [
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Purchase quantity must be at least 1')
], async (req, res) => {
  try {
    const purchaseQuantity = req.body.quantity || 1;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${sweet.quantity}, Requested: ${purchaseQuantity}`
      });
    }

    sweet.quantity -= purchaseQuantity;
    await sweet.save();

    res.json({
      message: 'Purchase successful',
      sweet,
      purchasedQuantity: purchaseQuantity
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Server error during purchase' });
  }
});

// @route   POST /api/sweets/:id/restock
// @desc    Restock a sweet, increasing quantity (Protected)
// @access  Private (Admin)
router.post('/:id/restock', [auth, adminAuth], [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Restock quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restockQuantity = req.body.quantity;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += restockQuantity;
    await sweet.save();

    res.json({
      message: 'Restock successful',
      sweet,
      restockedQuantity: restockQuantity
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ message: 'Server error during restock' });
  }
});

module.exports = router;


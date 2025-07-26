const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Property = require('../models/Property');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/properties
// @desc    Create a new property listing with an image
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, price, location } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      }).end(req.file.buffer);
    });
    const newProperty = new Property({
      title,
      description,
      price,
      location,
      imageUrl: result.secure_url,
      user: req.user.id
    });
    const property = await newProperty.save();
    res.status(201).json(property);
  } catch (err) {
    console.error('Error creating property:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ datePosted: -1 });
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/properties/my-properties
// @desc    Get all properties for the logged-in user
// @access  Private
router.get('/my-properties', authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user.id });
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/properties/:id
// @desc    Get a single property by its ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, price, location } = req.body;
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    if (property.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, price, location } },
      { new: true }
    );
    res.json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    if (property.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Property removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
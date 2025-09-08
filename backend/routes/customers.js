const express = require('express');
const db = require('../models');
const { auth, authorizeRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get all customers (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const customers = await db.Customer.findAll({ include: { model: db.User, as: 'user' } });
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single customer by ID (Admin only)
router.get('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const customer = await db.Customer.findByPk(req.params.id, { include: { model: db.User, as: 'user' } });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new customer (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), upload.single('profile_photo'), async (req, res) => {
    const { first_name, last_name, address, phone, email, password } = req.body; // Removed id_type, id_number, id_photo_front, id_photo_back
    const profile_photo = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
            username: email,
            email: email,
            password: hashedPassword,
            role: 'CUSTOMER'
        });

        const newCustomer = await db.Customer.create({
            user_id: newUser.id,
            first_name,
            last_name,
            address,
            phone,
            profile_photo
        });
        res.status(201).json({ message: 'Customer created', customerId: newCustomer.id, userId: newUser.id });
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a customer (Admin only)
router.put('/:id', auth, authorizeRole(['ADMIN']), upload.single('profile_photo'), async (req, res) => {
    const { first_name, last_name, address, phone, email } = req.body; // Removed id_type, id_number, id_photo_front, id_photo_back
    const profile_photo = req.file ? `/uploads/${req.file.filename}` : req.body.profile_photo_url_existing;

    try {
        const customer = await db.Customer.findByPk(req.params.id, { include: { model: db.User, as: 'user' } });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (email && customer.user && customer.user.email !== email) {
            await customer.user.update({ email: email, username: email });
        }

        await customer.update({
            first_name,
            last_name,
            address,
            phone,
            profile_photo
        });
        res.json({ message: 'Customer updated' });
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a customer (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const customer = await db.Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.destroy();
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
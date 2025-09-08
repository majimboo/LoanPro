const express = require('express');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all collaterals (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const collaterals = await db.Collateral.findAll({ include: { model: db.Loan, as: 'loan' } });
        res.json(collaterals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get collaterals for a specific loan (Admin/Customer - Customer can only view their own)
router.get('/loan/:loan_id', auth, async (req, res) => {
    try {
        const { loan_id } = req.params;

        const loan = await db.Loan.findByPk(loan_id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== loan.customer_id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const collaterals = await db.Collateral.findAll({ where: { loan_id }, include: { model: db.Loan, as: 'loan' } });
        res.json(collaterals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single collateral by ID (Admin only)
router.get('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const collateral = await db.Collateral.findByPk(req.params.id, { include: { model: db.Loan, as: 'loan' } });
        if (!collateral) {
            return res.status(404).json({ message: 'Collateral not found' });
        }
        res.json(collateral);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new collateral (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { loan_id, collateral_type, description, estimated_value, ...additionalFields } = req.body;
    try {
        const newCollateral = await db.Collateral.create({
            loan_id,
            collateral_type,
            description,
            estimated_value,
            ...additionalFields
        });
        res.status(201).json({ message: 'Collateral created', collateralId: newCollateral.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a collateral (Admin only)
router.put('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { loan_id, collateral_type, description, estimated_value, ...additionalFields } = req.body;
    try {
        const collateral = await db.Collateral.findByPk(req.params.id);
        if (!collateral) {
            return res.status(404).json({ message: 'Collateral not found' });
        }

        await collateral.update({
            loan_id,
            collateral_type,
            description,
            estimated_value,
            ...additionalFields
        });
        res.json({ message: 'Collateral updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a collateral (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const collateral = await db.Collateral.findByPk(req.params.id);
        if (!collateral) {
            return res.status(404).json({ message: 'Collateral not found' });
        }

        await collateral.destroy();
        res.json({ message: 'Collateral deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
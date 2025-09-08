const express = require('express');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all pawned items (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const pawnedItems = await db.PawnedItem.findAll({ include: { model: db.PawnTicket, as: 'pawnTicket' } }); // FIX: Added as: 'pawnTicket'
        res.json(pawnedItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get pawned items for a specific pawn ticket (Admin/Customer - Customer can only view their own)
router.get('/ticket/:pawn_ticket_id', auth, async (req, res) => {
    try {
        const { pawn_ticket_id } = req.params;

        const pawnTicket = await db.PawnTicket.findByPk(pawn_ticket_id);
        if (!pawnTicket) {
            return res.status(404).json({ message: 'Pawn ticket not found' });
        }

        if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== pawnTicket.customer_id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const pawnedItems = await db.PawnedItem.findAll({ where: { pawn_ticket_id }, include: { model: db.PawnTicket, as: 'pawnTicket' } }); // FIX: Added as: 'pawnTicket'
        res.json(pawnedItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single pawned item by ID (Admin only)
router.get('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const pawnedItem = await db.PawnedItem.findByPk(req.params.id, { include: { model: db.PawnTicket, as: 'pawnTicket' } }); // FIX: Added as: 'pawnTicket'
        if (!pawnedItem) {
            return res.status(404).json({ message: 'Pawned item not found' });
        }
        res.json(pawnedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new pawned item (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { pawn_ticket_id, item_name, description, estimated_value } = req.body;
    try {
        const newPawnedItem = await db.PawnedItem.create({
            pawn_ticket_id,
            item_name,
            description,
            estimated_value
        });
        res.status(201).json({ message: 'Pawned item created', itemId: newPawnedItem.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a pawned item (Admin only)
router.put('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { pawn_ticket_id, item_name, description, estimated_value } = req.body;
    try {
        const pawnedItem = await db.PawnedItem.findByPk(req.params.id);
        if (!pawnedItem) {
            return res.status(404).json({ message: 'Pawned item not found' });
        }

        await pawnedItem.update({
            pawn_ticket_id,
            item_name,
            description,
            estimated_value
        });
        res.json({ message: 'Pawned item updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a pawned item (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const pawnedItem = await db.PawnedItem.findByPk(req.params.id);
        if (!pawnedItem) {
            return res.status(404).json({ message: 'Pawned item not found' });
        }

        await pawnedItem.destroy();
        res.json({ message: 'Pawned item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
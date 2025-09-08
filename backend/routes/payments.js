const express = require('express');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all payments (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const payments = await db.Payment.findAll({ include: db.PawnTicket });
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payments for a specific pawn ticket (Admin/Customer - Customer can only view their own)
router.get('/ticket/:pawn_ticket_id', auth, async (req, res) => {
    try {
        const { pawn_ticket_id } = req.params;

        // Verify if the user has access to this pawn ticket
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

        const payments = await db.Payment.findAll({ where: { pawn_ticket_id }, order: [['payment_date', 'DESC']] });
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new payment (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { pawn_ticket_id, payment_date, amount_paid, payment_type } = req.body;

    if (!pawn_ticket_id || !payment_date || !amount_paid || !payment_type) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        await db.sequelize.transaction(async (t) => {
            // Insert the payment record
            await db.Payment.create({
                pawn_ticket_id,
                payment_date,
                amount_paid,
                payment_type
            }, { transaction: t });

            // Update the outstanding_principal of the pawn ticket
            const ticket = await db.PawnTicket.findByPk(pawn_ticket_id, { transaction: t, lock: true });
            if (!ticket) {
                throw new Error('Pawn ticket not found');
            }

            let newOutstandingPrincipal = ticket.outstanding_principal - amount_paid;
            if (newOutstandingPrincipal < 0) newOutstandingPrincipal = 0; // Ensure it doesn't go below zero

            let newStatus = ticket.status;
            if (newOutstandingPrincipal === 0 && payment_type === 'FULL') {
                newStatus = 'REDEEMED';
            }

            await ticket.update({
                outstanding_principal: newOutstandingPrincipal,
                status: newStatus
            }, { transaction: t });
        });

        res.status(201).json({ message: 'Payment recorded and pawn ticket updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a payment (Admin only - use with caution as it affects ticket balance)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        await db.sequelize.transaction(async (t) => {
            const payment = await db.Payment.findByPk(req.params.id, { transaction: t, lock: true });
            if (!payment) {
                throw new Error('Payment not found');
            }

            // Delete the payment record
            await payment.destroy({ transaction: t });

            // Revert the outstanding_principal of the pawn ticket
            const ticket = await db.PawnTicket.findByPk(payment.pawn_ticket_id, { transaction: t, lock: true });
            if (!ticket) {
                throw new Error('Pawn ticket not found for payment');
            }

            const newOutstandingPrincipal = ticket.outstanding_principal + payment.amount_paid;

            // Note: Reverting status from REDEEMED/FORFEITED would require more complex logic here
            await ticket.update({
                outstanding_principal: newOutstandingPrincipal
            }, { transaction: t });
        });

        res.json({ message: 'Payment deleted and pawn ticket updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
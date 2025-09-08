const express = require('express');
const moment = require('moment-timezone');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Configuration (can be moved to a config file or DB)
const DUE_SOON_DAYS = 7;
const GRACE_DAYS = 30;
const TIMEZONE = 'Asia/Manila';

// Helper function to calculate pawn ticket status and financial details
const calculatePawnTicketDetails = (ticket) => {
    const now = moment().tz(TIMEZONE).startOf('day');
    const maturityDate = moment(ticket.maturity_date).tz(TIMEZONE).startOf('day');
    const issueDate = moment(ticket.issue_date).tz(TIMEZONE).startOf('day');

    let status = ticket.status;
    let accruedInterest = ticket.accrued_interest || 0;
    let penalties = ticket.penalties || 0;
    let gracePeriodEnd = moment(maturityDate).add(GRACE_DAYS, 'days').startOf('day');

    if (!ticket.grace_period_end || moment(ticket.grace_period_end).tz(TIMEZONE).startOf('day').isBefore(gracePeriodEnd)) {
        ticket.grace_period_end = gracePeriodEnd.format('YYYY-MM-DD');
    }

    if (ticket.status === 'REDEEMED' || ticket.status === 'FORFEITED') {
        return { ...ticket.toJSON(), status, accrued_interest: accruedInterest, penalties, grace_period_end: ticket.grace_period_end };
    }

    const monthsPassed = now.diff(issueDate, 'months', true);
    const calculatedInterest = (ticket.principal_amount * (ticket.interest_rate / 100) * Math.floor(monthsPassed));
    accruedInterest = Math.max(0, calculatedInterest);

    if (now.isAfter(gracePeriodEnd)) {
        status = 'OVERDUE';
        const overdueMonths = now.diff(gracePeriodEnd, 'months', true);
        penalties = Math.max(0, ticket.principal_amount * 0.01 * Math.floor(overdueMonths));
    } else if (now.isAfter(maturityDate) && now.isSameOrBefore(gracePeriodEnd)) {
        status = 'OVERDUE';
    } else if (now.isBetween(maturityDate.clone().subtract(DUE_SOON_DAYS, 'days'), maturityDate, null, '[]')) {
        status = 'DUE_SOON';
    } else {
        status = 'ACTIVE';
    }

    return { ...ticket.toJSON(), status, accrued_interest: accruedInterest, penalties, grace_period_end: ticket.grace_period_end };
};

// Get all pawn tickets (Admin only) or current user's pawn tickets (Customer)
router.get('/', auth, async (req, res) => {
    try {
        let tickets;
        
        if (req.user.role === 'ADMIN') {
            tickets = await db.PawnTicket.findAll({ 
                include: [
                    { model: db.Customer, as: 'customer' }, 
                    { model: db.PawnedItem, as: 'pawnedItems' }
                ] 
            });
        } else if (req.user.role === 'CUSTOMER') {
            // Get customer profile for the logged-in user
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer) {
                return res.status(404).json({ message: 'Customer profile not found' });
            }
            
            tickets = await db.PawnTicket.findAll({ 
                where: { customer_id: customer.id },
                include: [
                    { model: db.Customer, as: 'customer' }, 
                    { model: db.PawnedItem, as: 'pawnedItems' }
                ] 
            });
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const ticketsWithDetails = tickets.map(calculatePawnTicketDetails);
        res.json(ticketsWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single pawn ticket by ID (Admin/Customer - Customer can only view their own)
router.get('/:id', auth, async (req, res) => {
    try {
        const ticket = await db.PawnTicket.findByPk(req.params.id, { include: [{ model: db.Customer, as: 'customer' }, { model: db.PawnedItem, as: 'pawnedItems' }] }); // FIX: Include PawnedItem
        if (!ticket) {
            return res.status(404).json({ message: 'Pawn ticket not found' });
        }

        if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== ticket.customer_id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const ticketWithDetails = calculatePawnTicketDetails(ticket);
        res.json(ticketWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get pawn tickets for a specific customer (Admin only, or Customer for their own)
router.get('/customer/:customer_id', auth, async (req, res) => {
    try {
        const { customer_id } = req.params;

        if (req.user.role === 'ADMIN') {
            const tickets = await db.PawnTicket.findAll({ where: { customer_id }, include: [{ model: db.Customer, as: 'customer' }, { model: db.PawnedItem, as: 'pawnedItems' }] }); // FIX: Include PawnedItem
            const ticketsWithDetails = tickets.map(calculatePawnTicketDetails);
            return res.json(ticketsWithDetails);
        }
        else if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== parseInt(customer_id)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            const tickets = await db.PawnTicket.findAll({ where: { customer_id }, include: [{ model: db.Customer, as: 'customer' }, { model: db.PawnedItem, as: 'pawnedItems' }] }); // FIX: Include PawnedItem
            const ticketsWithDetails = tickets.map(calculatePawnTicketDetails);
            return res.json(ticketsWithDetails);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Create a new pawn ticket (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { customer_id, issue_date, maturity_date, principal_amount, interest_rate } = req.body;

    if (!customer_id || !issue_date || !maturity_date || !principal_amount || !interest_rate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const ticket_number = `PT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newTicket = await db.PawnTicket.create({
            customer_id,
            ticket_number,
            issue_date,
            maturity_date,
            principal_amount,
            interest_rate,
            outstanding_principal: principal_amount
        });
        res.status(201).json({ message: 'Pawn ticket created', ticketId: newTicket.id, ticketNumber: newTicket.ticket_number });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a pawn ticket (Admin only)
router.put('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { customer_id, ticket_number, issue_date, maturity_date, principal_amount, interest_rate, status, outstanding_principal, accrued_interest, penalties } = req.body;
    try {
        const ticket = await db.PawnTicket.findByPk(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Pawn ticket not found' });
        }

        await ticket.update({
            customer_id,
            ticket_number,
            issue_date,
            maturity_date,
            principal_amount,
            interest_rate,
            status,
            outstanding_principal,
            accrued_interest,
            penalties
        });
        res.json({ message: 'Pawn ticket updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a pawn ticket (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const ticket = await db.PawnTicket.findByPk(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Pawn ticket not found' });
        }

        await ticket.destroy();
        res.json({ message: 'Pawn ticket deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
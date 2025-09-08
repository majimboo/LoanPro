const express = require('express');
const moment = require('moment-timezone');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Configuration (can be moved to a config file or DB)
const DUE_SOON_DAYS = 7;
const GRACE_DAYS = 30;
const TIMEZONE = 'Asia/Manila';

// Helper function to calculate loan status and financial details
const calculateLoanDetails = (loan) => {
    const now = moment().tz(TIMEZONE).startOf('day');
    const maturityDate = moment(loan.maturity_date).tz(TIMEZONE).startOf('day');
    const issueDate = moment(loan.issue_date).tz(TIMEZONE).startOf('day');

    let status = loan.status;
    let accruedInterest = loan.accrued_interest || 0;
    let penalties = loan.penalties || 0;
    let gracePeriodEnd = moment(maturityDate).add(GRACE_DAYS, 'days').startOf('day');

    if (!loan.grace_period_end || moment(loan.grace_period_end).tz(TIMEZONE).startOf('day').isBefore(gracePeriodEnd)) {
        loan.grace_period_end = gracePeriodEnd.format('YYYY-MM-DD');
    }

    if (loan.status === 'REDEEMED' || loan.status === 'FORFEITED') {
        return { ...loan.toJSON(), status, accrued_interest: accruedInterest, penalties, grace_period_end: loan.grace_period_end };
    }

    const monthsPassed = now.diff(issueDate, 'months', true);
    const calculatedInterest = (loan.principal_amount * (loan.interest_rate / 100) * Math.floor(monthsPassed));
    accruedInterest = Math.max(0, calculatedInterest);

    if (now.isAfter(gracePeriodEnd)) {
        status = 'OVERDUE';
        const overdueMonths = now.diff(gracePeriodEnd, 'months', true);
        penalties = Math.max(0, loan.principal_amount * 0.01 * Math.floor(overdueMonths));
    } else if (now.isAfter(maturityDate) && now.isSameOrBefore(gracePeriodEnd)) {
        status = 'OVERDUE';
    } else if (now.isBetween(maturityDate.clone().subtract(DUE_SOON_DAYS, 'days'), maturityDate, null, '[]')) {
        status = 'DUE_SOON';
    } else {
        status = 'ACTIVE';
    }

    return { ...loan.toJSON(), status, accrued_interest: accruedInterest, penalties, grace_period_end: loan.grace_period_end };
};

// Get all loans (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const loans = await db.Loan.findAll({ include: [{ model: db.Customer, as: 'customer' }, { model: db.Collateral, as: 'collaterals' }] });
        const loansWithDetails = loans.map(calculateLoanDetails);
        res.json(loansWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single loan by ID (Admin/Customer - Customer can only view their own)
router.get('/:id', auth, async (req, res) => {
    try {
        const loan = await db.Loan.findByPk(req.params.id, { include: [{ model: db.Customer, as: 'customer' }, { model: db.Collateral, as: 'collaterals' }] });
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== loan.customer_id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const loanWithDetails = calculateLoanDetails(loan);
        res.json(loanWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get loans for a specific customer (Admin only, or Customer for their own)
router.get('/customer/:customer_id', auth, async (req, res) => {
    try {
        const { customer_id } = req.params;

        if (req.user.role === 'ADMIN') {
            const loans = await db.Loan.findAll({ where: { customer_id }, include: [{ model: db.Customer, as: 'customer' }, { model: db.Collateral, as: 'collaterals' }] });
            const loansWithDetails = loans.map(calculateLoanDetails);
            return res.json(loansWithDetails);
        }
        else if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== parseInt(customer_id)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            const loans = await db.Loan.findAll({ where: { customer_id }, include: [{ model: db.Customer, as: 'customer' }, { model: db.Collateral, as: 'collaterals' }] });
            const loansWithDetails = loans.map(calculateLoanDetails);
            return res.json(loansWithDetails);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Create a new loan (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { customer_id, loan_type, issue_date, maturity_date, principal_amount, interest_rate } = req.body;

    if (!customer_id || !loan_type || !issue_date || !maturity_date || !principal_amount || !interest_rate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const loan_number = `LN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newLoan = await db.Loan.create({
            customer_id,
            loan_number,
            loan_type,
            issue_date,
            maturity_date,
            principal_amount,
            interest_rate,
            outstanding_principal: principal_amount
        });
        res.status(201).json({ message: 'Loan created', loanId: newLoan.id, loanNumber: newLoan.loan_number });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a loan (Admin only)
router.put('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { customer_id, loan_number, loan_type, issue_date, maturity_date, principal_amount, interest_rate, status, outstanding_principal, accrued_interest, penalties } = req.body;
    try {
        const loan = await db.Loan.findByPk(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        await loan.update({
            customer_id,
            loan_number,
            loan_type,
            issue_date,
            maturity_date,
            principal_amount,
            interest_rate,
            status,
            outstanding_principal,
            accrued_interest,
            penalties
        });
        res.json({ message: 'Loan updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a loan (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const loan = await db.Loan.findByPk(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        await loan.destroy();
        res.json({ message: 'Loan deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');
const { auth, authorizeRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = express.Router();

// Ensure base uploads directory exists
const baseUploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(baseUploadsDir)) {
    fs.mkdirSync(baseUploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subfolder = '';
        if (req.body.customer_id) {
            subfolder = `customers/${req.body.customer_id}`;
        } else if (req.body.pawned_item_id) {
            subfolder = `pawned_items/${req.body.pawned_item_id}`;
        }

        const targetDir = path.join(baseUploadsDir, subfolder);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload attachment (Admin only)
router.post('/upload', auth, authorizeRole(['ADMIN']), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { pawn_ticket_id, pawned_item_id, customer_id, type, description } = req.body;
    const file_path_relative = path.join(
        (customer_id ? `customers/${customer_id}` : (pawned_item_id ? `pawned_items/${pawned_item_id}` : '')),
        req.file.filename
    ).replace(/\\/g, '/'); // Corrected line

    const file_name = req.file.originalname;
    const file_type = req.file.mimetype;
    const file_size = req.file.size;

    try {
        const newAttachment = await db.Attachment.create({
            pawn_ticket_id: pawn_ticket_id || null,
            pawned_item_id: pawned_item_id || null,
            customer_id: customer_id || null,
            file_path: file_path_relative,
            file_name,
            file_type,
            file_size,
            type: type || 'pawned_item',
            description: description || null
        });
        res.status(201).json({ message: 'File uploaded successfully', attachment: newAttachment });
    } catch (err) {
        console.error(err);
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
        });
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve attachment securely by ID (Admin/Customer - Customer can only view their own related attachments)
router.get('/file/:id', auth, async (req, res) => { // CHANGED ROUTE: /file/:id
    const { id } = req.params; // Get ID from params
    try {
        const attachment = await db.Attachment.findByPk(id, {
            include: [{ model: db.PawnTicket, as: 'pawnTicket' }, { model: db.Customer, as: 'customer' }]
        });

        if (!attachment) {
            return res.status(404).json({ message: 'File not found or no access' });
        }

        const filePath = path.join(baseUploadsDir, attachment.file_path); // Use the stored relative path

        let hasAccess = false;
        if (req.user.role === 'ADMIN') {
            hasAccess = true;
        } else if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (customer) {
                const customerId = customer.id;

                if (attachment.customer_id === customerId) {
                    hasAccess = true;
                } else if (attachment.pawnTicket && attachment.pawnTicket.customer_id === customerId) {
                    hasAccess = true;
                }
            }
        }

        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving file:', err);
                res.status(500).json({ message: 'Error serving file' });
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attachments for a specific pawn ticket (Admin/Customer - Customer can only view their own)
router.get('/list/ticket/:pawn_ticket_id', auth, async (req, res) => {
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

        const attachments = await db.Attachment.findAll({ where: { pawn_ticket_id } });
        res.json(attachments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attachments for a specific customer (Admin only, or Customer for their own)
router.get('/list/customer/:customer_id', auth, async (req, res) => {
    try {
        const { customer_id } = req.params;

        if (req.user.role === 'ADMIN') {
            const attachments = await db.Attachment.findAll({ where: { customer_id } });
            return res.json(attachments);
        }
        else if (req.user.role === 'CUSTOMER') {
            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== parseInt(customer_id)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            const attachments = await db.Attachment.findAll({ where: { customer_id } });
            return res.json(attachments);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attachments for a specific collateral (Admin/Customer - Customer can only view their own)
router.get('/list/collateral/:collateral_id', auth, async (req, res) => {
    try {
        const { collateral_id } = req.params;

        if (req.user.role === 'ADMIN') {
            const attachments = await db.Attachment.findAll({ where: { collateral_id } });
            return res.json(attachments);
        }
        else if (req.user.role === 'CUSTOMER') {
            const collateral = await db.Collateral.findByPk(collateral_id);
            if (!collateral) {
                return res.status(404).json({ message: 'Collateral not found' });
            }

            const loan = await db.Loan.findByPk(collateral.loan_id);
            if (!loan) {
                return res.status(404).json({ message: 'Associated loan not found' });
            }

            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== loan.customer_id) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const attachments = await db.Attachment.findAll({ where: { collateral_id } });
            return res.json(attachments);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attachments for a specific pawned item (Legacy support)
router.get('/list/pawned-item/:pawned_item_id', auth, async (req, res) => {
    try {
        const { pawned_item_id } = req.params;

        if (req.user.role === 'ADMIN') {
            const attachments = await db.Attachment.findAll({ where: { pawned_item_id } });
            return res.json(attachments);
        }
        else if (req.user.role === 'CUSTOMER') {
            const pawnedItem = await db.PawnedItem.findByPk(pawned_item_id);
            if (!pawnedItem) {
                return res.status(404).json({ message: 'Pawned item not found' });
            }

            const pawnTicket = await db.PawnTicket.findByPk(pawnedItem.pawn_ticket_id);
            if (!pawnTicket) {
                return res.status(404).json({ message: 'Pawn ticket not found for this item' });
            }

            const customer = await db.Customer.findOne({ where: { user_id: req.user.id } });
            if (!customer || customer.id !== pawnTicket.customer_id) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const attachments = await db.Attachment.findAll({ where: { pawned_item_id } });
            return res.json(attachments);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Delete attachment (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const attachment = await db.Attachment.findByPk(req.params.id);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        const filePath = path.join(baseUploadsDir, attachment.file_path);

        await attachment.destroy();

        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file from disk:', err);
        });

        res.json({ message: 'Attachment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

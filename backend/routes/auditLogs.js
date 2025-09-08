const express = require('express');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all audit logs (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const auditLogs = await db.AuditLog.findAll({ include: db.User, order: [['timestamp', 'DESC']] });
        res.json(auditLogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get audit logs for a specific entity (Admin only)
router.get('/entity/:entity_type/:entity_id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { entity_type, entity_id } = req.params;
    try {
        const auditLogs = await db.AuditLog.findAll({
            where: { entity_type, entity_id },
            include: db.User,
            order: [['timestamp', 'DESC']]
        });
        res.json(auditLogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
const express = require('express');
const db = require('../models'); // Import Sequelize models
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all notes (Admin only)
router.get('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const notes = await db.Note.findAll({ include: [db.PawnTicket, db.User] });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get notes for a specific pawn ticket (Admin only)
router.get('/ticket/:pawn_ticket_id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const notes = await db.Note.findAll({ where: { pawn_ticket_id: req.params.pawn_ticket_id }, include: db.User });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new note (Admin only)
router.post('/', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { pawn_ticket_id, note_content } = req.body;
    const user_id = req.user.id; // User creating the note

    if (!pawn_ticket_id || !note_content) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const newNote = await db.Note.create({
            pawn_ticket_id,
            user_id,
            note_content
        });
        res.status(201).json({ message: 'Note created', noteId: newNote.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a note (Admin only)
router.put('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    const { note_content } = req.body;
    try {
        const note = await db.Note.findByPk(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.update({ note_content });
        res.json({ message: 'Note updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a note (Admin only)
router.delete('/:id', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const note = await db.Note.findByPk(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.destroy();
        res.json({ message: 'Note deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
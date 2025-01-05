const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy participants', 'username email');
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { title, description, date, createdBy } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            createdBy
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { userId, eventId } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.participants.includes(userId)) {
            return res.status(400).json({ error: 'You are already registered for this event' });
        }

        event.participants.push(userId);
        await event.save();

        const user = await User.findById(userId);
        user.events.push(eventId);
        await user.save();

        res.status(200).json({ message: 'Successfully registered for the event', event });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/cancel', async (req, res) => {
    try {
        const { userId, eventId } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        event.participants = event.participants.filter((participant) => participant.toString() !== userId);
        await event.save();

        const user = await User.findById(userId);
        user.events = user.events.filter((event) => event.toString() !== eventId);
        await user.save();

        res.status(200).json({ message: 'Successfully canceled event registration' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByIdAndDelete(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

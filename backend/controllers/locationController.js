const Location = require('../models/Location');

// Update bus location
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const location = new Location({ busId: req.params.busId, latitude, longitude });
        await location.save();
        res.json({ message: 'Location updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get latest bus location
exports.getLocation = async (req, res) => {
    try {
        const location = await Location.findOne({ busId: req.params.busId }).sort({ timestamp: -1 });
        res.json(location);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

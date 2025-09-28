const Stop = require('../models/stop');

exports.getStopsByRoute = async (req, res) => {
    try {
        const stops = await Stop.find({ routeNo: req.params.routeNo }).sort({ stopNo: 1 });
        res.json(stops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

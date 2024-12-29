const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    line: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
});

// Coğrafi indeksleme
StationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Station', StationSchema); 
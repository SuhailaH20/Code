const mongoose = require('mongoose');

const savedRecommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true },
    summary: { type: String, required: true },
    success_rate: { type: Number, required: true },
    nearby_pois: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true }
        }
    ],  // Array of objects with name and type
    competitors: [{ type: String }],  // List of competitors
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('SavedRecommendation', savedRecommendationSchema);

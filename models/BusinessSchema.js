const mongoose = require('mongoose');

// Define your form schema
const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true }, // Reference to the user
  businessType: { type: String, required: true },
  subBusinessType: { type: String, required: true },
  activityType: { type: String, required: true },
  partOfLargerBuilding: { type: String, required: true },
  buildingType: { type: String, default: null },
  parkingSpaces: { type: Number, min: 0, required: false },
  onCommercialStreet: { type: String, required: true },
  logisticsArea: { type: String, required: true },
  warehouseArea: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FormSubmission', formSchema);

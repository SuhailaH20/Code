const mongoose = require('mongoose');

// Define your form schema
const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true },
  businessType: { type: String, required: true },
  subBusinessType: { type: String, required: true },
  activityType: { type: String, required: true },
  partOfLargerBuilding: { type: String, required: true },
  buildingType: { type: String, default: null },
  parkingSpaces: { type: Number, min: 0, required: false },
  onCommercialStreet: { type: String, required: true },
  logisticsArea: { type: String, required: true },
  warehouseArea: { type: String, required: true },
  step3Result: { type: String },
  step3Status: { type: String }, 
  step4Result: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('FormSubmission', formSchema);

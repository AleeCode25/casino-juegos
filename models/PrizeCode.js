import mongoose from 'mongoose';

const PrizeCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  prizeDetails: { type: String, required: true },
  awardedToUser: { type: String, required: true },
  isRedeemed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  redeemedAt: { type: Date },
  redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.models.PrizeCode || mongoose.model('PrizeCode', PrizeCodeSchema);
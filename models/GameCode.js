import mongoose from 'mongoose';

const GameCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isRedeemed: { type: Boolean, default: false },
  playerUsername: { type: String },
  createdAt: { type: Date, default: Date.now },
  redeemedAt: { type: Date },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.models.GameCode || mongoose.model('GameCode', GameCodeSchema);
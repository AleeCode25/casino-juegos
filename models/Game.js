// Ruta: /models/Game.js
import mongoose from 'mongoose';

const PrizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  // --- ¡NUEVO CAMPO! ---
  stock: {
    type: Number,
    default: -1 // -1 significa stock infinito
  }
});

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  prizes: [PrizeSchema] 
}, { timestamps: true });

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
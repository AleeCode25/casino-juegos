import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // Si ya estamos conectados, retorna la conexión existente.
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // 👇 MENSAJE AÑADIDO: Se ejecuta solo la primera vez que se intenta conectar.
    console.log("🔌 Conectando a MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // 👇 MENSAJE AÑADIDO: Se ejecuta cuando la conexión es exitosa.
      console.log("✅ Conexión a MongoDB exitosa!");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
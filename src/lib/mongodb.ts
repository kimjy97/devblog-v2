import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const options = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any).mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((connection) => {
        console.log('New MongoDB connection established');
        return connection;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
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
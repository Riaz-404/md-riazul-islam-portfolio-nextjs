import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;
const cached = {};
async function mongoDBConnection() {
  if (!DATABASE_URL) {
    throw new Error(
      "Please define the DATABASE_URL environment variable inside .env"
    );
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    // Connection:
    cached.promise = mongoose.connect(DATABASE_URL, opts);
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}
export { mongoDBConnection };

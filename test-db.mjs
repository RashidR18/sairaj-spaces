
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://rashidali18november:ammi123@cluster0.zdeap8g.mongodb.net/?appName=Cluster0";

async function testConnection() {
  try {
    console.log("Connecting...");
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB");
    await mongoose.disconnect();
    console.log("Disconnected");
  } catch (err) {
    console.error("Connection error:", err);
  }
}

testConnection();

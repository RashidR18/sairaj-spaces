
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://rashidali18november:ammi123@cluster0.zdeap8g.mongodb.net/?appName=Cluster0";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    
    const email = "sairaj@gmail.com";
    const password = "sairaj123";

    await Admin.findOneAndUpdate(
      { email },
      { email, password },
      { upsert: true, new: true }
    );
    
    console.log("Admin credentials stored in MongoDB successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedAdmin();

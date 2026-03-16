import mongoose from "mongoose";

export interface IAdmin extends mongoose.Document {
  email: string;
  password: string;
}

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

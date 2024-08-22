// app/models/Blacklist.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IBlacklist extends Document {
  ip: string;
  reason: string;
  createdAt: Date;
}

const BlacklistSchema = new mongoose.Schema<IBlacklist>({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blacklist: Model<IBlacklist> = mongoose.models.Blacklist || mongoose.model<IBlacklist>('Blacklist', BlacklistSchema);

export default Blacklist;
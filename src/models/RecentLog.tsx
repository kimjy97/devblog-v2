import mongoose, { Model } from 'mongoose';

interface IRecentLog extends Document {
  content: string,
  date: string,
  nickname: string,
  link: string,
}

const recentLogSchema = new mongoose.Schema<IRecentLog>({
  content: String,
  date: String,
  nickname: String,
  link: String,
});

const RecentLog: Model<IRecentLog> = mongoose.models.RecentLog || mongoose.model<IRecentLog>('RecentLog', recentLogSchema);

export default RecentLog;
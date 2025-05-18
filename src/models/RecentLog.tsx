import mongoose, { Model } from 'mongoose';
import moment from 'moment-timezone';

interface IRecentLog extends Document {
  content: string,
  date: Date,
  nickname: string,
  link: string,
}

const recentLogSchema = new mongoose.Schema<IRecentLog>({
  content: String,
  date: {
    type: Date,
    default: Date.now,
    get: (date: any): any => date ? moment(date).tz("Asia/Seoul") : null
  },
  nickname: String,
  link: String,
});

const RecentLog: Model<IRecentLog> = mongoose.models.RecentLog || mongoose.model<IRecentLog>('RecentLog', recentLogSchema);

export default RecentLog;

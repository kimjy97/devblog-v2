import mongoose, { Model } from 'mongoose';

interface IDailyPostView extends Document {
  ip: string;
  postId: string;
  date: Date;
}

const DailyPostViewSchema = new mongoose.Schema<IDailyPostView>({
  ip: String,
  postId: String,
  date: { type: Date, default: Date.now }
});

const DailyPostView: Model<IDailyPostView> = mongoose.models.DailyPostView || mongoose.model<IDailyPostView>('DailyPostView', DailyPostViewSchema);

export default DailyPostView;
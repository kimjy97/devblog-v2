import mongoose, { Model } from 'mongoose';

interface IPostView extends Document {
  postId: string;
  views: number;
  date: Date;
}

const PostViewSchema = new mongoose.Schema<IPostView>({
  postId: String,
  views: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const PostView: Model<IPostView> = mongoose.models.PostView || mongoose.model<IPostView>('PostView', PostViewSchema);

export default PostView;
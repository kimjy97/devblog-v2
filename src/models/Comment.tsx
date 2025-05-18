import mongoose, { Document, Schema } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import moment from 'moment-timezone';

export interface IComment extends Document {
  commentId: number;
  postId: number;
  userIp: string;
  role: string;
  nickname: string;
  password: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  parentCommentId?: number;
}

moment.tz.setDefault("Asia/Seoul");

const commentSchema = new Schema({
  postId: { type: Number, required: true, ref: 'Post' },
  userIp: { type: String, required: true },
  role: { type: String, require: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (date: Date) => moment(date).tz("Asia/Seoul")
  },
  updatedAt: {
    type: Date,
    get: (date: Date) => date ? moment(date).tz("Asia/Seoul") : null
  },
  isEdited: { type: Boolean, default: false },
  parentCommentId: { type: Number, ref: 'Comment' }
});

const AutoIncrement = AutoIncrementFactory(mongoose as any);
commentSchema.plugin(AutoIncrement as any, { inc_field: 'commentId' });

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export default Comment;

import mongoose, { Document, Schema } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import moment from 'moment-timezone';

export interface IGuestbookComment extends Document {
  guestbookCommentId: number;
  postId: number;
  userIp: string;
  role: string;
  nickname: string;
  password: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  parentCommentId?: number;
}

moment.tz.setDefault("Asia/Seoul");

const GuestbookCommentSchema = new Schema({
  userIp: { type: String, required: true },
  role: { type: String, require: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: {
    type: String,
    default: () => moment().format('YYYY-MM-DD HH:mm:ss')
  },
  updatedAt: { type: String },
  isEdited: { type: Boolean, default: false },
  parentCommentId: { type: Number, ref: 'Comment' }
});

const AutoIncrement = AutoIncrementFactory(mongoose as any);
GuestbookCommentSchema.plugin(AutoIncrement as any, { inc_field: 'guestbookCommentId', id: 'guestbook_comment_id_counter' });

const GuestbookComment = mongoose.models.GuestbookComment || mongoose.model<IGuestbookComment>('GuestbookComment', GuestbookCommentSchema);

export default GuestbookComment;
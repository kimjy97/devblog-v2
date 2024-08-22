import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import moment from 'moment-timezone';

export interface IPost extends Document {
  postId: number;
  title: string;
  description: string;
  content: string;
  name: string;
  date: string;
  time: string;
  view: number;
  cmtnum: number;
  like: number;
  tags: string[];
}

moment.tz.setDefault("Asia/Seoul");

// 스키마 정의
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  name: { type: String, default: 'JongYeon' },
  date: { type: String, default: () => moment().format('YYYY. MM. DD') },
  time: { type: String, default: () => moment().format('a hh : mm') },
  view: { type: Number, default: 0 },
  cmtnum: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

// AutoIncrement 설정
const AutoIncrement = AutoIncrementFactory(mongoose as any);
postSchema.plugin(AutoIncrement as any, { inc_field: 'postId' });

// 모델 생성 또는 가져오기
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;
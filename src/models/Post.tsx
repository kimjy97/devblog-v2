import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import moment from 'moment-timezone';

export interface IPost extends Document {
  postId: number;
  title: string;
  description: string;
  content: string;
  name: string;
  view: number;
  createdAt: Date;
  updatedAt: Date;
  cmtnum: number;
  like: number;
  tags: string[];
  status: boolean;
}

moment.tz.setDefault("Asia/Seoul");

// 스키마 정의
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  name: { type: String, default: 'JongYeon' },
  view: { type: Number, default: 0 },
  cmtnum: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  tags: [String],
  status: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (date: Date) => moment(date).tz("Asia/Seoul")
  },
  updatedAt: {
    type: Date,
    get: (date: Date) => date ? moment(date).tz("Asia/Seoul") : null
  },
});

// AutoIncrement 설정
const AutoIncrement = AutoIncrementFactory(mongoose as any);
postSchema.plugin(AutoIncrement as any, { inc_field: 'postId' });

// 모델 생성 또는 가져오기
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;

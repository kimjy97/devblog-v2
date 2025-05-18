import mongoose, { Model } from 'mongoose';

interface IVisit extends Document {
  ip: string;
  pathname: string;
  date: Date;
  userAgent?: string;
}

// 스키마 정의
const visitSchema = new mongoose.Schema<IVisit>({
  ip: String,
  pathname: String,
  date: { type: Date, default: Date.now },
  userAgent: String,
});

// 모델 생성 또는 가져오기
const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>('Visit', visitSchema);

export default Visit;

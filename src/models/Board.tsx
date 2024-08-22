import mongoose from 'mongoose';

interface IBoard extends Document {
  list: [string];
  date: [string];
}

// 스키마 정의
const boardSchema = new mongoose.Schema({
  list: [String],
  date: [String]
});

// 모델 생성 또는 가져오기
const Board = mongoose.models.Board || mongoose.model<IBoard>('Board', boardSchema);

export default Board;
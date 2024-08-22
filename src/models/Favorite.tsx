import mongoose from 'mongoose';

interface IFavorite extends Document {
  postId: number;
  ip: string;
}

const favoriteSchema = new mongoose.Schema({
  postId: { type: Number, required: true },
  ip: { type: String, required: true },
}, { timestamps: true });

const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite;
import { NextRequest, NextResponse } from 'next/server';
import Favorite from '@/models/Favorite';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import { getClientIp } from '@/utils/ip';

export async function POST(request: NextRequest) {
  await dbConnect();
  const { postId } = await request.json();
  const ip = getClientIp(request);

  if (!postId || !ip) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // 좋아요 여부 확인
  const existingFavorite = await Favorite.findOne({ postId, ip });

  if (existingFavorite) {
    return NextResponse.json({ message: 'Already favorited' }, { status: 400 });
  }

  // 좋아요 추가
  const newFavorite = new Favorite({ postId, ip });
  await newFavorite.save();

  // 포스트의 좋아요 수 증가
  await Post.findOneAndUpdate({ postId }, { $inc: { like: 1 } });

  return NextResponse.json({ message: 'Favorite added' });
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  const { postId } = await request.json();
  const ip = getClientIp(request);

  if (!postId || !ip) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // 좋아요 여부 확인
  const existingFavorite = await Favorite.findOne({ postId, ip });

  if (!existingFavorite) {
    return NextResponse.json({ message: 'Not favorited yet' }, { status: 400 });
  }

  // 좋아요 제거
  await Favorite.deleteOne({ postId, ip });

  // 포스트의 좋아요 수 감소
  await Post.findOneAndUpdate({ postId }, { $inc: { like: -1 } });

  return NextResponse.json({ message: 'Favorite removed' });
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const ip = getClientIp(request);

  if (!postId || !ip) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // 좋아요 여부 확인
  const existingFavorite = await Favorite.findOne({ postId, ip });

  return NextResponse.json({ favorited: !!existingFavorite });
}

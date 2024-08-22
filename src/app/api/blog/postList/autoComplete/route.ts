import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import { ResponseError, ResponseSuccess } from '@/constants/api';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const suggestions = await Post.find({
      $or: [
        { title: query },
        { title: { $regex: `${query.length >= 2 ? query : '(?=a)b'}`, $options: 'i' } },
      ]
    })
      .select('title')
      .limit(10)
      .lean();

    // 제목만 추출하여 배열로 반환
    const titles = suggestions.map(post => post.title);

    return ResponseSuccess(true, { titles })
  } catch (error) {
    return ResponseError(500, 'Internal Server Error', error);
  }
}
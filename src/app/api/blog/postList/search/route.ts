import { NextRequest } from 'next/server';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import { ResponseError, ResponseSuccess } from '@/constants/api';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return ResponseError(400, "Query parameter 'q' is required");
    }

    const posts = await Post.find({
      $or: [
        { title: query },
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: `${query.length >= 3 ? query : '(?=a)b'}`, $options: 'i' } }
      ]
    }).sort({ postId: 1 });

    // 태그 카운트 계산
    const tagCounts = posts.reduce((acc, post) => {
      post.tags.forEach((tag: string) => {
        if (acc[tag]) {
          acc[tag]++;
        } else {
          acc[tag] = 1;
        }
      });
      return acc;
    }, {});

    // 요청한 형식의 배열로 변환
    const tags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count
    }));

    return ResponseSuccess(true, { data: { posts, tags } });
  } catch (error) {
    return ResponseError(500, "Internal Server Error", error);
  }
}
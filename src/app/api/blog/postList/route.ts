import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const passedValue = await new Response(req.body).text();
  const { board } = JSON.parse(passedValue);

  const posts = board ?
    await Post.find({ postId: { $ne: 0 }, 'tags.0': board, status: true }).sort({ postId: 1 }) :
    await Post.find({ postId: { $ne: 0 }, status: true }).sort({ postId: 1 });

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

  const res = NextResponse.json({ success: true, data: { posts, tags } });
  res.headers.set('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=43200');
  return res;
}

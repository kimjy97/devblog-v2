import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import { ResponseError, ResponseSuccess } from "@/constants/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get('id');

  if (!id) {
    return ResponseError(400, 'ID가 제공되지 않았습니다.');
  }

  await dbConnect();

  const post = await Post.findOne({ postId: Number(id), status: true });

  if (!post) {
    return ResponseError(404, '게시물을 찾을 수 없습니다.');
  }

  const res = NextResponse.json({ success: true, post });
  res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=43200');
  return res;
}

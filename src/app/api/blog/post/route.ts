import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import { ResponseError, ResponseSuccess } from "@/constants/api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get('id');

  if (!id) {
    return ResponseError(400, 'ID가 제공되지 않았습니다.');
  }

  await dbConnect();

  const post = await Post.findOne({ postId: Number(id) });

  if (!post) {
    return ResponseError(404, '게시물을 찾을 수 없습니다.');
  }

  return ResponseSuccess(true, { post });
}
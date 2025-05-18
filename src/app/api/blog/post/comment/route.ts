import { NextRequest } from 'next/server';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import { getClientIp } from '@/utils/ip';
import { ResponseError, ResponseSuccess } from '@/constants/api';
import { createLog } from '@/utils/recentLog';

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const userIp = getClientIp(req);

  try {
    if (!body.password) {
      return ResponseError(404, '비밀번호를 입력해주세요.');
    }

    await Comment.create({
      ...body,
      userIp,
      isEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const post = await Post.findOneAndUpdate(
      { postId: body.postId },
      { $inc: { cmtnum: 1 } }
    );

    const comments = await Comment.find({ postId: body.postId }).sort({ createdAt: -1 });

    await createLog(
      `'${post.title.slice(0, 15)}...' 게시물에 댓글이 달렸습니다.`,
      Date.now(),
      body.nickname,
      `/post/${body.postId}`
    );

    return ResponseSuccess(true, { comments });
  } catch (error) {
    return ResponseError(500, '댓글을 등록할 수 없습니다.', error);
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .select('-password -_id -__v')
      .lean();

    return ResponseSuccess(true, { comments });
  } catch (error) {
    return ResponseError(500, '댓글을 불러올 수 없습니다.', error);
  }
}

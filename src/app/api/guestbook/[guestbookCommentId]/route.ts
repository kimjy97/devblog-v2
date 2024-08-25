import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ResponseError, ResponseSuccess } from '@/constants/api';
import moment from 'moment-timezone';
import GuestbookComment from '@/models/GuestbookComment';

export async function PUT(
  req: NextRequest,
  { params }: { params: { guestbookCommentId: string } }
) {
  await dbConnect();
  const { guestbookCommentId } = params;
  const body = await req.json();

  try {
    const comment = await GuestbookComment.findOne({ guestbookCommentId });

    if (!comment) {
      return ResponseError(404, '댓글을 찾을 수 없습니다.');
    }
    if (comment.password !== body.password) {
      return ResponseError(403, '설정된 비밀번호와 다릅니다.');
    }

    await GuestbookComment.findOneAndUpdate(
      { guestbookCommentId },
      {
        $set: {
          content: body.content,
          updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          isEdited: true
        }
      },
      { new: true }
    );

    const comments = await GuestbookComment.find()
      .sort({ createdAt: -1 })
      .select('-password -_id -__v')
      .lean();

    return ResponseSuccess(true, { comments });
  } catch (error) {
    return ResponseError(500, '댓글을 수정할 수 없습니다.', error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { guestbookCommentId: string } }
) {
  await dbConnect();
  const { guestbookCommentId } = params;
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');

  try {
    const comment = await GuestbookComment.findOne({ guestbookCommentId });
    if (!comment) {
      return ResponseError(404, '댓글을 찾을 수 없습니다.');
    }
    if (comment.password !== password) {
      return ResponseError(403, '설정된 비밀번호와 다릅니다.');
    }

    await GuestbookComment.deleteOne({ guestbookCommentId });

    const comments = await GuestbookComment.find()
      .sort({ createdAt: -1 })
      .select('-password -_id -__v')
      .lean();

    return ResponseSuccess(true, { comments });
  } catch (error) {
    return ResponseError(500, '댓글을 삭제할 수 없습니다.', error);
  }
}
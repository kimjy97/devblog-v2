import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getClientIp } from '@/utils/ip';
import { ResponseError, ResponseSuccess } from '@/constants/api';
import { createLog } from '@/utils/recentLog';
import GuestbookComment from '@/models/GuestbookComment';
import { getFormatLogDate } from '@/utils/date';

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const ip = getClientIp(req);

  try {
    if (!body.password) {
      return ResponseError(404, '비밀번호를 입력해주세요.');
    }

    await GuestbookComment.create({
      ...body,
      userIp: ip,
      isEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const comments = await GuestbookComment.find().sort({ createdAt: -1 });

    await createLog(
      `방명록에 글이 달렸습니다.`,
      Date.now(),
      body.nickname,
      `/guest`
    );

    const COLOR = `\x1b[94m%s\x1b[33m%s\x1b[90m%s\x1b[35m%s\x1b[37m%s\x1b[90m%s`;
    const now = `${getFormatLogDate(new Date())} `;
    console.log(COLOR, '✓ ', now, ip, ' GUESTBOOK ', body.content);

    return ResponseSuccess(true, { comments });
  } catch (error) {
    return ResponseError(500, '댓글을 등록할 수 없습니다.', error);
  }
}

export async function GET() {
  await dbConnect();

  try {
    const comments = await GuestbookComment.find()
      .sort({ createdAt: -1 })
      .select('-password -_id -__v')
      .lean();

    const res = ResponseSuccess(true, { comments });
    res.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=10800');
    return res;
  } catch (error) {
    return ResponseError(500, '댓글을 불러올 수 없습니다.', error);
  }
}

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getClientIp } from '@/utils/ip';
import { ResponseError, ResponseSuccess } from '@/constants/api';
import moment from 'moment-timezone';
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

    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');


    await GuestbookComment.create({
      ...body,
      userIp: ip,
      isEdited: false,
      createdAt: currentTime,
      updatedAt: currentTime
    });

    const comments = await GuestbookComment.find().sort({ createdAt: -1 });

    await createLog(
      `방명록에 글이 달렸습니다.`,
      currentTime,
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

    return ResponseSuccess(true, { comments });
  } catch (error) {
    return ResponseError(500, '댓글을 불러올 수 없습니다.', error);
  }
}
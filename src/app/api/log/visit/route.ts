import { ResponseError, ResponseSuccess } from '@/constants/api';
import dbConnect from '@/lib/mongodb';
import DailyPostView from '@/models/DailyPostView';
import Post from '@/models/Post';
import Visit from '@/models/Visit';
import { getFormatLogDate } from '@/utils/date';
import { getClientIp } from '@/utils/ip';
import moment from 'moment-timezone';
import { NextRequest } from 'next/server';

const categorizePathname = (pathname: string): string => {
  if (pathname.startsWith('/post/')) {
    return '/post';
  }
  if (pathname === '/chat' || pathname === '/') {
    return pathname;
  }

  return 'other';
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const passedValue = await new Response(req.body).text();
    const { pathname, timezone } = JSON.parse(passedValue);
    const ip = getClientIp(req);
    const categorizedPathname = categorizePathname(pathname);

    // 클라이언트의 timezone을 사용하여 '오늘'을 계산합니다
    const clientNow = moment().tz(timezone);
    const today = clientNow.clone().startOf('day').toDate();

    // 오늘 이 IP와 categorizedPathname으로 방문한 기록이 있는지 확인합니다
    const existingVisit = await Visit.findOne({
      ip,
      pathname: categorizedPathname,
      date: { $gte: today }
    });

    if (!existingVisit) {
      // 오늘 방문 기록이 없으면 새로운 방문을 기록합니다
      const userAgent = req.headers.get('user-agent');
      // 오늘 방문 기록이 없으면 새로운 방문을 기록합니다
      await Visit.create({
        ip,
        pathname: categorizedPathname,
        date: clientNow.toDate(),
        userAgent,
      });
    }

    // 총 방문자 수를 계산합니다
    const totalVisits = await Visit.countDocuments({ pathname: { $ne: 'other' } });

    const now = `${getFormatLogDate(clientNow.toDate())} `;
    const COLOR = `\x1b[94m%s\x1b[33m%s\x1b[90m%s\x1b[35m%s\x1b[37m%s\x1b[90m%s`;
    if (!existingVisit) console.log(COLOR, '✓ ', now, ip, ' VISIT ', pathname, ` [${totalVisits}]`);

    // 게시물 조회수 업데이트
    if (pathname.startsWith('/post/')) {
      const postId = pathname.split('/')[2];

      // 오늘 이 IP로 이 게시물을 조회한 기록이 있는지 확인합니다
      const existingDailyView = await DailyPostView.findOne({
        ip,
        postId,
        date: { $gte: today }
      });

      if (!existingDailyView) {
        // 오늘 조회 기록이 없으면 새로운 조회를 기록하고 조회수를 증가시킵니다
        await DailyPostView.create({
          ip,
          postId,
          date: clientNow.toDate()
        });

        // Post 모델의 view 필드도 업데이트
        await Post.findOneAndUpdate(
          { postId: parseInt(postId, 10) },
          { $inc: { view: 1 } }
        );
      } else {
        // 이미 오늘 조회한 경우, 현재 조회수만 가져옵니다
        await Post.findOne({ postId });
      }
    }

    return ResponseSuccess(true, { totalVisits, pathname: categorizedPathname })
  } catch (error) {
    return ResponseError(500, '방문자수 에러', error);
  }
}

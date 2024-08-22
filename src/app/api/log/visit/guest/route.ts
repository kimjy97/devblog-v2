import { ResponseError, ResponseSuccess } from '@/constants/api';
import dbConnect from '@/lib/mongodb';
import Visit from '@/models/Visit';
import { getClientIp } from '@/utils/ip';
import moment from 'moment-timezone';
import { NextRequest } from 'next/server';

const getDateRanges = (timezone: string = 'Asia/Seoul') => {
  const now = moment().tz(timezone);
  const today = now.clone().startOf('day');
  const yesterday = today.clone().subtract(1, 'day');

  return {
    today: today.toDate(),
    yesterday: yesterday.toDate(),
    now: now.toDate()
  };
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url || '', 'http://localhost');
    const clientTimezone = searchParams.get('timezone') || 'Asia/Seoul';

    const { today, yesterday, now } = getDateRanges(clientTimezone);

    // 총 방문자 수 조회
    const totalVisits = await Visit.countDocuments();

    // 어제와 오늘의 방문자 수 조회 (UTC 기준)
    const [yesterdayVisits, todayVisits] = await Promise.all([
      Visit.countDocuments({
        date: {
          $gte: moment(yesterday).utc().toDate(),
          $lt: moment(today).utc().toDate()
        }
      }),
      Visit.countDocuments({
        date: {
          $gte: moment(today).utc().toDate(),
          $lt: moment(now).utc().toDate()
        }
      }),
    ]);

    // 클라이언트 IP 가져오기
    const ip = getClientIp(req);

    // 오늘의 방문 순서 확인 (UTC 기준)
    let visitorRank = 0;
    if (ip) {
      visitorRank = await Visit.countDocuments({
        date: {
          $gte: moment(today).utc().toDate(),
          $lt: moment(now).utc().toDate()
        },
        ip: { $lt: ip }
      }) + 1;
    }

    return ResponseSuccess(true, {
      totalVisits,
      yesterdayVisits,
      todayVisits,
      visitorRank,
      timezone: clientTimezone
    });
  } catch (error) {
    return ResponseError(500, '방문자수 에러', error);
  }
}
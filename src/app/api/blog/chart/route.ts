import dbConnect from '@/lib/mongodb';
import Visit from '@/models/Visit';
import { NextRequest } from 'next/server';
import moment from 'moment-timezone';
import { ResponseError, ResponseSuccess } from '@/constants/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getDates = (numDays: number, timezone: string) => {
  const dates = [];
  const endDate = moment().tz(timezone).endOf('day');
  const startDate = moment(endDate).subtract(numDays - 1, 'days').startOf('day');

  const currentDate = moment(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toDate());
    currentDate.add(1, 'day');
  }

  return dates;
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const passedValue = await new Response(req.body).text();
    const { days, timezone } = JSON.parse(passedValue);

    const endDate = moment().tz(timezone).endOf('day');
    const startDate = moment(endDate).subtract(days - 1, 'days').startOf('day');

    const dates = getDates(days, timezone);

    const visits = await Visit.aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate()
          },
          ip: {
            $nin: ['127.0.0.1', 'localhost', '::1']
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { date: "$date", timezone } },
            month: { $month: { date: "$date", timezone } },
            day: { $dayOfMonth: { date: "$date", timezone } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    // 방문자 수를 날짜별로 정리
    const visitCountByDate: any = {};
    visits.forEach(({ _id, count }) => {
      const dateKey = moment.tz({ year: _id.year, month: _id.month - 1, day: _id.day }, timezone).toDate().toDateString();
      visitCountByDate[dateKey] = count;
    });

    // 날짜별 배열 생성, 빈 날짜는 0으로 채우기
    const data = dates.map(date => {
      const dateString = moment(date).tz(timezone).toDate().toDateString();
      return visitCountByDate[dateString] || 0;
    });

    return ResponseSuccess(true, { data });
  } catch (error) {
    return ResponseError(500, '알 수 없는 오류가 발생했습니다.', error);
  }
}

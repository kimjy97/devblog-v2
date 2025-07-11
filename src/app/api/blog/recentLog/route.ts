import { ResponseError, ResponseSuccess } from "@/constants/api";
import dbConnect from "@/lib/mongodb";
import RecentLog from "@/models/RecentLog";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const logs = await Promise.race([
      RecentLog.find().sort({ date: -1 }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 5000);
      })
    ]) as any;

    const res = ResponseSuccess(true, { logs, timestamp: new Date().toISOString() });
    res.headers.set('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=10800');
    return res;
  } catch (error) {
    console.error('Recent log fetch error:', error);

    if (error instanceof Error && error.message.includes('connection')) {
      return ResponseError(503, '데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', error);
    }

    if (error instanceof Error && error.message.includes('timeout')) {
      return ResponseError(504, '데이터베이스 쿼리 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.', error);
    }

    return ResponseError(500, '로그를 불러올 수 없습니다.', error);
  }
}
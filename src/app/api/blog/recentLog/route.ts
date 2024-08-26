import { ResponseError, ResponseSuccess } from "@/constants/api";
import dbConnect from "@/lib/mongodb";
import RecentLog from "@/models/RecentLog";

export async function GET() {
  await dbConnect();

  try {
    const logs = await RecentLog.find().sort({ date: -1 });

    return ResponseSuccess(true, { logs });
  } catch (error) {
    return ResponseError(500, '로그를 불러올 수 없습니다.', error);
  }
}
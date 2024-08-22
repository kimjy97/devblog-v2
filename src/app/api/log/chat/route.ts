import { ResponseError, ResponseSuccess } from "@/constants/api";
import { getFormatLogDate } from "@/utils/date";
import { getClientIp } from "@/utils/ip";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const passedValue = await new Response(req.body).text();
    const { chat, totalToken, usedToken, error } = JSON.parse(passedValue);
    const ip = getClientIp(req) ?? 'NO IP';
    const now = `${getFormatLogDate(new Date())} `;
    const COLOR = `${error ? '\x1b[31m%s' : '\x1b[94m%s'}\x1b[33m%s\x1b[90m%s\x1b[35m%s${error ? '\x1b[31m%s' : ''}\x1b[37m%s\x1b[90m%s`;

    if (error)
      console.log(COLOR, 'x ', now, ip, ' CHAT ', 'ERROR ', chat, `[${totalToken} + ${usedToken}]`)
    else
      console.log(COLOR, '✓ ', now, ip, ' CHAT ', chat, ` [${totalToken} + ${usedToken}]`);

    return ResponseSuccess(true, { chat })
  } catch (error) {
    return ResponseError(500, '알 수 없는 오류가 발생했습니다.', error);
  }
}
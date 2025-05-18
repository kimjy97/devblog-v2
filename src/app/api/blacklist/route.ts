import { NextRequest } from 'next/server';
import Blacklist from '@/models/Blacklist';
import dbConnect from '@/lib/mongodb';
import { ResponseError, ResponseSuccess } from '@/constants/api';
import { getClientIp } from '@/utils/ip';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { ip, reason } = await req.json();
    const blacklist = new Blacklist({ ip: ip || getClientIp(req), reason });
    await blacklist.save();
    return ResponseSuccess(true, { message: '블랙리스트에 아이피가 추가되었습니다.' })
  } catch (error) {
    return ResponseError(400, '블랙리스트에 아이피를 추가하지 못했습니다.', error)
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const ip = getClientIp(req);

  if (!ip) {
    return ResponseError(400, '아이피를 인식할 수 없습니다.');
  }

  try {
    const blacklistedIP = await Blacklist.findOne({ ip });

    if (blacklistedIP) {
      return ResponseSuccess(true, { isBlacklisted: true, reason: blacklistedIP.reason })
    }

    return ResponseSuccess(true, { isBlacklisted: false });
  } catch (error) {
    return ResponseError(400, '알 수 없는 오류가 발생했습니다.', error);
  }
}
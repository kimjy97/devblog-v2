import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export const getClientIp = (req: NextApiRequest | NextRequest): string => {
  let ip = 'localhost';
  let xForwardedFor: string | string[] | undefined;

  if ('headers' in req && typeof req.headers.get === 'function') {
    xForwardedFor = req.headers.get('x-forwarded-for') || undefined;
  }
  else if ('headers' in req && 'x-forwarded-for' in req.headers) {
    xForwardedFor = req.headers['x-forwarded-for'];
  }

  if (Array.isArray(xForwardedFor)) {
    ip = xForwardedFor[0];
  } else if (typeof xForwardedFor === 'string') {
    ip = xForwardedFor.split(',')[0].trim();
  }

  return ip === '::1' ? 'localhost' : ip;
};
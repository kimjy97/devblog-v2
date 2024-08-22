import { NextResponse } from "next/server"

export const ResponseError = (status: number, message: string, error?: any) => {
  if (error) {
    // error 처리
  }
  return NextResponse.json({ error: message }, { status });
}

export const ResponseSuccess = (success: boolean, data: any) => {
  return NextResponse.json({ success, ...data });
}
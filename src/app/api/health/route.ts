import { NextResponse } from "next/server";

export async function GET() {
  try {
    const startTime = Date.now();

    // 기본적인 서버 상태 확인
    const serverInfo = {
      status: "healthy",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    };

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return NextResponse.json({
      success: true,
      message: "Server is healthy",
      data: {
        ...serverInfo,
        responseTime: `${responseTime}ms`
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error("❌ Health check failed:", error);

    return NextResponse.json({
      success: false,
      message: "Server health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// POST 요청도 지원
export async function POST() {
  return GET();
} 
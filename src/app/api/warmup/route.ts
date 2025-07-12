import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Visit from "@/models/Visit";
import GuestbookComment from "@/models/GuestbookComment";
import RecentLog from "@/models/RecentLog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const startTime = Date.now();

    // MongoDB 연결 워밍업
    console.log("🔗 Warming up MongoDB connection...");
    await dbConnect();

    // 주요 컬렉션에 대한 간단한 쿼리 실행
    console.log("📊 Warming up database queries...");

    // 병렬로 여러 컬렉션 워밍업
    const warmupPromises = [
      // 포스트 컬렉션 워밍업
      Post.findOne({ status: true }).sort({ postId: -1 }).limit(1),
      Post.countDocuments({ status: true }),

      // 댓글 컬렉션 워밍업
      Comment.countDocuments(),

      // 방문자 통계 워밍업
      Visit.countDocuments(),

      // 방명록 워밍업
      GuestbookComment.countDocuments(),

      // 최근 로그 워밍업
      RecentLog.countDocuments()
    ];

    const [
      recentPost,
      totalPosts,
      totalComments,
      totalVisits,
      totalGuestbookComments,
      totalRecentLogs
    ] = await Promise.all(warmupPromises);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Warmup completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: "Warmup completed successfully",
      data: {
        duration: `${duration}ms`,
        mongodbConnected: true,
        collections: {
          posts: {
            recentPostId: recentPost?.postId || null,
            totalCount: totalPosts
          },
          comments: {
            totalCount: totalComments
          },
          visits: {
            totalCount: totalVisits
          },
          guestbookComments: {
            totalCount: totalGuestbookComments
          },
          recentLogs: {
            totalCount: totalRecentLogs
          }
        },
        timestamp: new Date().toISOString()
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
    console.error("❌ Warmup failed:", error);

    return NextResponse.json({
      success: false,
      message: "Warmup failed",
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

// POST 요청도 지원 (cron-job에서 사용할 수 있도록)
export async function POST() {
  return GET();
} 
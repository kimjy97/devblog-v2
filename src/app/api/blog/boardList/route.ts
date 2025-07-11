import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import moment from 'moment-timezone';
import { ResponseSuccess } from "@/constants/api";
import { NextResponse } from "next/server"; // Import NextResponse

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getBoardDatelist = (date: any) => {
  if (!date) {
    return '';
  }
  const date1 = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
  const date2 = new Date(date);

  const diffDate = date1.getTime() - date2.getTime();

  if (diffDate > 1000 * 60 * 60 * 24 * 30 * 12) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60 * 24 * 30 * 12)))}년 전`;
  if (diffDate > 1000 * 60 * 60 * 24 * 30) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60 * 24 * 30)))}개월 전`;
  if (diffDate > 1000 * 60 * 60 * 24) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60 * 24)))}일 전`;
  if (diffDate > 1000 * 60 * 60) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60)))}시간 전`;
  if (diffDate > 1000 * 60) return `${Math.abs(Math.floor(diffDate / (1000 * 60)))}분 전`;
  if (diffDate > 1000) return '방금 전';

  return '방금 전';
}

export async function GET() {
  await dbConnect();

  moment.tz.setDefault("Asia/Seoul");

  try {
    const posts = await Post.find({ status: true }).sort({ createdAt: -1 });

    const boardMap = new Map();

    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        const boardName = post.tags[0];

        if (!boardMap.has(boardName)) {
          boardMap.set(boardName, {
            name: boardName,
            count: 0,
            createdAt: null,
            dateString: ''
          });
        }

        const boardInfo = boardMap.get(boardName);
        boardInfo.count++;

        if (!boardInfo.createdAt || new Date(post.createdAt) > new Date(boardInfo.createdAt)) {
          boardInfo.createdAt = post.createdAt;
        }
      }
    });

    const boards = Array.from(boardMap.values()).map(board => ({
      ...board,
      date: board.createdAt,
      dateString: getBoardDatelist(board.createdAt)
    }));

    boards.sort((a, b) => a.name.localeCompare(b.name));

    const response = ResponseSuccess(true, { boards });
    response.headers.set('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=43200');
    return response;

  } catch (error) {
    console.error("Error fetching board list:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch board list." }, { status: 500 });
  }
}

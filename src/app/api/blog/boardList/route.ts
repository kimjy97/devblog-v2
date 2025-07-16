import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import { ResponseSuccess } from "@/constants/api";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await dbConnect();

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
      date: board.createdAt
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

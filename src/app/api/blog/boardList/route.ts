import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import moment from 'moment-timezone';
import Board from "@/models/Board";
import { ResponseSuccess } from "@/constants/api";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await dbConnect();

  moment.tz.setDefault("Asia/Seoul");


  const getBoardlist = (posts: any, borads: any) => {
    const result = borads[0].list.map((board: any, idx: number) => {
      const count = posts.filter((post: any) => post.tags[0] === board).length;
      return { name: board, count, date: borads[0].date[idx], dateString: getBoardDatelist(borads[0].date[idx]) };
    });

    return result;
  }

  const getBoardDatelist = (board: any) => {
    if (!board) {
      return '';
    }
    const date1 = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    const date2 = new Date(board);

    const diffDate = date1.getTime() - date2.getTime();

    if (diffDate > 1000 * 60 * 60 * 24 * 30 * 12) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60 * 24 * 30 * 12)))}년 전`;
    if (diffDate > 1000 * 60 * 60 * 24 * 30) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60 * 24 * 30)))}개월 전`;
    if (diffDate > 1000 * 60 * 60 * 24) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60 * 24)))}일 전`;
    if (diffDate > 1000 * 60 * 60) return `${Math.abs(Math.floor(diffDate / (1000 * 60 * 60)))}시간 전`;
    if (diffDate > 1000 * 60) return `${Math.abs(Math.floor(diffDate / (1000 * 60)))}분 전`;
    if (diffDate > 1000) return '방금 전';

    return '방금 전'; // 기본 반환값 추가
  }

  const posts = await Post.find({ status: true }).sort({ postId: 1 });
  const boards = await Board.find({});

  const response = ResponseSuccess(true, { boards: getBoardlist(posts, boards) });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

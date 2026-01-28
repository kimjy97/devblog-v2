import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const passedValue = await new Response(req.body).text();
  const { board, page = 1, limit = 10, sort = 'latest' } = JSON.parse(passedValue);

  const query = board
    ? { postId: { $ne: 0 }, 'tags.0': board, status: true }
    : { postId: { $ne: 0 }, status: true };

  const total = await Post.countDocuments(query);
  let sortOption = {};
  switch (sort) {
    case 'popular':
      sortOption = { like: -1, cmtnum: -1, view: 1 };
      break;
    case 'comments':
      sortOption = { cmtnum: -1 };
      break;
    case 'latest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const posts = await Post.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach((tag: string) => {
      if (acc[tag]) {
        acc[tag]++;
      } else {
        acc[tag] = 1;
      }
    });
    return acc;
  }, {});

  const tags = Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count
  }));

  const res = NextResponse.json({ success: true, data: { posts, tags, total } });
  res.headers.set('Cache-Control', 'public, s-maxage=0, stale-while-revalidate=43200');
  return res;
}

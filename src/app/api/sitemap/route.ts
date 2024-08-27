import { apiPost } from '@/services/api';
import { PostInfo } from '@/types/post';
import { NextRequest, NextResponse } from 'next/server';

const fetchPosts = async () => {
  const result: PostInfo[] = await apiPost('/blog/postList', {})
    .then((res) => res.data.posts);

  return result;
}

export async function GET(req: NextRequest) {
  const host = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const origin = `${protocol}://${host}`;
  // 정적 페이지 목록
  const staticPages = [
    { url: `${origin}/`, lastMod: new Date().toISOString() },
    { url: `${origin}/chat`, lastMod: new Date().toISOString() },
    { url: `${origin}/guest`, lastMod: new Date().toISOString() },
  ];

  // 동적 게시글 목록 가져오기
  const posts = await fetchPosts();
  const postPages = posts.map((post) => ({
    url: `${origin}/post/${post.postId}`,
    lastMod: new Date(new Date(`${post.date.replaceAll(' ', '')} ${post.time.slice(3).replaceAll(' ', '')}`)),
  }));

  // 모든 페이지 합치기
  const allPages = [...staticPages, ...postPages];

  // 사이트맵 XML 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
      .map((page) => {
        return `
            <url>
              <loc>${page.url}</loc>
              <lastmod>${page.lastMod}</lastmod>
            </url>
          `;
      })
      .join('')}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

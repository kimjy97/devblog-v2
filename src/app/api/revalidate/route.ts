import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { secret, path: specificPath } = body;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // @ts-ignore
    const { revalidatePath } = await import('next/cache');

    if (specificPath) {
      await revalidatePath(specificPath);
      return NextResponse.json({
        revalidated: true,
        path: specificPath,
        now: Date.now()
      });
    }

    // 모든 캐시 무효화 (게시물 관련 경로들)
    const pathsToRevalidate = [
      '/api/blog/post',
      '/api/blog/postList',
      '/api/blog/boardList',
      '/api/blog/chart',
      '/api/blog/recentLog',
      '/api/guestbook',
      '/post',
      '/'
    ];

    await Promise.all(
      pathsToRevalidate.map(path => revalidatePath(path))
    );

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      now: Date.now()
    });
  } catch (err) {
    return NextResponse.json({
      message: 'Error revalidating',
      error: String(err)
    }, { status: 500 });
  }
} 
import { MetadataRoute } from 'next'
import Post from '@/models/Post'
import dbConnect from '@/lib/mongodb'

const fetchPostsForSitemap = async () => {
  try {
    await dbConnect();

    // status가 true인 게시물만 가져오기 (공개된 게시물만)
    const posts = await Post.find({
      postId: { $ne: 0 },
      status: true
    }).sort({ postId: -1 }); // 최신순으로 정렬

    return posts;
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return []
  }
}

const formatDate = (date: Date | string) => {
  try {
    if (typeof date === 'string') {
      return new Date(date);
    }
    return date instanceof Date ? date : new Date(date);
  } catch {
    return new Date()
  }
}

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${domain}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${domain}/chat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${domain}/guest`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const posts = await fetchPostsForSitemap()
  const postPages: MetadataRoute.Sitemap = posts.map((post: any) => {
    const lastModified = formatDate(post.updatedAt || post.createdAt);
    const priority = post.view > 100 ? 0.8 : 0.7; // 조회수가 높은 게시물은 우선순위 높임

    return {
      url: `${domain}/post/${post.postId}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority
    };
  });

  return [...staticPages, ...postPages]
}

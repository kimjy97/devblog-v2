import { MetadataRoute } from 'next'
import { IPost } from '@/models/Post'

const fetchPostsForSitemap = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/postList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Server',
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const data = await response.json()
    return data.data.posts
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return []
  }
}

const formatDate = (date: Date) => {
  try {
    return date
  } catch {
    return new Date()
  }
}

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_URL

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
  const postPages: MetadataRoute.Sitemap = posts.map((post: IPost) => ({
    url: `${domain}/post/${post.postId}`,
    lastModified: formatDate(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.5
  }))

  return [...staticPages, ...postPages]
}

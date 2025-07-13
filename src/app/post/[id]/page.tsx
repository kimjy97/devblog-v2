import { Metadata } from 'next';
import { defaultMeta } from '@/constants/meta';
import { PostInfo } from '@/types/post';
import PostPageClient from './PostPageClient';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';

interface Props {
  params: {
    id: string;
  };
}

const getPostInfo = async (id: string): Promise<PostInfo | null> => {
  try {
    await dbConnect();

    const post = await Post.findOne({ postId: Number(id), status: true });

    if (!post) {
      return null;
    }

    // PostInfo 타입에 맞게 변환
    const postInfo: PostInfo = {
      postId: post.postId,
      name: post.name,
      title: post.title,
      description: post.description,
      tags: post.tags,
      content: post.content,
      time: post.createdAt ? new Date(post.createdAt).toISOString() : '',
      date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '',
      like: post.like,
      cmtnum: post.cmtnum,
      view: post.view,
    };

    return postInfo;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postInfo = await getPostInfo(params.id);

  const metadata = {
    title: postInfo?.title || defaultMeta.title,
    description: postInfo?.description ?? defaultMeta.description,
    openGraph: {
      title: postInfo?.title || defaultMeta.title,
      description: postInfo?.description ?? defaultMeta.description,
      type: 'article',
      authors: [postInfo?.name || 'JongYeon'],
      tags: postInfo?.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: postInfo?.title || defaultMeta.title,
      description: postInfo?.description ?? defaultMeta.description,
    }
  };

  return metadata;
}

const PostPage = ({ params }: Props) => {
  return <PostPageClient params={params} />;
}

export default PostPage;
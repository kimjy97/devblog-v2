import { Metadata } from 'next';
import { defaultMeta } from '@/constants/meta';
import { serverApiGet } from '@/services/api';
import { PostInfo } from '@/types/post';
import PostPageClient from './PostPageClient';

interface Props {
  params: {
    id: string;
  };
}

const getPostInfo = async (id: string): Promise<PostInfo | null> => {
  try {
    return await serverApiGet('/api/blog/post', {
      params: { id: Number(id) }
    }).then((res: any) => res.post);
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postInfo = await getPostInfo(params.id);

  const metadata = {
    title: postInfo?.title
      ? `[${postInfo.tags[0]}] ${postInfo.title} - JongYeon의 개발 블로그`
      : defaultMeta.title,
    description: postInfo?.description ?? defaultMeta.description,
  };

  return metadata;
}

const PostPage = ({ params }: Props) => {
  return <PostPageClient params={params} />;
}

export default PostPage;
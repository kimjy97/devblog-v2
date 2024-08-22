import type { Metadata } from "next";
import { apiGet } from "@/services/api";
import { PostInfo } from "@/types/post";
import { defaultMeta } from "@/constants/meta";

const getPostInfo = async (id: string): Promise<PostInfo | null> => {
  try {
    return await apiGet('/api/blog/post', {
      params: { id: Number(id) }
    }).then((res: any) => res.post);
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const postInfo = await getPostInfo(params.id);

  return {
    title: postInfo?.title
      ? `${postInfo.title} - JongYeon의 개발 블로그`
      : defaultMeta.title,
    description: postInfo?.description ?? defaultMeta.description,
  };
}

const PostLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
}

export default PostLayout;

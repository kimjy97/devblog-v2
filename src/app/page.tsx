import { defaultMeta } from "@/constants/meta";
import Blog from "@/containers/Blog";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  let board = searchParams?.board as string;
  if (board === 'all') board = '전체글보기';

  return {
    title: board ? `${defaultMeta.title} - ${board}` : defaultMeta.title,
  };
}

const Home = () => {
  return <Blog />
}

export default Home;
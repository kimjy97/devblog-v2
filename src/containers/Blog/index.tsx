'use client'

import { useLayout } from "@/hooks/useLayout";
import { useSearchParams } from "next/navigation";
import MainBlog from "@/containers/Blog/MainBlog";
import BoardBlog from "@/containers/Blog/BoardBlog";


const Blog = (): JSX.Element => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const board = searchParams.get('board');
  const blogType = !board && !search;
  useLayout({
    isSidebar: true,
  });

  return blogType ? <MainBlog /> : <BoardBlog />
};

export default Blog;
'use client'

import { useLayout } from "@/hooks/useLayout";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MainBlog from "@/containers/Blog/MainBlog";
import BoardBlog from "@/containers/Blog/BoardBlog";


const Blog = (): JSX.Element => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const board = searchParams.get('board');
  const { setFixedButtonConfig, setOverflow, setIsSidebar } = useLayout();
  const blogType = !board && !search;

  useEffect(() => {
    setIsSidebar(true);
    setFixedButtonConfig({ display: 'flex' });
    setOverflow('visible');
  }, []);

  return blogType ? <MainBlog /> : <BoardBlog />
};

export default Blog;
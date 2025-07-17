import { pageLoadingState } from '@/atoms/pageLoading';
import { INDEX_MAIN } from '@/constants/zIndex';
import PostList from '@/containers/PostList/PostList';
import TagList from '@/containers/PostList/TagList';
import { useBoardPostsQuery } from '@/hooks/useBoardPostsQuery';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

const BoardBlog = (): JSX.Element => {
  const searchParams = useSearchParams();
  const board = searchParams.get('board');
  const search = searchParams.get('search');
  const isPageLoading = useRecoilValue(pageLoadingState);
  const className = `${!isPageLoading ? 'visible' : ''}`

  // react-query로 게시글/태그 fetch
  const { data, isLoading, isError } = useBoardPostsQuery({ board, search });

  return (
    <Container className={className}>
      <PostList data={data} isLoading={isLoading} isError={isError} />
      <TagList tags={data?.tags} posts={data?.posts} />
    </Container>
  )
};

export default BoardBlog;

/** 모듈 나타나는 애니메이션 생성 (각 모듈마다 딜레이 적용) */
const generateDelayStyles = () => {
  const itemCount = 10;
  const delay = 150;
  let styles = '';

  for (let i = 1; i <= itemCount; i++) {
    styles += `
      & #fade_${i} {
        opacity: 0;
        transform: translateY(10px);

        animation: slideUpAni 600ms forwards;
        animation-delay: ${(delay * i)}ms;
      }
    `;
  }

  return css`${styles}`;
};

const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 100%;
  margin-left: 0.5rem;
  margin-right: 1rem;
  padding-inline-end: 16px;
  padding: 1.5rem;
  margin-top: calc(var(--sidebar-top) + 0px);
  margin-bottom: 1rem;

  border-radius: 16px;
  background-color: var(--bg-sidebar);
  filter: var(--bg-sidebar-shadow);

  will-change: transform;
  transition: 150ms;
  z-index: ${INDEX_MAIN};

  &.visible {
    ${generateDelayStyles()}
  }

  @media (max-width: 1280px) {
    margin-left: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0;
    margin-left: 0rem;
    margin-right: 0rem;
    
    border-radius: 0px;
    background-color: transparent;
    filter: none;
  }

  @keyframes slideUpAni {
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`

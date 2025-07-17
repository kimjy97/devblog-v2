'use client';

import PostComment from '@/containers/PostMarkDown/PostComment';
import PostContents from '@/containers/PostMarkDown/PostContents';
import PostFavorite from '@/containers/PostMarkDown/PostFavorite';
import PostTags from '@/containers/PostMarkDown/PostTags';
import PostTitle from '@/containers/PostMarkDown/PostTitle';
import { useLayout } from '@/hooks/useLayout';
import { usePostInfoQuery } from '@/hooks/usePostInfoQuery';
import { Pretendard } from '@public/fonts';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

interface Props {
  params: {
    id: string;
  };
}

const PostPageClient = ({ params }: Props): JSX.Element => {
  useLayout();
  const { data: postInfo, isLoading, isError } = usePostInfoQuery(params.id);

  if (isLoading) {
    return (
      <Container className={Pretendard.className}>
        <Wrapper>
          <PostTitle postInfo={undefined} />
          <PostTags postInfo={undefined} />
          <PostContents postInfo={undefined} />
          <PostFavorite postInfo={undefined} />
          <PostComment postInfo={undefined} />
        </Wrapper>
      </Container>
    );
  }
  if (isError || !postInfo) {
    return (
      <Container className={Pretendard.className}>
        <Wrapper>
          <div>게시글을 불러오는 중 오류가 발생했습니다.</div>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container className={Pretendard.className}>
      <Wrapper>
        <PostTitle postInfo={postInfo} />
        <PostTags postInfo={postInfo} />
        <PostContents postInfo={postInfo} />
        <PostFavorite postInfo={postInfo} />
        <PostComment postInfo={postInfo} />
      </Wrapper>
    </Container>
  );
};

export default PostPageClient;

const Container = styled.div`
  flex: 1;
  color: var(--text-normal);
`;

const Wrapper = styled.div`
  width: calc(100% - 128px);
  max-width: 920px;
  margin: 0 auto;
  padding-top: 10.25rem;
  padding-bottom: 12.5rem;

  @media (max-width: 1280px) {
    width: calc(100% - 32px);
    padding-top: 7rem;
  }
  @media (max-width: 768px) {
    padding-top: 96px;
    font-size: 0.875rem;
  }
`;
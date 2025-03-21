'use client';

import { postInfoState } from '@/atoms/post';
import PostComment from '@/containers/PostMarkDown/PostComment';
import PostContents from '@/containers/PostMarkDown/PostContents';
import PostFavorite from '@/containers/PostMarkDown/PostFavorite';
import PostTags from '@/containers/PostMarkDown/PostTags';
import PostTitle from '@/containers/PostMarkDown/PostTitle';
import { useLayout } from '@/hooks/useLayout';
import { apiGet } from '@/services/api';
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
  const [, setPostInfo] = useRecoilState(postInfoState);
  useLayout();

  const getPostInfo = async () => {
    const result = await apiGet('/api/blog/post', {
      params: { id: params.id }
    }).then(res => res.post);

    setPostInfo(result);
  };

  useEffect(() => {
    setPostInfo(undefined);
    setTimeout(() => getPostInfo(), 0);
  }, [params]);

  return (
    <Container className={Pretendard.className}>
      <Wrapper>
        <PostTitle />
        <PostTags />
        <PostContents />
        <PostFavorite />
        <PostComment />
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
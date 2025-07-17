import { shimmer } from '@/styles/animation';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface PostTitleProps {
  postInfo?: any;
}

const PostTitle = React.memo(({ postInfo }: PostTitleProps): JSX.Element => {
  const [, setCachedPostInfo] = useState(postInfo);

  useEffect(() => {
    setCachedPostInfo(postInfo);
  }, [postInfo]);

  return (
    <Container>
      {postInfo ?
        <Wrapper>
          <Title>
            <span>{postInfo?.tags[0]} </span>{postInfo?.title}
          </Title>
          <NameAndDate>
            <div>{postInfo?.name}</div>
            <p>·</p>
            <DateTime>{moment(postInfo.createdAt).format('YYYY. MM. DD')}</DateTime>
          </NameAndDate>
        </Wrapper> :
        <>
          <PlaceholderTitle>
            <div />
            <div />
          </PlaceholderTitle>
          <PlaceholderNameAndDate>
            <div />
          </PlaceholderNameAndDate>
        </>
      }
    </Container>
  )
});

export default PostTitle;

const Container = styled.div`
  margin-bottom: 2.375rem;
  opacity: 0;

  animation: fadeInAni 700ms 300ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5em;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  opacity: 0;
  animation: fadeInAni 600ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }
`
const Title = styled.h1`
  margin-bottom: 0.75rem;

  line-height: 3.125rem;
  font-size: 2.375rem;
  font-weight: 700;
  word-break: keep-all;

  &>span {
    color: var(--text-pitem-tagname);
  }

  @media (max-width: 768px) {
    font-size: 2.25em;
    font-weight: 800;
    line-height: 1.25em;
  }
`
const NameAndDate = styled.div`
  display: flex;
  gap: 0.875em;
  padding: 0.75em 0;

  color: var(--text-sub);
  font-size: 1em;
  font-weight: 500;

  div {
    transition: 350ms;
    &:hover {
      color: var(--text-normal);
    }
  }
`
const DateTime = styled.div`
  
`
const PlaceholderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 1.75rem;

  div {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 2.5rem;
    background-color: var(--bg-post-placeholder);
    border-radius: 12px;
    
    ${shimmer}
  }

  div:nth-child(2) {
    width: 40%;
  }
`
const PlaceholderNameAndDate = styled.div`
  display: flex;
  margin-bottom: 0.3125rem;

  div {
    position: relative;
    overflow: hidden;
    width: 7.5rem;
    height: 28px;

    border-radius: 8px;
    background-color: var(--bg-post-placeholder);

    ${shimmer}
  }
`

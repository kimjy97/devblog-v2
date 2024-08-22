import { postInfoState } from '@/atoms/post';
import { shimmer } from '@/styles/animation';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const PostTags = (): JSX.Element => {
  const postInfo = useRecoilValue(postInfoState);

  return (
    <Container>
      {postInfo ?
        <Wrapper>
          {postInfo?.tags.map((i: any, idx: number) =>
            <Tag href={{ pathname: '/', query: { board: 'all', tag: i } }} key={idx}>{i}</Tag>
          )}
        </Wrapper>
        :
        <Wrapper>
          <Placeholder />
          <Placeholder />
          <Placeholder />
        </Wrapper>
      }
    </Container>
  )
};

export default PostTags;

const Container = styled.ul`
  margin-bottom: 2.5rem;

  opacity: 0;

  animation: fadeInAni 700ms 300ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 2em;
  }
`
const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  opacity: 0;
  animation: fadeInAni 600ms 400ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }
`
const Tag = styled(Link)`
  padding: 0.375em 0.5em;
  border-radius: 4px;

  background-color: var(--color-tag);
  font-size: 0.875em;
  white-space: nowrap;

  transition: 150ms;

  &:hover {
    background-color: var(--color-tag-hover);
    transform: scale(1.05);
  }
`

const Placeholder = styled.div`
  position: relative;
  overflow: hidden;
  width: 5.125rem;
  height: 1.8125rem;
  background-color: var(--bg-post-placeholder);
  border-radius: 8px;
    
  ${shimmer}
`


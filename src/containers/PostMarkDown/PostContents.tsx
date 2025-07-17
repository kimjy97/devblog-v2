import PostMarkdownViewer from '@/components/Markdown/PostMarkdownViewer';
import { shimmer } from '@/styles/animation';
import styled from 'styled-components';

interface PostContentsProps {
  postInfo?: any;
}

const PostContents = ({ postInfo }: PostContentsProps): JSX.Element => {
  return (
    <Container>
      {postInfo ?
        <Wrapper>
          <PostMarkdownViewer text={postInfo?.content ?? ''} />
        </Wrapper>
        :
        <PlaceholderWrapper>
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
        </PlaceholderWrapper>
      }
    </Container>
  )
};

export default PostContents;

const Container = styled.ul`
  padding-bottom: 100px;

  opacity: 0;

  animation: fadeInAni 700ms 300ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-wrap: wrap;

  opacity: 0;
  animation: fadeInAni 600ms 250ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }
`
const PlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 2.5rem;

  opacity: 0;
  animation: fadeInAni 600ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }
`
const Placeholder = styled.div`
  position: relative;
  overflow: hidden;
  height: 2.125rem;
  background-color: var(--bg-post-placeholder);
  border-radius: 12px;

  &:nth-child(1) {width: 20%;}
  &:nth-child(2) {width: 80%;}
  &:nth-child(3) {width: 70%;}
  &:nth-child(4) {width: 60%;}
  &:nth-child(5) {width: 30%;}
  &:nth-child(6) {width: 90%;}
  &:nth-child(7) {width: 80%;}
  &:nth-child(8) {width: 90%;}
  &:nth-child(9) {width: 70%;}
    
  ${shimmer}
`


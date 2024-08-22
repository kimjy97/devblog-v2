import { shimmer } from '@/styles/animation';
import styled from 'styled-components';

const PlaceholderPost = (): JSX.Element => {
  return (
    <Container>
      {Array.from({ length: 6 }).map((i: any, idx: number) => (
        <Placeholder key={idx}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </Placeholder>
      ))}
    </Container>
  )
};

export default PlaceholderPost;

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 0 0.5rem;

  opacity: 0;

  animation: fadeInAni 200ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 1454px) {
    width: 100%;
  }
  @media (max-width: 768px) {
    row-gap: 26px;
    column-gap: 20px;
  }
`
const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  min-height: 280px;
  max-height: 370px;
  width: 100%;
  aspect-ratio: 100/125;
  
  box-sizing: border-box;
  overflow: hidden;

  div:not(:nth-child(5)) {
    position: relative;
    overflow: hidden;

    background-color: var(--bg-pitem-board-placeholder);

    ${shimmer}
  }
  
  div:nth-child(1) {
    position: relative;
    width: 100%;
    max-height: 210px;
    aspect-ratio: 8/5;
    margin-bottom: 0.625rem;

    border-radius: 12px;
  }

  div:nth-child(2) {
    width: 30%;
    height: 0.875rem;
    margin-bottom: 10px;

    border-radius: 5px;
  }

  div:nth-child(3) {
    width: 90%;
    height: 1.25rem;
    margin-bottom: 0.375rem;

    border-radius: 8px;
  }
  div:nth-child(4) {
    width: 40%;
    height: 1.25rem;

    border-radius: 8px;
  }
  div:nth-child(5) {
    flex: 1;
  }
  div:nth-child(6) {
    width: 80%;
    height: 1.25rem;
    margin-bottom: 0.375rem;

    border-radius: 8px;
  }
`
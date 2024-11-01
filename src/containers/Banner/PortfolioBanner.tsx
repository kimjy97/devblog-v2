import styled from 'styled-components';
import { Pretendard } from '../../../public/fonts';
import { useEffect, useRef, useState } from 'react';

const PortfolioBanner = () => {
  const RadialRef = useRef<any>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (RadialRef.current) {
      const rect = RadialRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Container
      className={Pretendard.className}
      id='fade_2'
      href='https://kimjy-portfolio.vercel.app'
      target='_target'
    >
      <Background />
      <RadialBackground ref={RadialRef} $mouseX={mousePosition.x} $mouseY={mousePosition.y} />
      <ContentsWrapper>
        <Title>
          <p id='head'>PORTFOLIO</p>
          <p id='sub'>Front-end Develeoper</p>
        </Title>
      </ContentsWrapper>
    </Container>
  )
};
export default PortfolioBanner;


const Container = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;
  gap: 12px;

  border: 1px solid var(--bg-banner-portfolio-border);
  border-radius: 12px;
  box-shadow: var(--bg-pitem-boxshadow);
  overflow: hidden;
  cursor: pointer;
  user-select: none;

  transition: 150ms, border 150ms;

  &:hover {
    border: 1px solid var(--bg-banner-portfolio-border-hover);
    box-shadow: var(--bg-pitem-hover-boxshadow);
  }
`
const ContentsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background: var(--bg-banner-portfolio);
`
const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.125rem;

  #head {
    color: var(--text-normal);
    font-size: 2.125rem;
    font-weight: 900;
  }
  #sub {
    color: var(--text-banner-portfolio-sub);
    font-size: 0.875rem;
    font-weight: 600;
  }
`
const RadialBackground = styled.div<{ $mouseX: number, $mouseY: number }>`
  position: absolute;
  width: 100%;
  height: 100%;

  background: ${({ $mouseX, $mouseY }) => `radial-gradient(circle 300px at ${$mouseX}px ${$mouseY}px, var(--bg-banner-github-effect))`};
`

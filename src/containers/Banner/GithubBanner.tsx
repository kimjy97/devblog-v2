import styled from 'styled-components';
import IconGithub from '@public/svgs/github.svg';
import { useRef, useState, useEffect } from 'react';
import { Pretendard } from '@public/fonts';

const GithubBanner = (): JSX.Element => {
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
      href='https://github.com/kimjy97'
      target='_target'
    >
      <ContentsWrapper>
        <RadialBackground ref={RadialRef} $mouseX={mousePosition.x} $mouseY={mousePosition.y} />
        <GithubIcon width={54} height={54} />
        <p>JongYeon&apos;s <span>GitHub</span></p>
      </ContentsWrapper>
    </Container>
  )
};
export default GithubBanner;

const Container = styled.a`
  position: relative;
  height: 160px;

  background: var(--bg-banner-github);
  border: 1px solid var(--bg-banner-github-border);
  border-radius: 12px;
  box-shadow: var(--bg-pitem-boxshadow);
  overflow: hidden;

  transition: 150ms, border 150ms;
  cursor: pointer;

  &:hover {
    border: 1px solid var(--bg-banner-github-border-hover);
    box-shadow: var(--bg-pitem-hover-boxshadow);
  }
`
const GithubIcon = styled(IconGithub)`
`
const ContentsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  
  user-select: none;

  &>p {
    color: var(--text-normal);
    font-size: 1.25rem;
    font-weight: 400;

    &>span {
      font-size: 1.25rem;
      font-weight: 800;
    }
  }

  &>svg {
    filter: var(--filter-invert-reverse);
  }
`
const RadialBackground = styled.div<{ $mouseX: number, $mouseY: number }>`
  position: absolute;
  width: 100%;
  height: 100%;

  background: ${({ $mouseX, $mouseY }) => `radial-gradient(circle 300px at ${$mouseX}px ${$mouseY}px, var(--bg-banner-github-effect))`};
`

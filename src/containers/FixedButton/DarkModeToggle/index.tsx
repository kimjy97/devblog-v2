'use client'

import styled from 'styled-components';
import darkmodeIcon from '@public/images/darkmode.png'
import lightmodeIcon from '@public/images/lightmode.png'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { darkmodeState } from '@atoms/darkmode';

type Mode = 'dark' | 'light';

const DarkModeToggle = (): JSX.Element => {
  const osTheme: boolean = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  const [, setDarkmode] = useRecoilState(darkmodeState);
  const [toggle, setToggle] = useState<boolean | null>(null);

  /* toggle -> true : 다크 모드 */
  /* toggle -> flase : 라이트 모드 */

  const handleClickToggle = () => {
    const mode: Mode = !toggle ? 'dark' : 'light';

    setToggle(!toggle);
    localStorage.setItem("theme", mode);
  }

  useEffect(() => {
    const theme: string | null = localStorage.getItem('theme');
    let isDark: boolean | null;

    if (theme === null) {
      isDark = osTheme;
      localStorage.setItem("theme", osTheme ? 'dark' : 'light');
    }
    else isDark = (theme !== 'light');

    setToggle(isDark);
  }, []);

  useEffect(() => {
    const mode = toggle ? 'dark' : 'light';
    if (toggle !== null) {
      document.documentElement.setAttribute("data-theme", mode);
      setDarkmode(mode);
    }
  }, [toggle])

  return (
    <Container onClick={handleClickToggle}>
      <Wrapper>
        <Button className={toggle ? 'dark' : 'light'}>
          <Image id='darkImg' src={darkmodeIcon} alt='dark' width={18} height={18} unoptimized />
          <Image id='lightImg' src={lightmodeIcon} alt='dark' width={18} height={18} unoptimized />
        </Button>
      </Wrapper>
    </Container>
  )
};
export default DarkModeToggle;


const Container = styled.div`
  display: flex;
  
  user-select: none;
  cursor: pointer;
  transition: transform 200ms;

  @media (max-width: 768px) {
    right: 6px;
  }
`
const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  aspect-ratio: 1/1;

  border-radius: 100%;
  background-color: var(--bg-darkmode);
  box-shadow: 0 0 12px rgba(0,0,0,0.2);
  overflow: hidden;

  transition: box-shadow 150ms ease-out, background-color 150ms ease-out;

  &:hover {
    background-color: var(--bg-darkmode-hover);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    &>div {
      width: 42px;
      &>img {
        transform: scale(1.3);
      }
    }
  }
`

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  aspect-ratio: 1/1;

  border-radius: 100%;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);

  transition: 100ms ease-in-out, background-color 150ms ease-out, width 200ms, height 200ms;
  
  &>img {
    position: absolute;
    transition: opacity 200ms, transform 200ms;
  }

  &.light {
    background: linear-gradient(rgb(58, 58, 145), rgb(113, 113, 180));
    &>#darkImg {
      opacity: 1;
    }
    &>#lightImg {
      opacity: 0;
    }
  }
  &.dark {
    background: linear-gradient(rgb(71, 71, 228), rgb(126, 126, 229));
    &>#darkImg {
      opacity: 0;
    }
    &>#lightImg {
      opacity: 1;
    }
  }
`





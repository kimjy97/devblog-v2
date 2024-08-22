'use client'

import { useEffect } from 'react';
import styled from 'styled-components';
import { Pretendard } from '../../../public/fonts';
import { INDEX_PAGELOADING } from '@constants/zIndex';
import { useRecoilState } from 'recoil';
import { pageLoadingState } from '@/atoms/pageLoading';

const PageLoading = (): JSX.Element => {
  const [isLoading, setIsLoading] = useRecoilState(pageLoadingState);
  const className = `${Pretendard.className} ${!isLoading ? 'complete' : ''}`;

  useEffect(() => {
    const theme = localStorage.getItem('theme') !== null;
    const result = theme;

    if (result) {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, [])

  return (
    <Container className={className} />
  )
};
export default PageLoading;


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  background: var(--bg-loading);
  opacity: 1;

  pointer-events: none;
  z-index: ${INDEX_PAGELOADING};
  transition: 300ms 200ms;
  
  &>h1 {
    color: #000000;
    font-size: 1.4rem;
  }
  
  &.complete {
    background: var(--bg-loading);
    opacity: 0;
  }
`
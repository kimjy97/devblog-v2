'use client'

import { useLayout } from '@/hooks/useLayout';
import { Pretendard } from '@public/fonts';
import { useLayoutEffect } from 'react';
import styled from 'styled-components';

interface IProps {
  children: any
};

const PageContainer = ({ children }: IProps): JSX.Element => {
  const { setFixedButtonConfig, setOverflow, setIsSidebar } = useLayout();

  useLayoutEffect(() => {
    setIsSidebar(false);
    setFixedButtonConfig({ display: 'none' });
    setOverflow('visible');
  }, [])

  return (
    <Container className={Pretendard.className}>
      {children}
    </Container>
  )
};

export default PageContainer;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 43.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 0 1rem;
  padding-top: calc(var(--header-height) + 1rem);
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    padding-top: calc(var(--header-height) + 1rem);
  }
`

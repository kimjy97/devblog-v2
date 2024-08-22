'use client'

import { INDEX_DARKMODE } from '@/constants/zIndex';
import DarkModeToggle from '@containers/FixedButton/DarkModeToggle';
import TopButton from '@containers/FixedButton/TopButton'
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { fixedButtonConfigState } from '@/atoms/layout';
import { useEffect } from 'react';

const FixedButton = (): JSX.Element => {
  const fixedButtonConfig = useRecoilValue(fixedButtonConfigState);

  useEffect(() => {
  }, [fixedButtonConfig])

  return (
    <Container style={fixedButtonConfig}>
      <TopButton />
      <DarkModeToggle />
    </Container>
  )
};
export default FixedButton;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: fixed;
  bottom: 50px;
  right: 24px;

  z-index: ${INDEX_DARKMODE};

  @media (max-width: 1280px) {
    right: 16px !important;
  }
`
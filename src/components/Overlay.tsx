'use client'

import { overlayState } from '@/atoms/layout';
import { INDEX_OVERLAY } from '@/constants/zIndex';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const Overlay = (): JSX.Element => {
  const overlay = useRecoilValue(overlayState);
  const className = overlay ? 'visible' : '';

  useEffect(() => {
  }, [overlay]);

  return (
    <Container className={className} />
  )
};

export default Overlay;

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  
  opacity: 0;
  background: linear-gradient(#000e 0%, #0006 25%, #0006 75%, #000e 100%);
  z-index: ${INDEX_OVERLAY};
  pointer-events: none;

  transition: 150ms;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
`
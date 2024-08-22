'use client'

import { overlayState } from '@/atoms/layout';
import { INDEX_MODALS } from '@/constants/zIndex';
import ChatItemDeleteModal from '@/containers/Modals/ChatItemDeleteModal';
import ChatItemRenameModal from '@/containers/Modals/ChatItemRenameModal';
import { Pretendard } from '@public/fonts';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const Modals = (): JSX.Element => {
  const [overlay, setOverlay] = useRecoilState(overlayState);

  useEffect(() => {
    setOverlay(false);
  }, [])

  return (
    <Container className={Pretendard.className}>
      <Background className={overlay ? 'visible' : ''} />
      <ChatItemDeleteModal />
      <ChatItemRenameModal />
    </Container>
  )
};

export default Modals;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: ${INDEX_MODALS};

  pointer-events: none;

  & > div {
    z-index: 1;
  }
`
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  opacity: 0;
  background: var(--bg-modal-overlay);
  
  pointer-events: none;
  z-index: 0;
  transition: 150ms;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
`


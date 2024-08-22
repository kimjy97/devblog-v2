'use client'

import AIChatFull from '@/containers/AIChatFull';
import { useStaticHeader } from '@/hooks/useHeader';
import { useLayout } from '@/hooks/useLayout';
import useSidebar from '@/hooks/useSidebar';
import { useLayoutEffect } from 'react';
import styled from 'styled-components';

const ChatPage = (): JSX.Element => {
  const { setFixedButtonConfig, setOverflow } = useLayout();
  useSidebar(false);
  useStaticHeader(true);

  useLayoutEffect(() => {
    setFixedButtonConfig({ display: 'none' });
    setOverflow('hidden');
  }, [])

  return (
    <Container>
      <AIChatFull />
    </Container>
  )
};

export default ChatPage;


const Container = styled.div`
  width: 100%;
`
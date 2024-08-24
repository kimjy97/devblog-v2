'use client'

import AIChatFull from '@/containers/AIChatFull';
import { useLayout } from '@/hooks/useLayout';
import styled from 'styled-components';

const ChatPage = (): JSX.Element => {
  useLayout({
    isSidebar: false,
    isStaticHeader: true,
    fixedButton: { display: 'none' },
    fullPage: true,
  });

  return (
    <Container>
      <AIChatFull />
    </Container>
  )
};

export default ChatPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
`
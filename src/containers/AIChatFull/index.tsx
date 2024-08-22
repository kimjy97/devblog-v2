import ChatContents from '@/containers/AIChatFull/Contents';
import ChatMenu from '@/containers/AIChatFull/ChatMenu/ChatMenu';
import { Pretendard } from '@public/fonts';
import styled from 'styled-components';
import ChatNameTooltip from '@/containers/AIChatFull/ChatMenu/ChatNameTooltip';
import Overlay from '@/containers/AIChatFull/ChatMenu/Overlay';

const AIChatFull = (): JSX.Element => {
  return (
    <Container className={Pretendard.className}>
      <Overlay />
      <ChatMenu />
      <ChatContents />
      <ChatNameTooltip />
    </Container>
  )
};

export default AIChatFull;

const Container = styled.div`
  display: flex;
  flex: 1;
`

import styled from 'styled-components';
import { useResponseChat } from '@/hooks/useChat';
import { useEffect, useRef, useState } from 'react';
import InputPrompt from '@/containers/AIChatFull/InputPrompt';
import { useScrollIsMax } from '@/hooks/useScroll';
import { useRecoilValue } from 'recoil';
import { chatArrState, currentChatIdState } from '@/atoms/chatAI';
import Messages from '@/containers/AIChatFull/Contents/Messages';
import { contentsWidth } from '@/constants/chat';
import { chatInputState } from '@/atoms/chat';
import FirstChat from '@/containers/AIChatFull/Contents/FirstChat';
import { IChatArray } from '@/types/chat';

const ChatContents = (): JSX.Element => {
  const messageListRef = useRef<any>(null);
  const wrapperRef = useRef<any>(null);
  const chatArr = useRecoilValue(chatArrState);
  const currentChatId = useRecoilValue(currentChatIdState);
  const chatInput = useRecoilValue(chatInputState);
  const [messageHeight, setMessgaeHeight] = useState<number>(0);
  const scroll = useScrollIsMax(wrapperRef.current);
  const arr: any[] | undefined = chatArr.find((i: IChatArray) => i.chatId === currentChatId)?.chatContents;
  const isExistArr = !!(arr && arr.length > 0);
  useResponseChat();

  useEffect(() => {
    if (isExistArr && (scroll.isMax || scroll.gap < 12)) {
      setMessgaeHeight(messageListRef.current.offsetHeight);
      messageListRef.current.scrollIntoView({ block: "end" });
    }
  }, [chatArr]);

  useEffect(() => {
    if (isExistArr && arr.length > 0) {
      messageListRef.current.scrollIntoView({ block: "end" });
    } else {
      messageListRef.current.scrollIntoView({ block: "start" });
    }
  }, [messageHeight, currentChatId]);

  useEffect(() => {
    if (isExistArr && scroll.isMax) {
      messageListRef.current.scrollIntoView({ block: "end" });
    }
  }, [chatInput])

  return (
    <Container>
      <Wrapper ref={wrapperRef}>
        <MessageList className={(arr && arr.length > 0) ? 'exist' : 'empty'} ref={messageListRef}>
          <FirstChat />
          <Messages />
        </MessageList>
      </Wrapper>
      <InputPrompt />
    </Container>
  )
};

export default ChatContents;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  top: calc(var(--header-height) + 1rem);
  height: calc(100svh - var(--header-height) - 1rem);

  overflow: hidden;

  @media (max-width: 768px) {
    top: 0;
    height: 100svh;
  }
`
const Wrapper = styled.div`
  flex: 1;

  overflow: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 20px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 6px solid transparent;
    box-shadow: inset 8px 8px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 8px 8px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-body);
  }

  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 0px;
  width: calc(100% - 2rem);
  min-height: 100%;
  max-width: calc(${contentsWidth} - 8.75rem);
  min-width: 760px;
  padding-top: 40px;
  padding-bottom: 24px;

  overflow-x: auto;
  overflow-y: hidden;

  &.exist {
    justify-content: initial;
  }

  &.empty {
    justify-content: center;
  }

  @media (max-width: 1280px) {
    max-width: 100%;
    min-width: auto;
    padding-top: 1.25rem;
    padding-bottom: 0px;
  }

  @media (max-width: 768px) {
      width: calc(100% - 1em);
      padding-top: calc(var(--header-height) + 1rem);
  }
`



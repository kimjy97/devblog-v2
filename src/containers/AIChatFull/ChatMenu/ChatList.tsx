import styled from 'styled-components';
import IconChatEmpty from '@public/svgs/chat4.svg';
import IconChatFill from '@public/svgs/chat3.svg';
import IconKebab from '@public/svgs/kebab.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chatArrState, currentChatIdState } from '@/atoms/chatAI';
import { IChatArray } from '@/types/chat';
import { useEffect, useMemo, useRef, useState } from 'react';
import KebabMenu from '@/containers/AIChatFull/ChatMenu/KebabMenu';
import { isAIChatMenuToggleState } from '@/atoms/sidebar';
import { chatNameTooltipInfoState } from '@/atoms/chat';

const ChatList = (): JSX.Element => {
  const chatListItemRef = useRef<any>([]);
  const KebabMenuRef = useRef<any>(null);
  const chatArr = useRecoilValue(chatArrState);
  const [currentChatId, setCurrentChatId] = useRecoilState(currentChatIdState);
  const [, setIsAIChatMenuToggle] = useRecoilState(isAIChatMenuToggleState);
  const [chatNameTooltipInfo, setChatNameTooltipInfo] = useRecoilState(chatNameTooltipInfoState);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [currentKebabId, setCurrentKebabId] = useState<number | undefined>(undefined);
  const olderDate = 1000 * 60 * 60 * 24 * 7; // 7일 기준 : 1000 * 60 * 60 * 24 * 7
  const latestChatArr = useMemo(() => [...chatArr].filter((i: IChatArray) => new Date().getTime() - new Date(i.chatDate).getTime() <= olderDate), [chatArr]);
  const olderChatArr = useMemo(() => [...chatArr].filter((i: IChatArray) => new Date().getTime() - new Date(i.chatDate).getTime() > olderDate), [chatArr]);
  const chatCompleteArr = olderChatArr.sort((a: IChatArray, b: IChatArray) => new Date(a.chatDate).getTime() - new Date(b.chatDate).getTime()).reverse();

  const handleClickKebab = (e: any, id: number) => {
    e.stopPropagation();
    setCurrentKebabId(undefined);
    setCurrentKebabId(id);
  }

  const handleClickChatListItem = (chatId: number) => {
    setCurrentChatId(chatId);
    setIsAIChatMenuToggle(false);
  }

  const handleClickOutside = (e: any) => {
    if (KebabMenuRef.current && !KebabMenuRef.current.contains(e.target)) {
      setCurrentKebabId(undefined);
    }
  };

  const handleCloseKebabMenu = () => {
    setCurrentKebabId(undefined);
  }

  const handleItemMouseOver = (e: any, name: string) => {
    const target = e.currentTarget;
    let element = e.target;
    let foundKebab = false;

    while (element) {
      if (element.id === 'kebab') {
        setChatNameTooltipInfo(undefined);
        foundKebab = true;
        break;
      }
      element = element.parentElement;
    }

    if (!foundKebab && target !== chatNameTooltipInfo?.target) {
      setChatNameTooltipInfo({ chatName: name, target })
    }
  }

  const handleItemMouseOut = () => {
    setChatNameTooltipInfo(undefined);
  }

  useEffect(() => {
    if (chatArr.length > 0 && isFirst) {
      const chatId = latestChatArr.length > 0 ?
        latestChatArr
          .sort((a: IChatArray, b: IChatArray) =>
            new Date(a.chatDate).getTime() - new Date(b.chatDate).getTime())
          .reverse()[0].chatId :
        olderChatArr
          .sort((a: IChatArray, b: IChatArray) =>
            new Date(a.chatDate).getTime() - new Date(b.chatDate).getTime())
          .reverse()[0].chatId;
      setCurrentChatId(chatId);
      setIsFirst(false);
    }
  }, [chatArr])

  useEffect(() => {
    if (currentKebabId !== undefined) {
      KebabMenuRef.current.style.top = `${chatListItemRef.current[currentKebabId].getBoundingClientRect().top}px`;
    }
  }, [currentKebabId])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Wrapper>
        {latestChatArr.length > 0 ? <DateLabel className='label'>최근</DateLabel> : null}
        {latestChatArr.sort((a: IChatArray, b: IChatArray) => new Date(a.chatDate).getTime() - new Date(b.chatDate).getTime()).reverse().map((i: IChatArray) =>
          <ChatListItem
            ref={(element) => {
              chatListItemRef.current[i.chatId] = element;
            }}
            key={i.chatId}
            className={`${i.chatId === currentChatId ? 'active' : ''} ${i.chatName.length > 20 ? 'longName' : ''} ${currentKebabId === i.chatId ? 'kebabOn' : ''}`}
            onClick={() => handleClickChatListItem(i.chatId)}
            onMouseOver={(e) => handleItemMouseOver(e, i.chatName)}
            onMouseLeave={handleItemMouseOut}
          >
            {i.chatContents.length > 0
              ?
              <ChatFillIcon className='fill' />
              :
              <ChatEmptyIcon className='empty' />
            }
            <ChatName className='chatName'>
              <p>
                {i.chatName}
              </p>
            </ChatName>
            <KebabButton
              className={currentKebabId === i.chatId ? 'active' : ''}
              id='kebab'
              onClick={(event) => handleClickKebab(event, i.chatId)}
            >
              <KebabIcon />
            </KebabButton>
          </ChatListItem>
        )}
        {olderChatArr.length > 0 ? <DateLabel className='label'>1주일 이상</DateLabel> : null}
        {chatCompleteArr.map((i: IChatArray) =>
          <ChatListItem
            ref={(element) => {
              chatListItemRef.current[i.chatId] = element;
            }}
            key={i.chatId}
            className={`${i.chatId === currentChatId ? 'active' : ''} ${i.chatName.length > 20 ? 'longName' : ''} ${currentKebabId === i.chatId ? 'kebabOn' : ''}`}
            onClick={() => handleClickChatListItem(i.chatId)}
            onMouseOver={(e) => handleItemMouseOver(e, i.chatName)}
            onMouseLeave={handleItemMouseOut}
          >
            {i.chatContents.length > 0
              ?
              <ChatFillIcon className='fill' />
              :
              <ChatEmptyIcon className='empty' />
            }
            <ChatName className='chatName'>
              <p>{i.chatName}</p>
            </ChatName>
            <KebabButton
              className={currentKebabId === i.chatId ? 'active' : ''}
              id='kebab'
              onClick={(event) => handleClickKebab(event, i.chatId)}
            >
              <KebabIcon />
            </KebabButton>
          </ChatListItem>
        )}
        <KebabMenu
          ref={KebabMenuRef}
          cid={currentKebabId}
          handleClose={handleCloseKebabMenu}
        />
      </Wrapper>
    </Container>
  )
};
export default ChatList;


const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 8px;

  overflow: auto;

  &::-webkit-scrollbar {
    width: 14px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 6px 6px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 6px 6px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-chat-menu);
  }
`
const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;

  .label:first-child {
    padding-top: 4px;
  }
`
const ChatListItem = styled.li`
  position: relative;
  display: flex;
  gap: 0.875rem;
  align-items: center;
  width: 100%;
  padding: 0.875rem 0.875rem;

  border-radius: 12px;
  opacity: 0;
  margin-bottom: 0px;

  color: var(--text-normal);
  font-size: 0.875rem;
  
  user-select: none;
  overflow: hidden;
  cursor: pointer;
  animation: fadeIn2 200ms ease-out forwards;

  &.active {
    background-color: var(--bg-chat-listitem-active) !important;

    &>svg.fill {
      fill: var(--text-normal);
      opacity: 0.5;
    }

    &>svg.empty {
      stroke: var(--text-normal);
      opacity: 0.5;
    }
  }

  &.kebabOn {
    background-color: var(--bg-chat-listitem-hover);
  }

  &:hover {
    #kebab {
      opacity: 1;
    }
    .chatName {
      mask-image: linear-gradient(90deg, #fff 76%, #fff0 92%);
    }
  }

  &:not(.active):hover {
    background-color: var(--bg-chat-listitem-hover);
  }

  &:has(#kebab.active) {
    .chatName {
      mask-image: linear-gradient(90deg, #fff 76%, #fff0 92%);
    }
  }

  @keyframes fadeIn2 {
    0% {
      opacity: 0;
      margin-bottom: -3.25rem;
    }
    60% {
      margin-bottom: 0px;
      opacity: 0;
    }
    60% {
      margin-bottom: 0px;
    }
    100% {
      opacity: 1;
      margin-bottom: 0px;
    }
  }
`
const ChatEmptyIcon = styled(IconChatEmpty)`
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 2px;

  stroke: var(--text-sub);
  stroke-width: 5;
  opacity: 0.4;
`
const ChatFillIcon = styled(IconChatFill)`
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 2px;

  fill: var(--text-sub);
  opacity: 0.4;
`
const KebabButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 4px;
  width: 33px;
  height: calc(100%);
    
  background-color: #fff0;
  border-radius: 100%;
  opacity: 0;

  &.active {
    opacity: 1;
    svg {
      opacity: 1;
    }
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }

  @media (max-width: 1280px) {
    opacity: 1;
  }
`
const ChatName = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;

  mask-image: linear-gradient(90deg, #fff 80%, #fff0 98%);
  overflow: hidden;
  font-size: 0.875rem;

  p {
    white-space: nowrap;
  }

  @media (max-width: 1280px) {
    mask-image: linear-gradient(90deg, #fff 76%, #fff0 92%);
  }
`
const KebabIcon = styled(IconKebab)`
  width: 0.875rem;
  height: 0.875rem;

  opacity: 0.4;
  stroke: var(--text-normal);
  fill: var(--text-normal);

  transition: 150ms;
`
const DateLabel = styled.div`
  padding-left: 16px;
  padding-top: 1.5rem;
  padding-bottom: 0.125rem;
  background-color: var(--bg-chat-menu);
  
  color: var(--text-sub-light);
  font-size: 0.9375rem;
`


import styled from 'styled-components';
import ChatList from '@/containers/AIChatFull/ChatMenu/ChatList';
import ChatLabel from '@/containers/AIChatFull/ChatMenu/ChatLabel';
import TokenProgress from '@/containers/AIChatFull/ChatMenu/TokenProgress';
import IconClose from '@public/svgs/delete.svg';
import { chatMenuWidth } from '@/constants/chat';
import { useRecoilState } from 'recoil';
import { isAIChatMenuToggleState } from '@/atoms/sidebar';
import { INDEX_SIDEBAR_MOBILE } from '@/constants/zIndex';

const ChatMenu = (): JSX.Element => {
  const [isAIChatMenuToggle, setIsAIChatMenuToggle] = useRecoilState(isAIChatMenuToggleState);
  const className = `${isAIChatMenuToggle ? 'active' : ''}`;

  const handleClickClose = () => {
    setIsAIChatMenuToggle(false);
  }

  return (
    <Container className={className} id='chatMenu'>
      <ChatLabel />
      <ChatList />
      <TokenProgress />
      <CloseBtn onClick={handleClickClose}>
        <CloseIcon />
      </CloseBtn>
    </Container>
  )
};

export default ChatMenu;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  width: ${chatMenuWidth};
  height: 100vh;
  padding-top: 100px;

  background-color: var(--bg-chat-menu);

  transition: 150ms;
  z-index: 1;

  &:has(#kebabMenu.visible) {
    pointer-events: none;
  }
  
  @media (max-width: 1280px) {
    width: 460px;
    position: absolute;
    padding-top: 68px;

    transform: translateX(-100%);
    z-index: ${INDEX_SIDEBAR_MOBILE};
    
    &.active {
      box-shadow: 0 0 30px #0000000d;
      opacity: 1 !important;

      transform: translateX(0%) !important;
    }
  }

  @media (max-width: 768px) {
    width: 85%;
  }
`
const CloseBtn = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 12px;
  left: 12px;
  width: 42px;
  height: 42px;

  cursor: pointer;

  &::before {
    content: '';
      position: absolute;
      width: 100%;
      height: 100%;

      background-color: #fff;
      opacity: 0;
      border-radius: 100%;
      transition: 50ms;

      z-index: -1;
  }
    
  &:hover {
    &::before {
      opacity: 0.1;
    }
    
    &>svg {
      opacity: 1;
    }
  }

  @media (max-width: 1280px) {
    display: flex;
  }
`
const CloseIcon = styled(IconClose)`
  width: 20px;
  height: 20px;

  opacity: 0.6;
  stroke: var(--text-normal);
  stroke-width: 3.5;

  transition: 50ms;
`
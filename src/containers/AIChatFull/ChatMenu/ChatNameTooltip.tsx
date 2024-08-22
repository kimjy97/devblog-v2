import { chatNameTooltipInfoState } from '@/atoms/chat';
import { INDEX_SIDEBAR_MOBILE } from '@/constants/zIndex';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const ChatNameTooltip = (): JSX.Element | null => {
  const ref = useRef<any>(undefined);
  const chatNameTooltipInfo = useRecoilValue(chatNameTooltipInfoState);
  const [info, setInfo] = useState<any>(undefined);
  const className = chatNameTooltipInfo ? 'visible' : '';

  const getPosition = () => {
    const pos = info.target?.getBoundingClientRect();
    const top = `${pos.top + (pos.height / 2)}px`;
    let left = `${pos.right + 16}px`;

    if (ref.current) {
      const siblingElements = ref.current.parentElement.children;
      for (const element of siblingElements) {
        if (element.id === 'chatMenu') {
          const { width } = element.getBoundingClientRect();
          left = `${width + 8}px`;
          break;
        }
      }
    }

    return { pos, top, left }
  }

  useEffect(() => {
    if (chatNameTooltipInfo) {
      setInfo(chatNameTooltipInfo);
    }
  }, [chatNameTooltipInfo])

  return info ? (
    <Container
      ref={ref}
      className={className}
      top={getPosition().top}
      left={getPosition().left}
    >
      <p>{info?.chatName ?? ''}</p>
    </Container>
  ) : null
};

export default ChatNameTooltip;

const Container = styled.div<{ top: string, left: string }>`
  position: absolute;
  max-width: 12.5rem;
  padding: 0.375rem 0.5rem;
  top: ${({ top }) => top};
  left: ${({ left }) => left};

  border-radius: 0.375rem;
  background-color: var(--bg-modal);

  pointer-events: none;
  transform: translateY(-50%);
  opacity: 0;
  transition: 250ms;

  z-index: 10000;

  &>p {
    color: var(--text-normal);
    font-size: 0.8125rem;
    line-height: 1.125rem;
    word-break: break-all;
  }

  &.visible {
    animation: fadeInAni 250ms 350ms forwards;
  }

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOutAni {
    100% {
      opacity: 0;
    }
  }

  @media (max-width: 1280px) {
    z-index: ${INDEX_SIDEBAR_MOBILE};
  }

  @media (max-width: 768px) {
    display: none;
  }
`
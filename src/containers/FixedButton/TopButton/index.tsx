'use client'

import styled from 'styled-components';
import IconArrowDown from '@public/svgs/arrow_down.svg'
import { useEffect, useState } from 'react';

const TopButton = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleClickTopBtn = () => {
    window.scrollTo(0, 0);
  }

  const handleScroll = () => {
    setIsVisible(window.scrollY > 300);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener('scroll', handleScroll);
    }, 0);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <Container
      className={isVisible ? 'visible' : ''}
      onClick={handleClickTopBtn}
    >
      <Wrapper>
        <Button>
          <ArrowDownIcon
            width={16}
            height={16}
            stroke='#414454'
          />
        </Button>
      </Wrapper>
    </Container>
  )
};
export default TopButton;


const Container = styled.div`
  display: flex;
  transform: scale(0);

  opacity: 0;
  
  user-select: none;
  pointer-events: none;
  cursor: pointer;
  transition: transform 600ms cubic-bezier(0.23, 1, 0.320, 1), opacity 350ms;

  &.visible {
    transform: scale(1);
    opacity: 1;
    pointer-events: initial;
    transition: transform 300ms cubic-bezier(0.23, 1, 0.320, 1), opacity 350ms;
  }

  @media (max-width: 768px) {
    right: 6px;
  }
`
const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  aspect-ratio: 1/1;

  border-radius: 100%;
  background-color: var(--bg-darkmode);
  box-shadow: 0 0 12px rgba(0,0,0,0.10);
  overflow: hidden;

  transition: box-shadow 150ms ease-out, background-color 150ms ease-out;

  &:hover {
    background-color: var(--bg-darkmode-hover);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    & svg {
       transform: rotate(180deg) scale(1.1);
    }
  }
`
const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  aspect-ratio: 1/1;
`
const ArrowDownIcon = styled(IconArrowDown)`
  padding-top: 1px;

  filter: var(--filter-invert);
  transform: rotate(180deg);
  transition: transform 300ms;
`


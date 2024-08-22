'use client'

import styled from 'styled-components';
import IconClose from '@public/svgs/delete.svg';
import ProfileBackground from '@containers/Sidebar/ProfileBackground';
import Tools from '@/containers/Sidebar/Tools';
import BoardList from '@containers/Sidebar/BoardList';
import Profile from '@containers/Sidebar/Profile';
import { INDEX_SIDEBAR_MOBILE, INDEX_SIDEBAR_PC } from '@constants/zIndex';
import { useRecoilState } from 'recoil';
import { isSidebarState, sidebarToggleState } from '@atoms/sidebar';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

const Sidebar = (): JSX.Element => {
  const [sidebarToggle, setSidebarToggle] = useRecoilState(sidebarToggleState);
  const [isSidebar, setIsSidebar] = useRecoilState(isSidebarState);
  const pathname = usePathname();
  const searchQuery = useSearchParams();
  const className = `${isSidebar ? 'visible' : ''} ${sidebarToggle ? 'active' : ''}`;

  const handleClickClose = () => {
    setSidebarToggle(false);
  }

  useLayoutEffect(() => {
    const isHome: boolean = pathname.split('/')[1] === '';
    if (!isHome) {
      setIsSidebar(false);
    }
  }, [pathname]);

  useEffect(() => {
    setSidebarToggle(false);
  }, [searchQuery])

  return (
    <Container className={className}>
      <Wrapper>
        <ProfileBackground />
        <StickyWrapper>
          <Profile />
          <MenuContainer>
            <Tools />
            <BoardList />
          </MenuContainer>
        </StickyWrapper>
      </Wrapper>
      <CloseBtn onClick={handleClickClose}>
        <CloseIcon />
      </CloseBtn>
    </Container >
  )
};

export default Sidebar;

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  max-width: 300px;
  min-height: 100%;
  padding: 16px;
  padding-top: var(--sidebar-top);

  opacity: 0;

  box-sizing: content-box;
  filter: var(--bg-sidebar-shadow);
  transform: translateX(-100%);

  z-index: ${INDEX_SIDEBAR_PC};
  will-change: transform;
  transition: transform 150ms cubic-bezier(0.165, 0.84, 0.44, 1),
              width 150ms,
              opacity 200ms ease-out;

  &.visible {
    position: static;
    opacity: 1;
    transform: translateX(0%);
  }

  @media (max-width: 1280px) {
    position: fixed !important;
    max-width: 340px !important;
    height: 90vh;
    top: 0;
    padding: 0px;
    padding-top: 0px;

    opacity: 0 !important;
    transform: translateX(-100%) !important;
    z-index: ${INDEX_SIDEBAR_MOBILE};

    &.active {
      opacity: 1 !important;

      transform: translateX(0%) !important;
    }
  }
`
const Wrapper = styled.div`
  height: 100%;
  border-radius: 16px;

  @media (max-width: 1280px) {
    overflow: auto;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`
const MenuContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;

  background-color: var(--bg-sidebar);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  overflow: hidden;

  transition: background-color 150ms;
`
const StickyWrapper = styled.div`
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 136px);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`
const CloseBtn = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 16px;
  left: 16px;
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


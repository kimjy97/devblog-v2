import styled from 'styled-components';
import Image from 'next/image';
import searchIcon from '@public/images/search_icon.png';
import memoIcon from '@public/images/memo_icon.png';
import shareIcon from '@public/images/share_icon.png';
import refreshIcon from '@public/images/refresh_icon.png';
import { useState } from 'react';
import SearchTool from '@/containers/Sidebar/Tools/SearchTool';
import AutoComplete from '@/containers/Sidebar/Tools/AutoComplete';
import MemoTool from '@/containers/Sidebar/Tools/MemoTool';
import ShareTool from '@/containers/Sidebar/Tools/ShareTool';

const Tools = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleClickTool = (tool: string) => {
    if (isOpen === tool) {
      setIsOpen('');
      return;
    }
    setIsOpen(tool);
  }

  return (
    <Container className={isOpen}>
      <ToolsWrapper>
        <ToolButton
          className={isOpen === 'search' ? 'active' : ''}
          onClick={() => handleClickTool('search')}
        >
          <Image src={searchIcon} alt='search' />
        </ToolButton>
        <ToolButton
          className={isOpen === 'memo' ? 'active' : ''}
          onClick={() => handleClickTool('memo')}
        >
          <Image id='memo' src={memoIcon} alt='memo' />
        </ToolButton>
        <ToolButton
          className={isOpen === 'share' ? 'active' : ''}
          onClick={() => handleClickTool('share')}
        >
          <Image src={shareIcon} alt='share' />
        </ToolButton>
        <ToolButton
          className={isOpen === 'refresh' ? 'active' : ''}
          onClick={() => window.location.reload()}
        >
          <Image src={refreshIcon} alt='refresh' />
        </ToolButton>
      </ToolsWrapper>
      <ToolContainer className={isOpen ? `active ${isOpen}` : ''}>
        <SearchTool autoComplete={suggestions} setAutoComplete={setSuggestions} />
        <MemoTool />
        <ShareTool />
        <AutoComplete list={suggestions} setList={setSuggestions} />
      </ToolContainer>
    </Container>
  )
};

export default Tools;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 16px);
  height: 3.75rem;

  background: var(--bg-sidebar-tools);
  border-radius: 12px;

  transition: background 150ms, height 150ms cubic-bezier(0.23, 1, 0.320, 1), opacity 150ms;

  &.search {
    height: 7.625rem;
  }
  &.memo {
    height: 16.25rem;
  }
  &.share {
    height: 9.125rem;
  }
`
const ToolsWrapper = styled.ul`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 6px;
  padding: 6px;
`
const ToolButton = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 48px;
  border-radius: 10px;

  cursor: pointer;
  user-select: none;
  transition: transform 150ms, background-color 200ms;

  &>img {
    width: auto;
    height: 18px;

    filter: var(--img-sidebar-icon-filter);
    transition: filter 200ms;

    &#memo {
      height: 20px;
    }
  }

  &:hover, &.active {
    transform: scale(1.15);
    &>img {
      filter: var(--img-sidebar-icon-filter-hover);
    }
  }

  &.active {
    transform: scale(1);
    background-color: var(--bg-sidebar-tool-active);
  }
`
const ToolContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex: 1;
  min-height: 0;

  border-radius: 0 0 12px 12px;
  transition: 50ms;
  opacity: 0;

  .tool {
    opacity: 0;
    pointer-events: none;
  }

  &.active {
    opacity: 1;

    &.search #searchTool{
      opacity: 1;
      pointer-events: all;
    }
    &.memo #memoTool {
      opacity: 1;
      pointer-events: all;
    }
    &.share #shareTool {
      opacity: 1;
      pointer-events: all;
    }
  }

  
`
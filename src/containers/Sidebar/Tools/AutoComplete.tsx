import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { searchPostState } from '@/atoms/sidebar';
import { useRouter } from 'next/navigation';

interface IProps {
  list: string[];
  setList: React.Dispatch<React.SetStateAction<string[]>>;
}

const AutoComplete = ({ list, setList }: IProps): JSX.Element => {
  const router = useRouter();
  const ref = useRef<HTMLUListElement>(null);
  const searchInput = useRecoilValue(searchPostState);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const lastKeyPressTime = useRef<number>(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (list.length === 0) return;

    const now = Date.now();
    if (now - lastKeyPressTime.current < 50) {
      return; // Ignore keypresses that are too close together
    }
    lastKeyPressTime.current = now;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < list.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : list.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex !== -1) {
          router.push(`/?search=${list[selectedIndex]}`);
        }
        setList([]);
        break;
      default:
        break;
    }
  }, [list, selectedIndex, router]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchInput]);

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Highlight key={index}>{part}</Highlight>
      ) : (
        part
      )
    );
  };

  return (
    <SuggestionsList className={list.length > 0 ? 'active' : ''} ref={ref}>
      {list.map((suggestion: string, index: number) => (
        <SuggestionItem
          key={index}
          className={index === selectedIndex ? 'selected' : ''}
        >
          <Link href={{ pathname: '/', query: { search: suggestion } }}>
            {highlightText(suggestion, searchInput)}
          </Link>
        </SuggestionItem>
      ))}
    </SuggestionsList>
  );
};

export default AutoComplete;

const SuggestionsList = styled.ul`
  list-style-type: none;
  position: absolute;
  width: calc(100% - 1rem);
  top: 3.625rem;
  min-height: 6.25rem;
  padding: 0.5rem;

  background-color: var(--bg-search-autocomplete);
  border: 1px solid var(--bg-search-autocomplete-border);
  backdrop-filter: blur(20px);
  box-shadow: var(--bg-search-autocomplete-boxshadow);
  border-radius: 12px;
  transform: translateY(10px);
  opacity: 0;

  color: var(--text-normal);

  will-change: transform;
  z-index: 1000;
  transition: 350ms cubic-bezier(0.165, 0.84, 0.44, 1);
  pointer-events: none;
  
  &.active {
    transform: translateY(0px);
    opacity: 1;
    pointer-events: all;
    transition: 120ms ease-out;
  }
`;

const SuggestionItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.125rem 0.625rem;
  padding-top: 0.25rem;

  border-radius: 0.375rem;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;

  color: var(--text-normal);
  font-size: 0.875rem;
  line-height: 1.875rem;

  cursor: pointer;

  &:hover, &.selected {
    background-color: var(--bg-search-autocomplete-hover);
  }
`;

const Highlight = styled.span`
  font-weight: 700;
  color: var(--text-search-highlight);
`;
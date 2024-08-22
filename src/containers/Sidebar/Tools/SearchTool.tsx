import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import IconSearch from '@svgs/search.svg';
import Link from 'next/link';
import { apiGet } from '@/services/api';
import { useRecoilState } from 'recoil';
import { searchPostState } from '@/atoms/sidebar';
import { useRouter } from 'next/navigation';

// useDebounce 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface IProps {
  autoComplete: any;
  setAutoComplete: any;
}

const SearchTool = ({ autoComplete, setAutoComplete }: IProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useRecoilState(searchPostState);
  const debouncedSearchTerm = useDebounce(searchInput, 50);
  const router = useRouter();

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }

  const handleKeyDownSearch = (e: any) => {
    if (e.key === 'Enter') {
      router.push(`/?search=${searchInput}`);
    }
  }

  const getSuggestions = async () => {
    if (debouncedSearchTerm) {
      await apiGet(`/api/blog/postList/autoComplete?q=${debouncedSearchTerm}`)
        .then(res => res.titles.length > 0 && setAutoComplete(res.titles))
        .catch(() => {
          // console.error('Error fetching suggestions:', error)
        })
    } else {
      setAutoComplete([]);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;

    const handleFocus = () => {
      if (container) {
        container.style.borderColor = 'var(--bg-comment-input-border)';
      }
    };

    const handleBlur = () => {
      if (container) {
        container.style.borderColor = 'transparent';
      }
    };

    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <Container className='tool' id='searchTool'>
      <SearchInputWrapper ref={containerRef}>
        <SearchInput
          value={searchInput}
          ref={inputRef}
          placeholder='검색'
          onChange={handleChangeSearch}
          onKeyDown={handleKeyDownSearch}
          onFocus={getSuggestions}
          onBlur={() => autoComplete.length !== 0 && setAutoComplete([])}
          maxLength={50}
        />
        <SearchBtn href={{ pathname: '/', query: { search: searchInput } }}>
          <SearchIcon />
        </SearchBtn>
      </SearchInputWrapper>
    </Container>
  )
};

export default SearchTool;

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  overflow: hidden;
`
const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: calc(100% - 1rem);
  height: 2.6875rem;
  padding-left: 1rem;
  padding-right: 0.375rem;
  
  border-radius: 10px;
  background-color: var(--bg-search-input);
  border: 1px solid transparent;

  transition: 150ms;
`
const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;

  color: var(--text-normal);

  &::placeholder {
    color: var(--text-sub-light);
  }

  &:focus {
    &::placeholder {
      color: transparent;
    }

    &+div>svg {
      fill: var(--text-normal);
      opacity: 0.6;
    }
  }
`
const SearchBtn = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.125rem;
  height: 100%;

  background-color: #fff0;

  &:hover {
    background-color: #fff0;

    svg {
      fill: var(--text-normal);
      opacity: 1 !important;
    }
  }
`
const SearchIcon = styled(IconSearch)`
  position: relative;
  width: 1rem;
  height: 1rem;

  fill: var(--text-sub-dark);
  opacity: 0.8;

  transition: 150ms;
`

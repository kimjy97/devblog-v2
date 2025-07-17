import Link from 'next/link';
import IconSharp from '@public/svgs/sharp.svg';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface TagListProps {
  tags?: any[];
  posts?: any[];
}

const TagList = ({ tags, posts }: TagListProps): JSX.Element => {
  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());

  return (
    <Container>
      <Label>
        <SharpIcon />
        <p>태그</p>
      </Label>
      <Wrapper>
        <TagItem
          className={currentQuery.tag === 'all' || !currentQuery.tag ? 'active' : ''}
          href={{
            pathname: '/',
            query: {
              ...currentQuery,
              tag: 'all',
            }
          }}
          replace
        >
          <p>전체</p>
          <span>{posts?.length ?? 0}</span>
        </TagItem>
        {tags && tags.length > 0 && tags.slice(0, 20).sort((a, b) => b.count - a.count).map((i: any, idx: number) =>
          <TagItem
            key={idx}
            className={currentQuery.tag === i.name ? 'active' : ''}
            href={{
              pathname: '/',
              query: {
                ...currentQuery,
                tag: i.name,
              }
            }}
            replace
          >
            <p>{i.name}</p>
            <span>{i.count}</span>
          </TagItem>
        )}
      </Wrapper>
    </Container>
  )
};

export default TagList;

const Container = styled.div`
  align-self: flex-start;
  width: 224px;
  height: 100%;
  padding-top: 0.75rem;
  padding-left: 2.25rem;
  padding-bottom: 100px;
  
  border-left: 1px solid var(--bg-line);
  
  transition: 150ms;

  @media (max-width: 1280px) {
    width: 180px;
    padding-left: 1.5rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem;
`
const TagItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 0.75rem;
  min-width: 4rem;

  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--bg-tag);
 
  color: var(--text-normal);
  font-size: 0.875rem;
  font-weight: 500;

  cursor: pointer;
  user-select: none;
  will-change: transform;
  transition: 150ms;

  p {
    flex: 1;
    display: -webkit-box; /* -webkit-box 필수 */
    -webkit-box-orient: vertical; /* 필수 */
    overflow: hidden; /* 컨텐츠 영역만 보이게 (필수) */
    -webkit-line-clamp: 1; /* 보여질 줄 수 (필수) */
  }

  span {
    color: var(--text-tag);
  }

  &.active {
    background-color: var(--bg-tag-active);
  }
  &:not(.active):hover {
    background-color: var(--bg-tag-hover);
    transform: scale(1.05);
  }
`
const Label = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  color: var(--text-normal);
  font-size: 1.125rem;
  font-weight: 700;

  transition: 150ms;
`
const SharpIcon = styled(IconSharp)`
  width: 1.125rem;
  height: 1.125rem;

  fill: var(--text-sub-dark);

  transition: 150ms;
`
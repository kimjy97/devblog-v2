import { postsByBoardState } from '@/atoms/post';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const MobileTagList = (): JSX.Element => {
  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());
  const data = useRecoilValue<any>(postsByBoardState);
  const [tagList, setTagList] = useState<any[] | undefined>(undefined);

  const getData = () => {
    if (data) {
      setTagList(data.tags);
    }
  }

  useEffect(() => {
    if (data) {
      getData();
    }
  }, [data]);

  return (
    <Container>
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
          <span>{data && data.posts.length}</span>
        </TagItem>
        {tagList && tagList.length > 0 && tagList.slice(0, 20).sort((a, b) => b.count - a.count).map((i: any, idx: number) =>
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

export default MobileTagList;

const Container = styled.div`
  display: none;
  align-self: flex-start;
  width: 100%;
  padding-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`
const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;

  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`
const TagItem = styled(Link)`
  flex-shrink: 0;
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
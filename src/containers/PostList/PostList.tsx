import styled from 'styled-components';
import { Pretendard } from '../../../public/fonts';
import { useEffect, useState } from 'react';
import { PostInfo } from '@type/post';
import Post from '@/components/Post';
import Selection from '@containers/Selection';
import { shimmer } from '@/styles/animation';
import { useSearchParams } from 'next/navigation';
import IconCaution from '@public/svgs/caution.svg';
import IconArrowRight from '@public/svgs/arrow_right.svg';
import IconTag from '@public/svgs/tag.svg';
import IconSearch from '@public/svgs/search.svg';
import { useRecoilValue } from 'recoil';
import { postsByBoardState } from '@/atoms/post';
import { IPost } from '@/models/Post';
import MobileTagList from '@/containers/PostList/MobileTagList';
import useAnimateOnStateChange from '@/hooks/useAnimatedOnStateChange';

interface PostListProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
}

const PostList = ({ data, isLoading, isError }: PostListProps): JSX.Element => {
  const searchParams = useSearchParams();
  const board = searchParams.get('board');
  const search = searchParams.get('search');
  const [tag, setTag] = useState(searchParams.get('tag'));
  const [filteredData, setFilteredData] = useState<PostInfo[] | undefined>(undefined);
  const [postType, setPostType] = useState<string>('최신순');
  const breadCrumbsRef = useAnimateOnStateChange(tag, 'fadeIn');

  const postTypeArr = ['최신순', '인기순', '댓글순'];

  const getBoardName = (bool?: boolean) => {
    let boardName = board;
    if (board === 'all') boardName = bool ? '전체글보기' : '';
    if (search) boardName = `'${search}' 검색결과`;
    return boardName;
  }

  const getFilteredData = async () => {
    if (!data || !data.posts) return setFilteredData([]);
    const arr = [...data.posts];
    // 태그 적용
    const filtered = arr.filter((i: IPost) =>
      tag && tag !== 'all' ? i.tags.includes(tag) : true)
      .reverse();
    // 정렬 적용
    switch (postType) {
      case '인기순':
        filtered.sort((a: PostInfo, b: PostInfo) => {
          const aScore = a.like + a.cmtnum;
          const bScore = b.like + b.cmtnum;
          if (aScore === 0) return 1;
          if (bScore === 0) return -1;
          return (bScore / b.view) - (aScore / a.view);
        });
        break;
      case '최신순':
        filtered.sort((a: IPost, b: IPost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '댓글순':
        filtered.sort((a: PostInfo, b: PostInfo) => b.cmtnum - a.cmtnum);
        break;
      default:
        break;
    }
    setFilteredData(filtered);
  }

  useEffect(() => {
    if (data) {
      getFilteredData();
    }
  }, [data, tag, postType]);

  useEffect(() => {
    setPostType('최신순');
  }, [board]);

  useEffect(() => {
    setTag(searchParams.get('tag'));
  }, [searchParams]);

  if (isLoading) {
    return (
      <PlaceholderPostListWrapper>
        {Array.from({ length: 12 }).map((i: any, idx: number) => (
          <PlaceholderPost key={idx}>
            <div /><div /><div /><div /><div /><div />
          </PlaceholderPost>
        ))}
      </PlaceholderPostListWrapper>
    );
  }
  if (isError) {
    return <NoList>게시글을 불러오는 중 오류가 발생했습니다.</NoList>;
  }
  return (
    <Container className={Pretendard.className}>
      <PostListContainer>
        <OptionWrapper>
          <BoardTitle>
            {search ? <SearchIcon /> : <TagIcon />}
            <p>{getBoardName(true)}</p>
            {tag && tag !== 'all' &&
              <BreadCrumbs ref={breadCrumbsRef}>
                <ArrowRightIcon />
                <p>{tag}</p>
              </BreadCrumbs>
            }
          </BoardTitle>
          {filteredData &&
            <PostNumText>
              {filteredData.length} posts
            </PostNumText>
          }
          <Line />
          <Selection
            value={postType}
            items={postTypeArr}
            onChange={(e: any) => setPostType(e.value)}
            border
            align='right'
          />
        </OptionWrapper>
        <MobileTagList tags={data?.tags} posts={data?.posts} />
        {filteredData ? filteredData.length > 0 ?
          <PostListWrapper>
            {filteredData.map((i: PostInfo, idx: number) =>
              <Post data={i} key={idx} />
            )}
          </PostListWrapper> :
          <NoList>
            <CautionIcon />
            <p>{search ? `'${search}'에 대한 검색 결과가 없습니다.` : '해당 게시판이 비어있습니다.'}</p>
          </NoList>
          :
          <PlaceholderPostListWrapper>
            {Array.from({ length: 12 }).map((i: any, idx: number) => (
              <PlaceholderPost key={idx}>
                <div /><div /><div /><div /><div /><div />
              </PlaceholderPost>
            ))}
          </PlaceholderPostListWrapper>
        }
      </PostListContainer>
    </Container>
  )
};

export default PostList;


const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`
const PostListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12.5rem;
  
  transition: background-color 150ms;
`
const PostListWrapper = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  column-gap: 1.25rem;
  row-gap: 1.5rem;

  opacity: 0;

  animation: fadeInAni 700ms forwards;

  @media (max-width: 1454px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    row-gap: 1.125rem;
    column-gap: 1rem;
    padding: 0 0.75rem;
  }

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }
`
const PlaceholderPostListWrapper = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  column-gap: 1.25rem;
  row-gap: 1.5rem;

  opacity: 0;

  animation: fadeInAni 200ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 1454px) {
    width: 100%;
  }

  @media (max-width: 767px) {
    row-gap: 1.125rem;
    column-gap: 1rem;
    padding: 0 0.75rem;
  }
`
const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding-bottom: 1.125rem;
  margin-bottom: 1.5rem;

  border-bottom: 1px solid var(--bg-line);

  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 600;

  transition: 150ms;

  &>svg {
    filter: var(--filter-invert-reverse);
  }

  @media (max-width: 768px) {
    width: calc(100% - 1.5rem);
    gap: 1rem;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
  }
`
const PlaceholderPost = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  min-height: 280px;
  max-height: 340px;
  width: 100%;
  aspect-ratio: 100/125;
  
  box-sizing: border-box;
  overflow: hidden;

  div:not(:nth-child(5)) {
    position: relative;
    overflow: hidden;

    background-color: var(--bg-pitem-board-placeholder);

    ${shimmer}
  }
  
  div:nth-child(1) {
    position: relative;
    width: 100%;
    max-height: 210px;
    aspect-ratio: 8/5;
    margin-bottom: 0.625rem;

    border-radius: 12px;
  }

  div:nth-child(2) {
    width: 30%;
    height: 0.875rem;
    margin-bottom: 10px;

    border-radius: 5px;
  }

  div:nth-child(3) {
    width: 90%;
    height: 1.25rem;
    margin-bottom: 0.375rem;

    border-radius: 0.5rem;
  }

  div:nth-child(4) {
    width: 40%;
    height: 1.25rem;

    border-radius: 0.5rem;
  }

  div:nth-child(5) {
    flex: 1;
  }

  div:nth-child(6) {
    width: 80%;
    height: 1.25rem;
    margin-bottom: 0.375rem;

    border-radius: 0.5rem;
  }
`
const NoList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  min-height: calc(100vh - 400px);

  &>p {
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-normal);
  }
`
const CautionIcon = styled(IconCaution)`
  width: 1.625rem;
  height: 1.625rem;
  fill: var(--color-blue);
`
const BoardTitle = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 0.5rem;
  min-width: 0;

  color: var(--text-normal);
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;

  transition: 150ms;

  &>p {
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 700;

    &>p {
      font-size: 1rem;
    }
  }
`

const BreadCrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0; // 추가: flex item이 필요 이상으로 커지는 것을 방지

  p {
    color: var(--text-sub);
    font-weight: 500;
    font-size: 1.125rem;
    white-space: nowrap; // 변경: wrap에서 nowrap으로 변경
    overflow: hidden; // 추가
    text-overflow: ellipsis; // 추가: 말줄임 표시

    transition: 150ms;
  }

  @media (max-width: 768px) {
    p {
      font-size: 0.875rem;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0px);
    } 
  }
`
const ArrowRightIcon = styled(IconArrowRight)`
  width: 0.75rem;
  height: 0.75rem;
  margin: 0 0.125rem 0 0.25rem;

  stroke: var(--text-sub-dark);
  stroke-width: 4px;

  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
    margin: 0 0rem 0 0.125rem;
  }
`
const TagIcon = styled(IconTag)`
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.25rem;

  fill: var(--text-sub);
  
  transition: 150ms;

  @media (max-width: 768px) {
    width: 0.75rem;
    height: 0.75rem;
    margin-top: 0.125rem;
  }
`
const SearchIcon = styled(IconSearch)`
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;

  fill: var(--text-sub);

  @media (max-width: 768px) {
    width: 0.875rem;
    height: 0.875rem;
  }
`
const Line = styled.div`
  width: 1px;
  height: 100%;

  background-color: var(--bg-line);

  transition: 150ms;
`
const PostNumText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-sub-dark);
  white-space: nowrap;

  transition: 150ms;

  @media (max-width: 768px) {
    display: none;
  }
`

import styled from 'styled-components';
import { Pretendard } from '../../../public/fonts';
import { useEffect, useState } from 'react';
import { PostInfo } from '@type/post';
import { apiPost } from '@services/api';
import Post from '@/components/Post';
import Selection from '@containers/Selection';
import IconArrowRight from '@public/svgs/arrow_right.svg'
import Link from 'next/link';
import PlaceholderPost from '@/containers/PostList/PlaceholderPost';

const PopularPostList = (): JSX.Element => {
  const [DATA, setDATA] = useState<PostInfo[]>([]);
  const [postType, setPostType] = useState<string>('최근 게시물');

  const postTypeArr = ['최근 게시물', '인기 게시물', '많이 찾아본 게시물', '도움이 된 게시물'];

  const getData = async () => {
    const data: PostInfo[] = await apiPost('/api/blog/postList', {}).then((res) => res.data.posts);
    const reversedData = data.reverse() ?? [];
    const sortedData = sortPosts(postType, reversedData);
    setDATA(sortedData);
  };

  const sortPosts = (type: string, posts: PostInfo[]): PostInfo[] => {
    const result = [...posts];
    switch (type) {
      case '최근 게시물':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case '인기 게시물':
        result.sort((a, b) => {
          const aScore = (a.like * 2) + a.cmtnum;
          const bScore = (b.like * 2) + b.cmtnum;
          if (aScore === 0) return 1;
          if (bScore === 0) return -1;
          return (bScore / b.view) - (aScore / a.view);
        });
        break;
      case '많이 찾아본 게시물':
        result.sort((a, b) => b.view - a.view);
        break;
      case '도움이 된 게시물':
        result.sort((a, b) => {
          if (a.like === 0) return 1;
          if (b.like === 0) return -1;
          return b.like - a.like;
        });
        break;
      default:
        break;
    }
    return result;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setDATA((prev) => sortPosts(postType, prev));
  }, [postType]);

  return (
    <Container className={Pretendard.className} id='fade_3'>
      <Title>
        <Selection
          value={postType}
          items={postTypeArr}
          onChange={(e: any) => setPostType(e.value)}
          border={false}
        />
        <More href={{ pathname: '/', query: { board: 'all' } }}>
          <p>더보기</p>
          <ArrowRightIcon />
        </More>
      </Title>
      {DATA.length > 0 ?
        <PostListWrapper>
          {DATA.slice(0, 6).map((i: PostInfo, idx: number) =>
            <Post data={i} key={idx} />
          )}
        </PostListWrapper>
        :
        <PlaceholderPost />
      }
    </Container>
  )
};
export default PopularPostList;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  transition: background-color 150ms;
`
const PostListWrapper = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  column-gap: 1.25rem;
  row-gap: 1.5rem;
  padding: 0 0.5rem;
  padding-bottom: 3rem;

  opacity: 0;

  animation: fadeInAni 700ms forwards;

  @keyframes fadeInAni {
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 1454px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    row-gap: 1.125rem;
    column-gap: 1rem;
    padding: 0;
    padding-bottom: 3rem;
  }
`
const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 0.75rem;
  padding-right: 0.5rem;

  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 600;

  &>svg {
    filter: var(--filter-invert-reverse);
  }
`
const More = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.625rem 0;

  color: var(--text-sub-light);
  font-size: 1rem;

  cursor: pointer;
  transition: 50ms;

  &:hover {
    color: var(--text-sub);
    svg {
      stroke: var(--text-sub);
    }
  }
`
const ArrowRightIcon = styled(IconArrowRight)`
  width: 0.625rem;
  height: 0.625rem;

  stroke: var(--text-sub-dark);
  stroke-width: 4px;
  
  transition: 50ms;
`
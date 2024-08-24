import { pageLoadingState } from '@/atoms/pageLoading';
import BlogInfo from '@/components/BlogInfo';
import ModuleLayout from '@/components/ModuleLayout';
import RecentLog from '@/components/RecentLog';
import { INDEX_MAIN } from '@/constants/zIndex';
import Banner from '@/containers/Banner';
import PopularPostList from '@/containers/PostList/PopularPostList';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

const MainBlog = (): JSX.Element => {
  const isPageLoading = useRecoilValue(pageLoadingState);
  const className = `${!isPageLoading ? 'visible' : ''}`

  return (
    <Container className={className}>
      {/* <AIChat /> */}
      <Banner />
      <ModuleLayout>
        <PopularPostList />
        <Flex>
          <RecentLog />
          <BlogInfo />
        </Flex>
      </ModuleLayout>
    </Container>
  )
};

export default MainBlog;

/** 모듈 나타나는 애니메이션 생성 (각 모듈마다 딜레이 적용) */
const generateDelayStyles = () => {
  const itemCount = 10;
  const delay = 150;
  let styles = '';

  for (let i = 1; i <= itemCount; i++) {
    styles += `
      & #fade_${i} {
        opacity: 0;
        transform: translateY(10px);

        animation: slideUpAni 600ms forwards;
        animation-delay: ${(delay * i)}ms;
      }
    `;
  }

  return css`${styles}`;
};

const Container = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
  padding: 0 1rem;  
  padding-top: var(--sidebar-top);
  padding-bottom: 200px;

  will-change: transform;
  transition: 150ms;
  z-index: ${INDEX_MAIN};

  &.visible {
    ${generateDelayStyles()}
  }

  @media (max-width: 1280px) {
    gap: 1rem;
  }

  @media (max-width: 1023px) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    gap: 3rem;
  }

  @keyframes slideUpAni {
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`
const Flex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

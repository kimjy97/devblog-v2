import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useRecoilValue } from 'recoil';
import { postInfoState } from '@/atoms/post';
import { apiDelete, apiGet, apiPost } from '@/services/api';

const PostFavorite = (): JSX.Element | null => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const postInfo = useRecoilValue(postInfoState);
  const { ref, isIntersecting } = useIntersectionObserver({
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  }, false);

  const handleClickFavorite = () => {
    if (isDisabled) return;

    if (postInfo) {
      setIsDisabled(true);
      if (isFavorite) {
        // 좋아요 취소
        setIsFavorite(false);
        apiDelete('/api/blog/post/favorite', { postId: postInfo.postId })
          .then(() => {
            setTimeout(() => setIsDisabled(false), 500);
          })
          .catch(() => {
            setIsFavorite(true);
          });
      } else {
        // 좋아요 추가
        setIsFavorite(true);
        apiPost('/api/blog/post/favorite', { postId: postInfo.postId })
          .then(() => {
            setTimeout(() => setIsDisabled(false), 500);
          })
          .catch(() => {
            setIsFavorite(false);
          });
      }
    }
  }

  useEffect(() => {
    if (postInfo) {
      apiGet(`/api/blog/post/favorite?postId=${postInfo.postId}`)
        .then(response => {
          setIsFavorite(response.favorited);
        })
        .catch();
    }
  }, [postInfo])

  return postInfo ? (
    <Container ref={ref}>
      <ButtonWrapper
        className={isIntersecting ? isFavorite ? 'active' : '' : 'unVisible'}
        onClick={handleClickFavorite}
        disabled={isDisabled}
      >
        <Light className={isIntersecting ? 'active' : ''} />
        <Icon>
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </Icon>
        <Note>
          {isFavorite ? '감사합니다 !' : '도움이 되셨다면 클릭해주세요 !'}
        </Note>
      </ButtonWrapper>
    </Container>
  ) : null
};

export default PostFavorite;

const scaleAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;
const opacityAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 10rem;
`;
const ButtonWrapper = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: left;
  width: 20.125rem;
  height: 4.5rem;
  padding-left: 2rem;

  background-color: var(--bg-favorite);
  border-radius: 48px;
  overflow: hidden;
  border: none;

  cursor: pointer;
  transition: 150ms;
  user-select: none;

  svg {
    width: 2.25rem;
    height: 2.25rem;
    margin-top: 0.25rem;

    fill: #46464b;

    transition: 150ms;

    &:nth-child(2) {
      position: absolute;
      opacity: 1;

      transition: 1000ms cubic-bezier(0.23, 1, 0.320, 1);
    }
  }

  &.unVisible {
    justify-content: center;
    width: 4.5rem;
    padding: 0;
    border-radius: 100%;
  }

  &.active {
    width: 12.875rem;
    box-shadow: var(--bg-favorite-shadow-active);

    svg {
      animation: ${scaleAnimation} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      fill: #fe3a3a;

      &:nth-child(2) {
        animation: ${opacityAnimation} 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }  
  }

  &:not(.active):hover {
    box-shadow: var(--bg-favorite-shadow);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 1;
  }
`;
const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4px;
`
const Note = styled.div`
  position: absolute;
  left: 86px;

  color: var(--text-normal);
  font-size: 1rem;
  white-space: nowrap;
`
const Light = styled.div`
  position: absolute;
  width: 16px;
  height: 100%;
  transform: translateX(-600px);

  background-color: var(--bg-favorite);
  filter: blur(32px) invert(100%);
  opacity: 0.25;

  &.active {
    animation: lightAni 4000ms 600ms cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  @keyframes lightAni {
    0% {
      transform: translateX(-600px);
    }
    100% {
      transform: translateX(520px);
    }
  }
`

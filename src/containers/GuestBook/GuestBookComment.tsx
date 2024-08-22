import styled from 'styled-components';
import Comment from '@/containers/PostMarkDown/Comment';
import { useEffect } from 'react';
import { apiGet } from '@/services/api';
import { guestbookCommentState } from '@/atoms/guestbook';
import { useRecoilState } from 'recoil';

const GuestBookComment = (): JSX.Element => {
  const [comments, setComments] = useRecoilState<any>(guestbookCommentState);

  const getCommentData = async () => {
    apiGet(`/api/guestbook`)
      .then(res => {
        setComments(res.comments);
      })
  }

  useEffect(() => {
    getCommentData();
  }, [])

  return (
    <Container>
      <CommentList>
        {comments && comments.map((i: any) =>
          <Comment
            key={i.commentId}
            data={i}
            set={setComments}
          />
        )}
        {comments ? comments.length === 0 &&
          <NoList>
            <p>등록된 방명록이 없습니다.</p>
          </NoList>
          :
          null
        }
      </CommentList>
    </Container>
  )
};

export default GuestBookComment;

const Container = styled.div`
  width: 100%;
`
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-height: 18.75rem;
  padding-bottom: 16.25rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    min-height: 12.5rem;

    font-size: 0.875rem;
  }
`
const NoList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 260px;

  font-size: 1.125rem;
  font-weight: 450;
  color: var(--text-sub-dark);
`

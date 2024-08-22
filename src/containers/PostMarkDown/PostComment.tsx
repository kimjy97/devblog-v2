import { postInfoState } from '@/atoms/post';
import Comment from '@/containers/PostMarkDown/Comment';
import CommentForm from '@/containers/PostMarkDown/Comment/CommentForm';
import { apiGet } from '@/services/api';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const PostComment = (): JSX.Element | null => {
  const postInfo = useRecoilValue(postInfoState);
  const [comments, setComments] = useState<any>([]);

  const getCommentData = async () => {
    if (postInfo) {
      apiGet(`/api/blog/post/comment?postId=${postInfo.postId}`)
        .then(res => {
          setComments(res.comments);
        })
    }
  }

  useEffect(() => {
    getCommentData();
  }, [postInfo])

  return postInfo ? (
    <Container>
      <CommentForm set={setComments} />
      <CommentLabel>
        <Label>댓글</Label>
        <CommentNum>{comments.length}개</CommentNum>
      </CommentLabel>
      <CommentList>
        {comments && comments.map((i: any) =>
          <Comment key={i.commentId} data={i} set={setComments} />
        )}
        {comments.length === 0 &&
          <NoList>
            <p>등록된 댓글이 없습니다.</p>
          </NoList>
        }
      </CommentList>
    </Container>
  ) : null
};

export default PostComment;

const Container = styled.div`
  padding-top: 1.5rem;
  padding-bottom: 7.5rem;

  transition: 150ms;
`
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 18.75rem;
`
const CommentLabel = styled.div`
  display: flex;
  align-items: flex-end;
  padding-bottom: 1.375em;

  transition: 150ms;
`
const Label = styled.p`
  margin-right: 0.75rem;
  color: var(--text-normal);
  font-size: 1.5rem;
  font-weight: 700;

  transition: 150ms;
`
const CommentNum = styled.p`
  color: var(--text-sub-light);
  font-size: 1.125rem;
  font-weight: 500;
`
const NoList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 260px;

  border-radius: 1em;

  font-size: 1.125em;
  font-weight: 450;
  color: var(--text-sub-dark);
`


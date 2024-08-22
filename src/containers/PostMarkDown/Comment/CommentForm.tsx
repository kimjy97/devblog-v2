import { postInfoState } from '@/atoms/post';
import Input from '@/containers/PostMarkDown/Comment/Input';
import useToast from '@/hooks/useToast';
import IconWrite from '@svgs/write.svg';
import { apiPost } from '@/services/api';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

interface IProps {
  set: any;
}

const CommentForm = ({ set }: IProps): JSX.Element => {
  const postInfo = useRecoilValue(postInfoState);
  const [nameInput, setNameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [contentInput, setContentInput] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  const handleClickSubmit = () => {
    if (!submitLoading) {
      if (!passwordInput) {
        addToast({ type: 1, value: '비밀번호를 입력해주세요.' })
        return;
      }
      if (!contentInput) {
        addToast({ type: 1, value: '댓글 내용을 입력해주세요.' })
        return;
      }
      if (postInfo) {
        const body = {
          postId: postInfo.postId,
          role: 'user',
          nickname: nameInput === '' ? '익명' : nameInput,
          password: passwordInput,
          content: contentInput,
        }

        setSubmitLoading(true);

        apiPost(`/api/blog/post/comment`, body)
          .then(res => {
            set(res.comments);
            setPasswordInput('');
            setContentInput('');
          })
          .catch((error: any) => addToast({ type: 1, value: error.message }))
          .finally(() => setSubmitLoading(false))
      }
    }
  }

  return (
    <Container>
      <UserInfoForm>
        <InputWrapper>
          <Input
            value={nameInput}
            label='이름'
            placeholder='익명'
            onChange={e => setNameInput(e.target.value)}
          />
          <Input
            value={passwordInput}
            label='비밀번호'
            placeholder='••••••'
            password
            onChange={e => setPasswordInput(e.target.value)}
          />
        </InputWrapper>
      </UserInfoForm>
      <ContentForm>
        <ContentTextArea
          value={contentInput}
          rows={6}
          placeholder='댓글 내용'
          onChange={e => setContentInput(e.target.value)}
          maxLength={2000}
        />
      </ContentForm>
      <BtnWrapper>
        <ContentLength>
          <p>{contentInput.length} / 2000</p>
        </ContentLength>
        <SubmitBtn onClick={handleClickSubmit}>
          <WriteIcon />
          <p>댓글 등록</p>
        </SubmitBtn>
      </BtnWrapper>
    </Container>
  )
};

export default CommentForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 5em;
`
const UserInfoForm = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5em 0;
`
const ContentForm = styled.div`
  width: 100%;
`
const ContentTextArea = styled.textarea`
  width: 100%;
  min-width: 0;
  padding: 1em;

  border-radius: 10px;
  outline: 1px solid var(--bg-comment-input-border);
  background-color: var(--bg-comment-input);
  border: none;
  resize: none;
  overflow: auto;

  color: var(--text-normal);
  transition: 150ms;

  &::placeholder {
    color: var(--text-sub-dark);
  }

  &:focus {
    outline: 1px solid var(--bg-comment-input-focus-border);
    &::placeholder {
      color: transparent;
    }
  }

  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 6px 6px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 6px 6px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-comment-input);
  }
`
const ContentLength = styled.div`
  padding-top: 0.125em;
  padding-left: 0.5em;

  color: var(--text-sub-dark);
  font-size: 0.875em;
  font-weight: 500;
`
const InputWrapper = styled.div`
  display: flex;
  gap: 0.5em;
  width: 100%;
`
const BtnWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1em;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 0.5em;
`
const SubmitBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 0.6875em;
  padding: 0.5em 0.875em;

  background-color: var(--bg-submit);
  border-radius: 0.625em;

  color: #fff;
  font-size: 1em;
  font-weight: 500;
  white-space: nowrap;

  cursor: pointer;
  transition: 150ms;

  &:hover {
    background-color: var(--bg-submit-hover);
  }
`
const WriteIcon = styled(IconWrite)`
  width: 0.875em;
  height: 0.875em;

  fill: #fff;

  transition: 150ms;
`
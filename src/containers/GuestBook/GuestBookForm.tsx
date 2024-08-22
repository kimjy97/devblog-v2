import { guestbookCommentState } from '@/atoms/guestbook';
import Input from '@/containers/PostMarkDown/Comment/Input';
import useToast from '@/hooks/useToast';
import { apiPost } from '@/services/api';
import IconWrite from '@svgs/write.svg';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const GuestBookForm = (): JSX.Element => {
  const [, setComments] = useRecoilState<any>(guestbookCommentState);
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

      const body = {
        role: 'user',
        nickname: nameInput === '' ? '익명' : nameInput,
        password: passwordInput,
        content: contentInput,
      }

      setSubmitLoading(true);

      apiPost(`/api/guestbook`, body)
        .then(res => {
          setComments(res.comments);
          setPasswordInput('');
          setContentInput('');
        })
        .catch((error: any) => addToast({ type: 1, value: error.message }))
        .finally(() => setSubmitLoading(false))
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
        <BtnWrapper>
          <SubmitBtn onClick={handleClickSubmit}>
            <WriteIcon />
            <p>등록</p>
          </SubmitBtn>
        </BtnWrapper>
      </UserInfoForm>
      <ContentForm>
        <ContentTextArea
          value={contentInput}
          rows={4}
          placeholder='내용'
          onChange={e => setContentInput(e.target.value)}
          maxLength={2000}
        />
      </ContentForm>

    </Container>
  )
};

export default GuestBookForm;

const Container = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100% - 2rem);
  max-width: 700px;
  padding: 0 1rem;
  padding-top: 0.625rem;
  padding-bottom: 1.25rem;
  transform: translateY(5.625rem);

  background-color: var(--bg-comment-form);
  border-radius: 1.5rem 1.5rem 0 0;
  border: 1px solid var(--bg-comment-border);

  font-size: 0.875rem;

  will-change: transform;
  transition: 150ms;

  &::before {
    position: absolute;
    content: '';
    width: 140%;
    height: 125%;
    left: 50%;
    top: -25%;
    transform: translate(-50%, 0);

    z-index: -1;
  }

  &:hover {
    filter: var(--bg-sidebar-shadow);
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;

    border-radius: 0;

    font-size: 0.875rem;

    transform: translateY(0);

    &:hover {
      filter: none;
    }
  }
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
  outline: 1px solid transparent;
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
const InputWrapper = styled.div`
  display: flex;
  gap: 0.5em;
`
const BtnWrapper = styled.div`
  flex: 1;
  display: flex;
  gap: 1em;
  justify-content: flex-end;
  align-items: center;
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
import styled from 'styled-components';
import IconProfile from '@public/svgs/profile.svg';
import { getFormatDate } from '@/utils/date';
import { useEffect, useState } from 'react';
import { apiDelete, apiPut } from '@/services/api';
import useToast from '@/hooks/useToast';
import { usePathname } from 'next/navigation';

interface IProps {
  data: any;
  set: any;
}

const Comment = ({ data, set }: IProps): JSX.Element => {
  const [isModify, setIsModify] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [modified, setModified] = useState<string>('');
  const [deletePasswordInput, setDeletePasswordInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const pathname = usePathname();
  const { addToast } = useToast();

  const handleClickModify = () => {
    setIsModify(!isModify);
  }

  const handleClickDelete = () => {
    setIsDelete(!isDelete);
    setDeletePasswordInput('');
  }

  const handleClickDeleteComplete = async () => {
    const body = {
      postId: data.postId,
      password: deletePasswordInput,
    }
    const apiUrl = pathname === '/guest' ?
      `/api/guestbook/${data.guestbookCommentId}?password=${encodeURIComponent(body.password)}`
      :
      `/api/blog/post/comment/${data.commentId}?postId=${data.postId}&password=${encodeURIComponent(body.password)}`;

    if (!deletePasswordInput) {
      addToast({ type: 1, value: '설정된 비밀번호을 입력해주세요.' })
      return;
    }

    setDeletePasswordInput('');

    await apiDelete(apiUrl)
      .then(res => {
        setIsDelete(false);
        set(res.comments);
      })
      .catch(error => {
        addToast({ type: 1, value: error.message });
        setDeletePasswordInput('');
      })
  }

  const handleClickDeleteCancel = () => {
    setIsDelete(false);
  }

  const handleClickModifyCancel = () => {
    setIsModify(false);
  }

  const handleClickModifyComplete = async () => {
    const body = {
      postId: data.postId,
      password: passwordInput,
      content: modified,
    }

    const apiUrl = pathname === '/guest' ?
      `/api/guestbook/${data.guestbookCommentId}`
      :
      `/api/blog/post/comment/${data.commentId}`;

    if (!passwordInput) {
      addToast({ type: 1, value: '설정된 비밀번호을 입력해주세요.' })
      return;
    }

    await apiPut(apiUrl, body)
      .then(res => {
        setIsModify(false);
        set(res.comments);
      })
      .catch(error => {
        addToast({ type: 1, value: error.message });
        setPasswordInput('');
      })
  }

  useEffect(() => {
    if (data) {
      setModified(data.content);
      setPasswordInput('');
    }
  }, [data, isModify]);

  return (
    <Container>
      <Profile>
        <ProfileImg>
          <ProfileIcon />
        </ProfileImg>
      </Profile>
      {isModify ?
        <ModifyInfo>
          <ModifyWrapper>
            <ModifyName value={data.nickname} />
            <ModifyPassword
              value={passwordInput}
              type='password'
              placeholder='••••••'
              onChange={e => setPasswordInput(e.target.value)}
            />
          </ModifyWrapper>
          <Wrapper>
            <TextArea
              value={modified}
              rows={6}
              placeholder={data.content}
              maxLength={2000}
              onChange={e => setModified(e.target.value)}
            />
          </Wrapper>
          <BtnWrapper>
            <ContentLength>
              <p>{modified.length} / 2000</p>
            </ContentLength>
            <SubmitBtnWrapper>
              <SubmitBtn cancel onClick={handleClickModifyCancel}>
                취소
              </SubmitBtn>
              <SubmitBtn onClick={handleClickModifyComplete}>
                수정
              </SubmitBtn>
            </SubmitBtnWrapper>
          </BtnWrapper>
        </ModifyInfo>
        :
        <Info>
          <Wrapper>
            <Name>{data.nickname}</Name>
            <DateText>{getFormatDate(new Date(data.createdAt), false)}{data.isEdited ? ' (수정됨)' : ''}</DateText>
          </Wrapper>
          <Wrapper>
            <Text>{data.content}</Text>
          </Wrapper>
          {isDelete ?
            <DeleteWrapper>
              <DeletePassword
                value={deletePasswordInput}
                type='password'
                placeholder='비밀번호'
                onChange={e => setDeletePasswordInput(e.target.value)}
              />
              <OptionBtn className='delete' onClick={handleClickDeleteComplete}>
                삭제
              </OptionBtn>
              <OptionBtn onClick={handleClickDeleteCancel}>
                취소
              </OptionBtn>
            </DeleteWrapper>
            :
            <OptionWrapper>
              <OptionBtn onClick={handleClickModify}>
                수정
              </OptionBtn>
              <OptionBtn onClick={handleClickDelete}>
                삭제
              </OptionBtn>
            </OptionWrapper>
          }
        </Info>
      }
    </Container>
  )
};

export default Comment;

const Container = styled.div`
  display: flex;
  gap: 1.125rem;
  padding: 1.25rem 1.25rem;
  padding-bottom: 1rem;

  background-color: var(--bg-comment);
  border-radius: 1rem;

  animation: fadeIn 300ms ease-out;
  transition: 150ms;

  @keyframes fadeIn {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`
const Profile = styled.div`
  display: flex;
  align-items: flex-start;
`
const ProfileImg = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.875em;
  aspect-ratio: 1/1;
  
  border-radius: 100%;
  overflow: hidden;
  background-color: var(--bg-chat-profile-background);
  transition: 150ms;
`
const ProfileIcon = styled(IconProfile)`
  width: 1.75em;
  aspect-ratio: 1/1;
  margin-bottom: -0.5625em;

  overflow: hidden;
  fill: var(--bg-chat-profile);
  transform: scaleX(1.1);

  transition: 150ms;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  p {
    transition: 150ms;
  }
`
const ModifyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  p {
    transition: 150ms;
  }
`
const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  animation: fadeIn2 150ms ease-out;

  @keyframes fadeIn2 {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
const ModifyInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  animation: fadeIn 150ms ease-out;

  @keyframes fadeIn {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`
const Name = styled.p`
  color: var(--text-normal);
  font-size: 1em;
  font-weight: 450;
`
const ModifyName = styled.input`
  width: 8.75em;
  height: 2.375em;
  padding: 0 1em;
  border-radius: 0.625em;
  outline: 1px solid var(--bg-comment-input-border);
  background-color: var(--bg-comment-input);
  border: none;

  color: var(--text-normal);
  font-size: 1em;

  transition: 150ms;

  &:focus {
    outline: 1px solid var(--bg-comment-input-focus-border);
    &::placeholder {
      color: transparent;
    }
  }
`
const ModifyPassword = styled.input`
  width: 6.25em;
  height: 2.375em;
  padding: 0 1em;
  border-radius: 0.625em;
  outline: 1px solid var(--bg-comment-input-border);
  background-color: var(--bg-comment-input);
  border: none;

  color: var(--text-normal);
  font-size: 1em;

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
`
const DateText = styled.p`
  color: var(--text-sub-light);
  font-size: 0.875em;
  font-weight: 400;
`
const Text = styled.p`
  color: var(--text-normal);
  font-size: 1em;
  font-weight: 500;
`
const OptionWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 0.25rem;

  animation: fadeIn2 300ms ease-out;

  @keyframes fadeIn2 {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
const OptionBtn = styled.div`
  position: relative;
  
  color: var(--text-sub);
  font-size: 0.875em;

  cursor: pointer;
  transition: 150ms;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    padding: 1.25em 1.125em;
  }

  &:hover {
    color: var(--text-normal);
  }

  &.delete {
    color: var(--bg-comment-option-delete);

    &:hover {
      color: var(--bg-comment-option-delete-hover);
    }
  }
`
const TextArea = styled.textarea`
  width: 100%;
  min-width: 0;
  padding: 1em;
  margin-top: 0.125em;

  border-radius: 0.625rem;
  outline: 1px solid var(--bg-comment-input-border);
  background-color: var(--bg-comment-input);
  border: none;
  resize: none;
  overflow: auto;

  color: var(--text-normal);
  font-size: 1em;
  transition: 150ms;

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
  padding-left: 0.5em;

  color: var(--text-sub-dark);
  font-size: 0.875em;
  font-weight: 500;
`
const BtnWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`
const SubmitBtnWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`
const SubmitBtn = styled.div<{ cancel?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 0.5em 0.75em;

  background-color: ${({ cancel }) =>
    cancel ? 'var(--bg-cancel)' : 'var(--bg-submit)'
  };
  border-radius: 0.625em;

  color: #fff;
  font-size: 1em;
  font-weight: 500;

  cursor: pointer;
  transition: 150ms;

  &:hover {
    background-color: ${({ cancel }) =>
    cancel ? 'var(--bg-cancel-hover)' : 'var(--bg-submit-hover)'
  };
  }
`
const DeleteWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.125rem 0;

  animation: fadeIn3 200ms ease-out forwards;

  @keyframes fadeIn3 {
    0% {
      transform: translateX(-10px);
      opacity: 0;
    }
    100% {
      transform: translateX(-5px);
      opacity: 1;
    }
  }
`
const DeletePassword = styled.input`
  width: 6.25rem;
  height: 2rem;
  padding: 0 0.75rem;
  border-radius: 10px;
  outline: 1px solid var(--bg-comment-input-border);
  background-color: var(--bg-comment-input);
  border: none;

  color: var(--text-normal);
  font-size: 0.875rem;

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
`

import { chatMenuWidth } from '@/constants/chat';
import styled from 'styled-components';
import IconEdit from '@public/svgs/edit.svg';
import IconDuplicate from '@public/svgs/duplicate.svg';
import IconDelete from '@public/svgs/remove.svg';
import { forwardRef } from 'react';
import { useRecoilState } from 'recoil';
import { chatArrState, currentChatIdState } from '@/atoms/chatAI';
import useToast from '@/hooks/useToast';
import { chatItemDeleteModalState, chatItemRenameModalState } from '@/atoms/modal';
import { IChatArray } from '@/types/chat';

interface IProps {
  cid: number | undefined;
  handleClose: any;
};

const KebabMenu = forwardRef(({ cid, handleClose }: IProps, ref: any): JSX.Element => {
  const [chatArr, setChatArr] = useRecoilState(chatArrState);
  const [, setChatItemRenameModal] = useRecoilState(chatItemRenameModalState);
  const [, setChatItemDeleteModal] = useRecoilState(chatItemDeleteModalState);
  const [, setCurrentChatId] = useRecoilState(currentChatIdState);
  const idx: number = chatArr.findIndex((i: IChatArray) => i.chatId === cid);
  const isDisable = (chatArr[idx]?.chatContents.length === 0 && chatArr[idx].chatName === '새로운 채팅이 시작되었습니다.') ? 'disable' : '';
  const visible = cid !== undefined;
  const { addToast } = useToast();

  const handleClickDelete = () => {
    setChatItemDeleteModal(cid);
    handleClose();
  }

  const handleClickRename = () => {
    setChatItemRenameModal(cid);
    handleClose();
  }

  const handleClickDuplicate = () => {
    const newChatId = chatArr[chatArr.length - 1].chatId + 1;
    const newChat: IChatArray = { ...chatArr[idx] };
    newChat.chatId = newChatId;
    newChat.chatName = `copy - ${newChat.chatName}`;
    newChat.chatDate = new Date();
    const tempArr: IChatArray[] = [...chatArr, newChat];

    setChatArr(tempArr);
    setCurrentChatId(newChatId);
    addToast({ value: '채팅이 복제되었습니다.' });
    handleClose();
  }

  return (
    <Container
      id='kebabMenu'
      className={visible ? 'visible' : ''}
      ref={ref}
    >
      <Menu onClick={handleClickRename}>
        <Icon>
          <EditIcon />
        </Icon>
        <p>이름 변경</p>
      </Menu>
      <Menu
        className={isDisable}
        onClick={handleClickDuplicate}
      >
        <Icon>
          <DuplicateIcon />
        </Icon>
        <p>복제</p>
      </Menu>
      <Line />
      <Menu
        className='red'
        onClick={handleClickDelete}
      >
        <Icon>
          <DeleteIcon />
        </Icon>
        <p>삭제</p>
      </Menu>
    </Container>
  )
});

export default KebabMenu;

const Container = styled.ul`
  position: absolute;
  left: calc(${chatMenuWidth} + 8px);
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 8px 0;
  
  border-radius: 12px;
  background-color: var(--bg-modal);
  box-shadow: var(--bg-kebab-boxshadow);
  overflow: hidden;
  opacity: 0;

  pointer-events: none;
  user-select: none;
  
  &.visible {
    pointer-events: initial;
    animation: fadeInAni 150ms forwards;
  }
  
  @keyframes fadeInAni {
    100%{
      opacity: 1;
    }
  }

  @media (max-width: 1280px) {
    margin-top: 36px;
    left: auto !important;
    right: 16px;
  }
`
const Menu = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0.625rem 20px;
  
  color: var(--text-normal);
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-kebab-hover);
  }

  &.red {
    color: var(--text-kebab-red);
  }

  &.disable {
    opacity: 0.3;
    pointer-events: none;
  }
`
const EditIcon = styled(IconEdit)`
  width: 14px;
  height: 14px;
  stroke: var(--text-normal);
`
const DuplicateIcon = styled(IconDuplicate)`
  width: 13px;
  height: 13px;
  stroke: var(--text-normal);
`
const DeleteIcon = styled(IconDelete)`
  width: 16px;
  height: 16px;
  stroke: var(--text-kebab-red);
`
const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 6px 0;

  background-color: var(--bg-modal-line);
`
const Icon = styled.div`
  display: flex;
  align-items: center;
  width: 16px;
  aspect-ratio: 1/1;
`


import { chatArrState } from '@/atoms/chatAI';
import { chatItemRenameModalState } from '@/atoms/modal';
import { Button, ModalButtons } from '@/containers/Modals/Button';
import { ModalContents, ModalTemplate, ModalTitle } from '@/containers/Modals/ModalTemplate';
import { useModal } from '@/hooks/useModal';
import useToast from '@/hooks/useToast';
import { IChatArray } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

/** 모달창 버튼 */
const Buttons = ({ handleClose, handleRename }: any) => (
  <ModalButtons>
    <Button text='취소' onClick={handleClose} />
    <Button blue text='변경' onClick={handleRename} />
  </ModalButtons>
);

const ChatItemRenameModal = (): JSX.Element => {
  const textareaRef = useRef(null);
  const [chatArr, setChatArr] = useRecoilState(chatArrState);
  const [cid, setChatItemRenameModal] = useRecoilState(chatItemRenameModalState);
  const [exName, setExName] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<string>('');
  const { addToast } = useToast();
  const { handleModalClose } = useModal();
  const className = cid !== undefined ? 'visible' : '';
  const idx: number = chatArr.findIndex((i: IChatArray) => i.chatId === cid);
  const maxLength = 100;

  /** 모달창 닫기 */
  const handleClose = () => {
    handleModalClose(setChatItemRenameModal);
  }

  /** 해당 채팅 이름 변경 */
  const handleRename = () => {
    setChatArr((prevChatArr: IChatArray[]) =>
      prevChatArr.map((chat, index) =>
        index === idx ? { ...chat, chatName: value } : chat
      )
    );
    handleClose();
    addToast({ value: '채팅 이름이 변경되었습니다.' })
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  /** 붙여넣기 제한 */
  const handlePaste = (event: any) => {
    event.preventDefault();
    const paste = (event.clipboardData || window.Clipboard).getData('text');
    const sanitizedPaste = paste.replace(/\n/g, ' ');
    const textarea: any = textareaRef.current;
    const currentText = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newTextLength = currentText.length - (end - start) + sanitizedPaste.length;
    if (newTextLength > maxLength) {
      const allowedLength = maxLength - (currentText.length - (end - start));
      textarea.setRangeText(sanitizedPaste.substring(0, allowedLength), start, end, 'end');
    } else {
      textarea.setRangeText(sanitizedPaste, start, end, 'end');
    }

    const eventInput = new Event('input', { bubbles: true });
    textarea.dispatchEvent(eventInput);
  };

  useEffect(() => {
    const textarea: any = textareaRef.current;

    if (idx > -1) {
      const name = chatArr[idx].chatName;
      setValue(name);

      if (!exName) {
        setExName(name);
      }

      if (textarea) {
        setTimeout(() => textarea.select(), 1);
      }
    }
  }, [cid, textareaRef])

  return (
    <ModalTemplate
      visible={className}
      setVisibleModal={setChatItemRenameModal}
    >
      <ModalTitle>채팅 이름 변경</ModalTitle>
      <ModalContents>
        <Wrapper>
          <Label>새로운 채팅 이름</Label>
          <Input
            ref={textareaRef}
            value={value}
            rows={2}
            placeholder={exName}
            maxLength={maxLength}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
          />
        </Wrapper>
      </ModalContents>
      <Buttons
        handleClose={handleClose}
        handleRename={handleRename}
      />
    </ModalTemplate>
  )
};

export default ChatItemRenameModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
  gap: 2px;
`
const Label = styled.div`
  color: var(--text-sub);
  font-size: 0.75rem;
  padding-left: 6px;
  padding-bottom: 4px;
`
const Input = styled.textarea`
  padding: 0.625rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--bg-modal-input-border);
  background-color: var(--bg-modal-input);

  font-size: 0.875rem;
  word-break: break-all;
  line-height: 1.25rem;
  color: var(--text-normal);
  resize: none;

  &:focus {
    border: 1px solid var(--bg-modal-input-focus-border);
  }

  &::placeholder {
    color: var(--text-modal-input-placeholder);
  }
  &::-webkit-scrollbar {
    width: 14px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    height: 50%;
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
    background-color: var(--bg-modal-input);
  }
`
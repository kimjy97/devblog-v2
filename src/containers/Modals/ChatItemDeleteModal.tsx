import { chatArrState, currentChatIdState } from '@/atoms/chatAI';
import { chatItemDeleteModalState } from '@/atoms/modal';
import { Button, ModalButtons } from '@/containers/Modals/Button';
import { ModalContents, ModalTemplate, ModalTitle } from '@/containers/Modals/ModalTemplate';
import { useModal } from '@/hooks/useModal';
import useToast from '@/hooks/useToast';
import { IChatArray } from '@/types/chat';
import { useRecoilState } from 'recoil';

/** 모달창 버튼 */
const Buttons = ({ handleClose, handleDelete }: any) => (
  <ModalButtons>
    <Button text='취소' onClick={handleClose} />
    <Button red text='삭제' onClick={handleDelete} />
  </ModalButtons>
)

const ChatItemDeleteModal = (): JSX.Element => {
  const [chatArr, setChatArr] = useRecoilState(chatArrState);
  const [cid, setChatItemDeleteModal] = useRecoilState(chatItemDeleteModalState);
  const [currentChatId, setCurrentChatId] = useRecoilState(currentChatIdState);
  const { addToast } = useToast();
  const { handleModalClose } = useModal();
  const className = cid !== undefined ? 'visible' : '';

  /** 모달창 닫기 */
  const handleClose = () => {
    handleModalClose(setChatItemDeleteModal);
  }

  /** 해당 채팅 삭제 */
  const handleDelete = () => {
    const idx: number = chatArr.findIndex((i: IChatArray) => i.chatId === cid);
    const nextIndex: number = idx - 1;
    const prevIndex: number = idx + 1;
    let tempArr: IChatArray[] = [];

    if (chatArr.length > 1) {
      chatArr.forEach((i: IChatArray) => {
        if (i.chatId !== cid) {
          tempArr.push(i);
        }
      })
      if (currentChatId === cid) {
        if (nextIndex > -1) {
          setCurrentChatId(chatArr[nextIndex].chatId);
        } else if (prevIndex > 0 && chatArr[prevIndex]) {
          setCurrentChatId(chatArr[prevIndex].chatId);
        }
      }
    } else {
      tempArr = [{
        chatId: 0,
        chatName: '새로운 채팅이 시작되었습니다.',
        chatContents: [],
        chatDate: new Date(),
      }]
      setCurrentChatId(0);
    }

    setChatArr(tempArr);
    addToast({ value: '채팅이 삭제되었습니다.' });
    handleClose();
  }

  return (
    <ModalTemplate
      visible={className}
      setVisibleModal={setChatItemDeleteModal}
    >
      <ModalTitle>채팅 삭제</ModalTitle>
      <ModalContents>
        채팅을 삭제하면 더이상 채팅과 기록들을 볼 수 없게 됩니다.<br />
        해당 채팅을 정말로 삭제하시겠습니까?
      </ModalContents>
      <Buttons
        handleClose={handleClose}
        handleRename={handleDelete}
      />
    </ModalTemplate>
  )
};

export default ChatItemDeleteModal;
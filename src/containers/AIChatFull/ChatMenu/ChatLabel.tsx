import styled from 'styled-components';
import IconAdd from '@public/svgs/plus.svg';
import IconList from '@public/svgs/list.svg';
import { useRecoilState } from 'recoil';
import { chatArrState, currentChatIdState, isResponsingState } from '@/atoms/chatAI';
import { IChatArray } from '@/types/chat';
import { isAIChatMenuToggleState } from '@/atoms/sidebar';

const ChatLabel = (): JSX.Element => {
  const [currentChatId, setCurrentChatId] = useRecoilState(currentChatIdState);
  const [chatArr, setChatArr] = useRecoilState(chatArrState);
  const [, setIsAIChatMenuToggle] = useRecoilState(isAIChatMenuToggleState);
  const [, setIsResponsing] = useRecoilState(isResponsingState);

  const handleAddChat = () => {
    setIsResponsing(false);
    let lastId: number = 0;
    if (!getIsLastChatNew()) {
      if (chatArr.length > 0) {
        const newChatArr: IChatArray[] = [...chatArr];
        newChatArr.sort((a: IChatArray, b: IChatArray) => {
          return a.chatId < b.chatId ? -1 : a.chatId > b.chatId ? 1 : 0;
        });
        lastId = newChatArr[newChatArr.length - 1].chatId;

        if (newChatArr[newChatArr.length - 1].chatContents.length > 0) {
          newChatArr.push({
            chatId: lastId + 1,
            chatName: '새로운 채팅이 시작되었습니다.',
            chatContents: [],
            chatDate: new Date(),
          })

          setCurrentChatId(lastId + 1);
          setChatArr(newChatArr);
        }
      } else {
        setChatArr([{
          chatId: 0,
          chatName: '새로운 채팅이 시작되었습니다.',
          chatContents: [],
          chatDate: new Date(),
        }]);
      }
      setIsAIChatMenuToggle(false);
    } else {
      setChatArr([...chatArr.slice(0, -1), {
        chatId: getLastChat().chatId,
        chatName: '새로운 채팅이 시작되었습니다.',
        chatContents: [],
        chatDate: new Date(),
      }]);
      setCurrentChatId(getLastChat().chatId);
    }
  };

  const getIsLastChatNew = (): boolean => {
    return getLastChat()?.chatContents.length === 0;
  }

  const getLastChat = () => {
    return chatArr[chatArr.length - 1];
  }

  const className = getIsLastChatNew() && getLastChat().chatId === currentChatId ? 'disable' : '';

  return (
    <Container>
      <Label>
        <ListIcon />
        <p>채팅 목록</p>
      </Label>
      <NewChatBtn
        className={className}
        onClick={handleAddChat}
      >
        <p>새로운 채팅</p>
        <AddIcon />
      </NewChatBtn>
    </Container>
  )
};
export default ChatLabel;


const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 24px;
`
const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding-left: 8px;

  &>p {
    flex: 1;
    padding-left: 8px;
    
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-normal)
  }
`
const ListIcon = styled(IconList)`
  width: 1rem;
  height: 1rem;

  stroke: var(--text-normal);
  transition: 150ms;
`
const NewChatBtn = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5625rem 0.75rem;
  gap: 0.5rem;

  background-color: var(--bg-chat-new);
  border-radius: 0.75rem;

  font-size: 0.8125rem;
  font-weight: 500;
  color : #fff;

  will-change: transform;
  transition: 150ms;
  cursor: pointer;
  user-select: none;

  &.disable {
    filter: grayscale(60%);
    opacity: 0.5;
  }

  &:not(.disable):hover {
    background-color: var(--bg-chat-new-hover);
    transform: scale(1.05);
  }

  @media (max-width: 1280px) {
  }
`
const AddIcon = styled(IconAdd)`
  width: 10px;
  height: 10px;

  stroke: #fff;
  transition: 150ms;
`
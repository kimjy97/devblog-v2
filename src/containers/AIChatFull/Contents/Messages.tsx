import { chatArrState, currentChatIdState } from "@/atoms/chatAI";
import Message from "@/containers/AIChatFull/Contents/Message";
import { IChatArray } from "@/types/chat";
import { useRecoilValue } from "recoil";

const Messages = () => {
  const chatArr = useRecoilValue(chatArrState);
  const currentChatId = useRecoilValue(currentChatIdState);
  const arr: any[] | undefined = chatArr.find((i: IChatArray) => i.chatId === currentChatId)?.chatContents;

  return arr ? (
    arr.length > 0 && arr.map((i: any, idx: number) =>
      <Message key={idx} data={i} />
    )
  ) : null
}

export default Messages;
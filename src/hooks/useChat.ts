import { chatArrState, currentChatIdState, isResponsingState, requestPromptState } from "@/atoms/chatAI"
import { modelArr, msgSliceNum, safetySettings } from "@/constants/chat";
import { apiPost } from "@/services/api";
import { IChatArray, IChatContents } from "@/types/chat";
import { getToken, removeTrailingNewlines, saveChatFull, transformContetnsArr, usingToken } from "@/utils/chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil"

const defaultChatContents: IChatArray = { chatId: 0, chatName: '새로운 채팅이 시작되었습니다.', chatContents: [], chatDate: new Date() }

export const useResponseChat = () => {
  const stopStreamRef = useRef<boolean>(false);
  const [chatArr, setChatArr] = useRecoilState(chatArrState);
  const [requestPrompt, setRequestPrompt] = useRecoilState(requestPromptState);
  const [isResponsing, setIsResponsing] = useRecoilState(isResponsingState);
  const currentChatId = useRecoilValue(currentChatIdState);
  const modelName = modelArr[0].model;

  const getCurrentChat = (arr: IChatArray[]) => {
    const chat: IChatArray = arr.find((i: IChatArray) => i.chatId === currentChatId) ?? defaultChatContents;
    return { ...chat };
  }

  const currentChat: IChatArray = getCurrentChat(chatArr);

  const getLocalStorageArr = () => {
    const storage = localStorage.getItem('AIChat_full');

    if (storage) {
      const parsedStorage = JSON.parse(storage);
      if (parsedStorage.length > 0) {
        setChatArr(parsedStorage);
      } else {
        setChatArr([{
          chatId: 0,
          chatName: '새로운 채팅이 시작되었습니다.',
          chatContents: [],
          chatDate: new Date(),
        }])
      }
    } else {
      setChatArr([{
        chatId: 0,
        chatName: '새로운 채팅이 시작되었습니다.',
        chatContents: [],
        chatDate: new Date(),
      }])
    }
  }

  const addUserMessage = () => {
    const attachedFilesArr: any[] = [];
    requestPrompt.slice(1).forEach((i: any) => {
      attachedFilesArr.push(i.origin);
    });
    // 새로운 chatContents 배열 생성
    const newChatContents: IChatContents[] = [{
      role: 'user',
      contents: requestPrompt[0],
      attachedFiles: attachedFilesArr,
      done: false,
    }, {
      role: 'assistant',
      contents: '',
      done: false,
    }];
    newChatContents.unshift(...currentChat.chatContents);

    // 새로운 chatArr 배열 생성
    const newChatArr = chatArr.map((chat) => {
      if (chat.chatId === currentChatId) {
        return { ...chat, chatContents: newChatContents, chatDate: new Date() };
      }
      return chat;
    });

    setChatArr(newChatArr);

    try {
      handleRequest(newChatArr);
    } catch (error: any) {
      if (error.status === 500) handleRequest(newChatArr);
    }
  }

  const serverLog = async (usedToken: number, error?: boolean) => {
    await apiPost('/api/log/chat', {
      chat: requestPrompt[0],
      totalToken: getToken(modelName),
      usedToken,
      error,
    });
  }

  const handleNewChatArr = (arr: IChatArray[], ct: string, complete: boolean) => {
    const newCurrentChat: IChatArray = getCurrentChat(arr);
    const attachedFilesArr: any[] = [];
    requestPrompt.slice(1).forEach((i: any) => {
      attachedFilesArr.push(i.origin);
    });
    const newChatContents: IChatContents[] = [{
      role: 'user',
      contents: requestPrompt[0],
      attachedFiles: attachedFilesArr,
      done: complete,
    },
    {
      role: 'assistant',
      contents: complete ? removeTrailingNewlines(ct) : ct,
      done: complete,
    },
    ];
    newChatContents.unshift(...newCurrentChat.chatContents.slice(0, -2))

    const newChatArr: IChatArray[] = arr.map((chat) => {
      if (chat.chatId === currentChatId) {
        return { ...chat, chatContents: newChatContents, chatDate: new Date() };
      }
      return chat;
    });

    setChatArr(newChatArr);
    saveChatFull(newChatArr);

    return [...newChatArr];
  }

  const handleNewChatName = (arr: IChatArray[], ct: string, idx: number) => {
    const newChatArr = arr.map((chat, index) =>
      index === idx ? { ...chat, chatName: removeTrailingNewlines(ct) } : chat
    );
    setChatArr(newChatArr);
    saveChatFull(newChatArr);

    return newChatArr;
  }

  const handleRequest = async (arr: IChatArray[]) => {
    let ct = '';
    let token = 0;
    let newChatArr: IChatArray[] = [];
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? '';
    const chatConfig: any = { model: modelName, safetySettings };
    const chatConfig2: any = { model: modelName, systemInstruction: '너는 이제부터 대화의 내용을 보고 대화의 주제를 종결어미를 제외하고 말해야 돼.' };
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel(chatConfig);
    const model2 = gemini.getGenerativeModel(chatConfig2);

    try {
      const newCurrentChat: IChatArray = getCurrentChat(arr);
      const body = transformContetnsArr(newCurrentChat.chatContents);
      const chat = model.startChat(body);
      const requestPromptbody: any[] = [];
      await requestPrompt.forEach((i: any) => {
        requestPromptbody.push(i?.body ? i.body : i);
      });
      const result = await chat.sendMessageStream(requestPromptbody);

      for await (const chunk of result.stream) {
        if (stopStreamRef.current) {
          break;
        }
        const msgToken = chunk.text();
        const msgSlice = Math.floor(msgToken.length / msgSliceNum) > 0 ? Math.floor(msgToken.length / msgSliceNum) : 1;
        token = chunk.usageMetadata?.candidatesTokenCount ?? 0;

        for (let i = 0; i < msgToken.length; i += msgSlice) {
          if (stopStreamRef.current) {
            break;
          }

          const char = msgToken.slice(i, i + msgSlice);
          ct += char;
          handleNewChatArr(arr, ct, false);
          // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      if (!stopStreamRef.current) {
        newChatArr = handleNewChatArr(arr, ct, true);
      }
      serverLog(token);
      usingToken(modelName, token);
    } catch (error: any) {
      serverLog(error.response.usageMetadata.candidatesTokenCount, true);
      handleNewChatArr(arr, '*해당 질문에 답변할 수 없습니다.*', true);
    } finally {
      setIsResponsing(false);
      stopStreamRef.current = false;
    }

    try {
      // 채팅이름 설정
      if (getCurrentChat(newChatArr).chatContents[3]?.contents && getCurrentChat(newChatArr).chatName === '새로운 채팅이 시작되었습니다.') {
        const idx = newChatArr.findIndex((i: IChatArray) => i.chatId === currentChatId);
        let prompt = ``;
        prompt += getCurrentChat(newChatArr).chatContents.map((i: any) =>
          `${i.role}:${i.contents}\n`
        )
        const result = await model2.generateContentStream([prompt]);
        newChatArr = newChatArr.map((chat, index) =>
          index === idx ? { ...chat, chatName: '' } : chat
        );
        let chatName = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          chatName += chunkText;
          handleNewChatName(newChatArr, chatName, idx);
        }
        newChatArr = handleNewChatName(newChatArr, chatName, idx);
      }
    } catch {
      const idx = newChatArr.findIndex((i: IChatArray) => i.chatId === currentChatId);
      handleNewChatName(newChatArr, '새로운 채팅이 시작되었습니다.', idx);
    }
  }

  const handleContentsDone = () => {
    const tempArr: IChatArray[] = chatArr.map((chat: IChatArray) => ({
      ...chat,
      chatContents: chat.chatContents.map(content => ({
        ...content,
        contents: content.done ? content.contents : `${content.contents} ...***(중단됨)***`,
        done: true
      }))
    }));

    setChatArr(tempArr);
  }

  const stopStream = () => {
    stopStreamRef.current = true;
  }

  useEffect(() => {
    getLocalStorageArr();
  }, [])

  // 텍스트가 입력 되었을 때
  useEffect(() => {
    if (chatArr.findIndex((i: IChatArray) => i.chatId === currentChatId) >= 0 && requestPrompt[0]) {
      setIsResponsing(true);
    }
  }, [requestPrompt]);

  useEffect(() => {
  }, [stopStreamRef.current])

  useEffect(() => {
    if (isResponsing && requestPrompt) {
      stopStreamRef.current = false;
      addUserMessage();
      setRequestPrompt('');
    }
    if (!isResponsing) {
      stopStream();
    }
  }, [isResponsing])

  useEffect(() => {
    if (chatArr.length > 0) {
      saveChatFull(chatArr);
    }
  }, [chatArr])

  useEffect(() => {
    if (currentChatId !== undefined && chatArr.length > 0) {
      handleContentsDone();
    }
  }, [currentChatId])
}
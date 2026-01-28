import {
  chatArrState,
  currentChatIdState,
  isResponsingState,
  requestPromptState,
} from "@/atoms/chatAI";
import {
  modelArr,
} from "@/constants/chat";
import { IChatArray, IChatContents } from "@/types/chat";
import {
  removeTrailingNewlines,
  saveChatFull,
} from "@/utils/chat";
import { sendMessageStream, generateChatTitle } from "@/utils/openrouter";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const defaultChatContents: IChatArray = {
  chatId: 0,
  chatName: "새로운 채팅이 시작되었습니다.",
  chatContents: [],
  chatDate: new Date(),
};

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
  };

  const getLocalStorageArr = () => {
    const storage = localStorage.getItem("AIChat_full");

    if (storage) {
      const parsedStorage = JSON.parse(storage);
      // attachedFiles가 올바른 형식인지 검증하고, 그렇지 않은 경우 제거
      const validatedStorage = parsedStorage.map((chat: IChatArray) => {
        return {
          ...chat,
          chatContents: chat.chatContents.map(content => {
            // attachedFiles가 배열이고 각 항목이 uri와 name 속성을 가진 객체인지 확인
            if (content.attachedFiles && Array.isArray(content.attachedFiles)) {
              const validAttachedFiles = content.attachedFiles.filter(file =>
                file && typeof file === 'object' &&
                typeof file.uri === 'string' &&
                typeof file.name === 'string'
              );
              return { ...content, attachedFiles: validAttachedFiles };
            }
            return content;
          })
        };
      });
      setChatArr(validatedStorage.length > 0 ? validatedStorage : [defaultChatContents]);
    } else {
      setChatArr([defaultChatContents]);
    }
  };

  const handleNewChatArr = (arr: IChatArray[], ct: string, loading: boolean) => {
    const newCurrentChat: IChatArray = getCurrentChat(arr);
    const userMessageIndex = newCurrentChat.chatContents.length - 2;
    const assistantMessageIndex = newCurrentChat.chatContents.length - 1;

    const textContent = typeof requestPrompt[0] === 'string' ? requestPrompt[0] : '';
    const attachedFiles: any[] = requestPrompt.filter((item: any) => typeof item !== 'string');
    const userMessage = { ...newCurrentChat.chatContents[userMessageIndex], contents: textContent, attachedFiles };
    const assistantMessage = { ...newCurrentChat.chatContents[assistantMessageIndex], contents: ct, done: !loading };

    const newChatContents = [...newCurrentChat.chatContents];
    newChatContents.splice(userMessageIndex, 1, userMessage);
    newChatContents.splice(assistantMessageIndex, 1, assistantMessage);

    const newChatArr = arr.map((chat) =>
      chat.chatId === currentChatId
        ? { ...chat, chatContents: newChatContents, chatDate: new Date() }
        : chat
    );

    setChatArr(newChatArr);
    saveChatFull(newChatArr);

    return [...newChatArr];
  };

  const handleNewChatName = (arr: IChatArray[], ct: string, idx: number) => {
    const newChatArr = arr.map((chat, index) =>
      index === idx ? { ...chat, chatName: removeTrailingNewlines(ct) } : chat
    );
    setChatArr(newChatArr);
    saveChatFull(newChatArr);

    return newChatArr;
  };

  // 채팅 이름을 자동으로 설정하는 함수
  const updateChatNameIfNeeded = async (arr: IChatArray[], chatId: number, assistantResponse: string) => {
    const chatIndex = arr.findIndex(chat => chat.chatId === chatId);
    if (chatIndex !== -1) {
      const chat = arr[chatIndex];
      // 채팅 이름이 기본 이름인 경우에만 업데이트
      if (chat.chatName === '새로운 채팅이 시작되었습니다.' || chat.chatName === '새로운 채팅') {

        const completedAssistantMessages = chat.chatContents.filter(content => content.role === 'assistant' && content.done && content.contents !== "").length;

        // 두 번째 AI 응답까지 완료되었을 때 제목 생성 (즉, 사용자 메시지 2개, AI 응답 2개 이상 완료)
        if (completedAssistantMessages >= 2) {
          try {
            // OpenRouter API를 사용하여 채팅 제목 생성
            const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";
            const newChatName = await generateChatTitle(chat.chatContents, apiKey, modelName);

            handleNewChatName(arr, newChatName, chatIndex);
          } catch (error) {
            // API 호출 실패 시 기존 로직 사용
            const newChatName = assistantResponse.trim().substring(0, 15);
            const fallbackChatName = assistantResponse.trim().length <= 15
              ? newChatName
              : `${newChatName}...`;

            handleNewChatName(arr, fallbackChatName, chatIndex);
          }
        }
      }
    }
  };

  const handleRequest = async (arr: IChatArray[]) => {
    let ctStr = "";
    // OpenRouter API 키 사용
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";

    try {
      const newCurrentChat: IChatArray = getCurrentChat(arr);

      // OpenRouter API 호출을 위해 채팅 내역을 그대로 사용
      const chatHistory = newCurrentChat.chatContents;

      // OpenRouter 스트리밍 호출
      await sendMessageStream(
        chatHistory,
        apiKey,
        modelName,
        (chunk: string) => {
          // 청크 데이터를 처리하여 UI 업데이트
          ctStr += chunk;

          // UI 업데이트를 위해 handleNewChatArr 호출
          handleNewChatArr(arr, ctStr, true);
        },
        (_fullResponse: string) => {
          // 완료 시 처리

        }
      );

      // 응답 완료 후 처리
      const updatedArr = handleNewChatArr(arr, ctStr, false);

      // 채팅 이름 자동 설정 - 현재 채팅의 이름이 기본 이름인 경우에만 업데이트
      updateChatNameIfNeeded(updatedArr, currentChatId, ctStr).catch(_error => {
      });
    } catch (error: any) {
      // 오류 발생 시 채팅에 오류 메시지 추가
      const newCurrentChat: IChatArray = getCurrentChat(arr);
      const userMessageIndex = newCurrentChat.chatContents.length - 2;
      const assistantMessageIndex = newCurrentChat.chatContents.length - 1;

      const textContent = typeof requestPrompt[0] === 'string' ? requestPrompt[0] : '';
      const attachedFiles = requestPrompt.filter((item: any) => typeof item !== 'string');
      const userMessage = { ...newCurrentChat.chatContents[userMessageIndex], contents: textContent, attachedFiles };
      const errorMessage: IChatContents = {
        role: 'assistant',
        contents: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.",
        done: true
      };

      const newChatContents = [...newCurrentChat.chatContents];
      newChatContents.splice(userMessageIndex, 1, userMessage);
      newChatContents.splice(assistantMessageIndex, 1, errorMessage);

      const newChatArr = arr.map((chat) =>
        chat.chatId === currentChatId
          ? { ...chat, chatContents: newChatContents, chatDate: new Date() }
          : chat
      );

      setChatArr(newChatArr);
      saveChatFull(newChatArr);

      // 오류 발생 시에도 채팅 이름 자동 설정 시도
      updateChatNameIfNeeded(newChatArr, currentChatId, "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.");
    } finally {
      // 응답 완료 상태로 변경
      setIsResponsing(false);
    }
  };

  const handleNewChat = (arr: IChatArray[]) => {
    const newChatArr = [
      ...arr,
      {
        chatId: arr.length > 0 ? Math.max(...arr.map((i) => i.chatId)) + 1 : 0,
        chatName: "새로운 채팅",
        chatContents: [],
        chatDate: new Date(),
      },
    ];

    setChatArr(newChatArr);
    saveChatFull(newChatArr);

    return newChatArr;
  };

  const addUserMessage = () => {
    const newChatArr = [...chatArr];
    const currentChatIdx = newChatArr.findIndex((i) => i.chatId === currentChatId);

    if (currentChatIdx < 0) {
      const tempArr = handleNewChat(newChatArr);
      const newCurrentChatIdx = tempArr.findIndex((i) => i.chatId === currentChatId);

      const textContent = typeof requestPrompt[0] === 'string' ? requestPrompt[0] : '';
      const attachedFiles = requestPrompt.filter((item: any) => typeof item !== 'string');
      tempArr[newCurrentChatIdx].chatContents = [
        ...tempArr[newCurrentChatIdx].chatContents,
        { role: "user", contents: textContent, attachedFiles, done: true },
        { role: "assistant", contents: "", done: false },
      ];

      setChatArr(tempArr);
      saveChatFull(tempArr);
      handleRequest(tempArr);
    } else {
      const textContent = typeof requestPrompt[0] === 'string' ? requestPrompt[0] : '';
      const attachedFiles = requestPrompt.filter((item: any) => typeof item !== 'string');
      newChatArr[currentChatIdx] = {
        ...newChatArr[currentChatIdx],
        chatContents: [
          ...newChatArr[currentChatIdx].chatContents,
          { role: "user", contents: textContent, attachedFiles, done: true },
          { role: "assistant", contents: "", done: false },
        ],
      };

      setChatArr(newChatArr);
      saveChatFull(newChatArr);
      handleRequest(newChatArr);
    }
  };

  const handleContentsDone = () => {
    const tempArr: IChatArray[] = chatArr.map((chat: IChatArray) => ({
      ...chat,
      chatContents: chat.chatContents.map((content) => ({
        ...content,
        contents: content.done ? content.contents : `${content.contents} ...***(중단됨)***`,
        done: true,
      })),
    }));

    setChatArr(tempArr);
  };

  const stopStream = () => {
    stopStreamRef.current = true;
  };

  useEffect(() => {
    getLocalStorageArr();
  }, []);

  useEffect(() => {
    if (
      chatArr.findIndex((i: IChatArray) => i.chatId === currentChatId) >= 0 &&
      requestPrompt[0]
    ) {
      setIsResponsing(true);
    }
  }, [requestPrompt]);

  useEffect(() => {
    if (isResponsing && requestPrompt) {
      stopStreamRef.current = false;
      addUserMessage();
      setRequestPrompt([]);
    }
    if (!isResponsing) {
      stopStream();
    }
  }, [isResponsing]);

  useEffect(() => {
    if (chatArr.length > 0) {
      saveChatFull(chatArr);
    }
  }, [chatArr]);

  useEffect(() => {
    if (currentChatId !== undefined && chatArr.length > 0) {
      handleContentsDone();
    }
  }, [currentChatId]);
};

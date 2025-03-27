import {
  chatArrState,
  currentChatIdState,
  isResponsingState,
  requestPromptState,
} from "@/atoms/chatAI";
import {
  modelArr,
  msgSliceNum,
  safetySettings,
} from "@/constants/chat";
import { apiPost } from "@/services/api";
import { IChatArray, IChatContents, IChatContentsType } from "@/types/chat";
import {
  getToken,
  removeTrailingNewlines,
  saveChatFull,
  transformContetnsArr,
  usingToken,
} from "@/utils/chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
      setChatArr(parsedStorage.length > 0 ? parsedStorage : [defaultChatContents]);
    } else {
      setChatArr([defaultChatContents]);
    }
  };

  const addUserMessage = () => {
    const attachedFilesArr: any[] = [];
    requestPrompt.slice(1).forEach((i: any) => {
      attachedFilesArr.push(i.origin);
    });

    const newChatContents: IChatContents[] = [
      {
        role: "user",
        contents: requestPrompt[0],
        attachedFiles: attachedFilesArr,
        done: false,
      },
      {
        role: "assistant",
        contents: [],
        done: false,
      },
    ];
    newChatContents.unshift(...getCurrentChat(chatArr).chatContents);

    const newChatArr = chatArr.map((chat) =>
      chat.chatId === currentChatId
        ? { ...chat, chatContents: newChatContents, chatDate: new Date() }
        : chat
    );

    setChatArr(newChatArr);

    try {
      handleRequest(newChatArr);
    } catch (error: any) {
      if (error.status === 500) handleRequest(newChatArr);
    }
  };

  const serverLog = async (usedToken: number, error?: boolean) => {
    await apiPost("/api/log/chat", {
      chat: requestPrompt[0],
      totalToken: getToken(modelName),
      usedToken,
      error,
    });
  };

  const handleNewChatArr = (
    arr: IChatArray[],
    ct: IChatContentsType,
    complete: boolean
  ) => {
    const newCurrentChat: IChatArray = getCurrentChat(arr);

    const attachedFilesArr: any[] = [];
    if (Array.isArray(requestPrompt)) {
      requestPrompt.slice(1).forEach((i: any) => {
        attachedFilesArr.push(i.origin);
      });
    }

    const userMessage: IChatContents = {
      role: "user",
      contents: requestPrompt[0],
      attachedFiles: attachedFilesArr,
      done: complete,
    };

    const assistantMessage: IChatContents = {
      role: "assistant",
      contents: ct,
      done: complete,
    };

    const newChatContents: IChatContents[] = [
      ...newCurrentChat.chatContents.slice(0, -2),
      userMessage,
      assistantMessage,
    ];

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

  const handleRequest = async (arr: IChatArray[]) => {
    let ctStr = "";
    let token = 0;
    let newChatArr: IChatArray[] = [];
    const imageArr: IChatContentsType = [];
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

    const chatConfig: any = {
      model: modelName,
      safetySettings,
    };
    const chatConfig2: any = {
      model: modelName,
      systemInstruction:
        "너는 이제부터 대화의 내용을 보고 대화의 주제를 종결어미를 제외하고 말해야 돼.",
    };

    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel(chatConfig);
    const model2 = gemini.getGenerativeModel(chatConfig2);

    try {
      const newCurrentChat: IChatArray = getCurrentChat(arr);
      const body = transformContetnsArr(newCurrentChat.chatContents);

      const chat = model.startChat(body);

      const requestPromptBody: any[] = Array.isArray(requestPrompt)
        ? requestPrompt.map((i: any) => (i?.body ? i.body : i))
        : [];

      const result = await chat.sendMessageStream(requestPromptBody);

      for await (const chunk of result.stream) {
        if (stopStreamRef.current) break;

        token = chunk.usageMetadata?.candidatesTokenCount ?? 0;
        const candidates = chunk.candidates || [];

        for (const candidate of candidates) {
          const parts = candidate.content?.parts || [];

          for (const part of parts) {
            if (stopStreamRef.current) break;

            if (part.text) {
              const msgToken = String(part.text);
              const msgSlice = Math.floor(msgToken.length / msgSliceNum) > 0 ? Math.floor(msgToken.length / msgSliceNum) : 1;

              for (let i = 0; i < msgToken.length; i += msgSlice) {
                const char = msgToken.slice(i, i + msgSlice);
                ctStr += char;
                handleNewChatArr(arr, ctStr, false);
                // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
                await new Promise(resolve => setTimeout(resolve, 1));
              }
            }

            if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
              const base64Image = part.inlineData.data;
              const mime = part.inlineData.mimeType;
              const imageUrl = `data:${mime};base64,${base64Image}`;
              imageArr.push({ mimeType: part.inlineData.mimeType, data: imageUrl });
            }
          }
        }

        const finalContent =
          imageArr.length > 0 ? [ctStr, ...imageArr] : ctStr;

        handleNewChatArr(arr, finalContent, false);
        // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 1));
      }

      if (!stopStreamRef.current) {
        const finalContent =
          imageArr.length > 0 ? [ctStr, ...imageArr] : ctStr;

        newChatArr = handleNewChatArr(arr, finalContent, true);
      }

      serverLog(token);
      usingToken(modelName, token);
    } catch (error: any) {
      console.log(error);
      serverLog(error.response?.usageMetadata?.candidatesTokenCount ?? 0, true);
      handleNewChatArr(arr, "*해당 질문에 답변할 수 없습니다.*", true);
    } finally {
      setIsResponsing(false);
      stopStreamRef.current = false;
    }

    try {
      const current = getCurrentChat(newChatArr);
      if (
        current.chatContents[3]?.contents &&
        current.chatName === "새로운 채팅이 시작되었습니다."
      ) {
        const idx = newChatArr.findIndex(
          (i: IChatArray) => i.chatId === currentChatId
        );

        const prompt = current.chatContents
          .map((i: any) =>
            `${i.role}:${typeof i.contents === "string" ? i.contents : "[이미지]"
            }\n`
          )
          .join("");

        const result = await model2.generateContentStream([prompt]);

        let chatName = "";
        for await (const chunk of result.stream) {
          chatName += chunk.text();
          handleNewChatName(newChatArr, chatName, idx);
        }

        newChatArr = handleNewChatName(newChatArr, chatName, idx);
      }
    } catch {
      const idx = newChatArr.findIndex(
        (i: IChatArray) => i.chatId === currentChatId
      );
      handleNewChatName(newChatArr, "새로운 채팅이 시작되었습니다.", idx);
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

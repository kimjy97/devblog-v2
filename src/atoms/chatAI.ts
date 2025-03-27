import { IAttachedFilePreview } from "@/containers/AIChatFull/InputPrompt";
import { IChatArray } from "@/types/chat";
import { atom } from "recoil";

export const currentChatIdState = atom<number>({
  key: 'currentChatIdState',
  default: -1,
});

export const requestPromptState = atom<any>({
  key: 'requestPromptState',
  default: [],
});

export const chatArrState = atom<IChatArray[]>({
  key: 'chatArrState',
  default: [],
});

export const isResponsingState = atom<boolean>({
  key: 'isResponsingState',
  default: false,
});

export const attachedFileState = atom<any[]>({
  key: 'attachedFileState',
  default: [],
});

export const attachedFilePreviewState = atom<IAttachedFilePreview[]>({
  key: 'attachedFilePreviewState',
  default: [],
});

export const audioUrlState = atom<string>({
  key: 'audioUrlState',
  default: '',
});
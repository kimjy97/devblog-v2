import { atom } from "recoil";

export const modelTypeState = atom<number>({
  key: 'modelTypeState',
  default: 0,
});

export const isSendingState = atom<boolean>({
  key: 'isSendingState',
  default: false,
});

export const chatInputState = atom<string>({
  key: 'chatInputState',
  default: '',
});

export const chatNameTooltipInfoState = atom<any>({
  key: 'chatNameTooltipInfoState',
  default: undefined,
})
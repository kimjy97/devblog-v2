import { atom } from "recoil";

export const blacklistReasonState = atom<string>({
  key: 'blacklistReasonState',
  default: '잠시후 다시 시도해주세요.',
})
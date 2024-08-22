import { atom } from "recoil";

export const chatItemDeleteModalState = atom<any>({
  key: 'chatItemDeleteModalState',
  default: undefined,
});

export const chatItemRenameModalState = atom<any>({
  key: 'chatItemRenameModalState',
  default: undefined,
});
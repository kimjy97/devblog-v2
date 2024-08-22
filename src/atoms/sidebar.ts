import { atom } from "recoil";

export const sidebarToggleState = atom<boolean>({
  key: 'sidebarToggleState',
  default: false,
});

export const isSidebarState = atom<boolean>({
  key: 'isSidebarState',
  default: true,
});

export const isAIChatMenuToggleState = atom<boolean>({
  key: 'isAIChatMenuToggleState',
  default: false,
});

export const searchPostState = atom<string>({
  key: 'searchPostState',
  default: '',
});
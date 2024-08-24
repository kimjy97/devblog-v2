import { CSSProperties } from "react";
import { atom } from "recoil";

export const fixedButtonConfigState = atom<CSSProperties | undefined>({
  key: 'fixedButtonConfigState',
  default: undefined,
});

export const isFullPlageState = atom<boolean>({
  key: 'isFullPlageState',
  default: false,
});

export const overlayState = atom<boolean>({
  key: 'overlayState',
  default: false,
});
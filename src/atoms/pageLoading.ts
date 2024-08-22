import { atom } from "recoil";

export const pageLoadingState = atom({
  key: 'pageLoadingState',
  default: true,
});

export const routeLoadingState = atom({
  key: 'routeLoadingState',
  default: false,
});
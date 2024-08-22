import { atom } from "recoil";

export const guestbookCommentState = atom({
  key: 'guestbookCommentState',
  default: undefined,
});

export const guestbookVisitState = atom<any>({
  key: 'guestbookVisitState',
  default: undefined,
});
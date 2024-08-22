import { IPost } from "@/models/Post";
import { atom } from "recoil";

export const postInfoState = atom<IPost | undefined>({
  key: 'postInfoState',
  default: undefined,
});

export const postsByBoardState = atom({
  key: 'postsByBoardState',
  default: undefined,
})
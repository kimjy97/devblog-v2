import { IToastList } from "@type/toast";
import { atom } from "recoil";

export const ToastListState = atom<IToastList[] | []>({
  key: "ToastListState",
  default: [],
});

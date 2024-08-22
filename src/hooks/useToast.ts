import { useCallback, useRef } from "react";
import { useRecoilState } from "recoil";

import { ToastListState } from "@atoms/toast";

interface IProps {
  type?: number;
  value: string;
  icon?: any;
  delay?: number;
}

const useToast = () => {
  const [toastList, setToastList] = useRecoilState(ToastListState);
  const keynumRef = useRef(0);

  /** 토스트 추가 */
  const addToast = useCallback(({ type = 0, value, icon, delay = 2000 }: IProps) => {
    setToastList(prev => [...prev, {
      key: keynumRef.current,
      type,
      value,
      icon,
      delay,
      isExiting: false,
    }]);

    keynumRef.current += 1;
  }, [setToastList]);

  /** 해당 토스트 삭제 */
  const removeToast = useCallback((key: number) => {
    setToastList((prev) => prev.filter((toast) => toast.key !== key));
  }, [setToastList]);

  return { toastList, addToast, removeToast };
};

export default useToast;
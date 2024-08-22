import { fixedButtonConfigState } from "@/atoms/layout";
import { isSidebarState } from "@/atoms/sidebar";
import { CSSProperties, useEffect } from "react";
import { useRecoilState } from "recoil";

type OverflowType = 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip';

export const useLayout = () => {
  const [, setFixedButtonConfigRecoil] = useRecoilState(fixedButtonConfigState);
  const [, setIsSidebar] = useRecoilState(isSidebarState);

  const setFixedButtonConfig = (config: CSSProperties | undefined) => {
    setFixedButtonConfigRecoil(config);
  }
  const setOverflowX = (str: OverflowType) => {
    if (typeof document !== 'undefined') document.body.style.overflowX = str;
  }
  const setOverflowY = (str: OverflowType) => {
    if (typeof document !== 'undefined') document.body.style.overflowY = str;
  }
  const setOverflow = (str: OverflowType) => {
    if (typeof document !== 'undefined') document.body.style.overflow = str;
  }

  useEffect(() => {
  }, [])

  return { setFixedButtonConfig, setOverflowX, setOverflowY, setOverflow, setIsSidebar }
}
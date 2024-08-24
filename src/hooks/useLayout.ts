import { isStaticHeaderState } from "@/atoms/haeder";
import { fixedButtonConfigState, isFullPlageState } from "@/atoms/layout";
import { isSidebarState } from "@/atoms/sidebar";
import { CSSProperties, useLayoutEffect } from "react";
import { useRecoilState } from "recoil";

type OverflowType = 'hidden' | 'auto' | 'visible' | 'scroll' | 'clip';

interface ILayoutConfig {
  overflow?: OverflowType;
  overflowX?: OverflowType;
  overflowY?: OverflowType;
  fixedButton?: CSSProperties | undefined;
  isSidebar?: boolean;
  isStaticHeader?: boolean;
  fullPage?: boolean;
}

export const useLayout = (config?: ILayoutConfig) => {
  const [, setFixedButtonConfigRecoil] = useRecoilState(fixedButtonConfigState);
  const [, setIsSidebar] = useRecoilState(isSidebarState);
  const [, setIsStaticHeader] = useRecoilState(isStaticHeaderState);
  const [, setIsFullPage] = useRecoilState(isFullPlageState);

  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = config?.overflow ?? 'initial';
      document.documentElement.style.overflowX = config?.overflowX ?? 'initial';
      document.documentElement.style.overflowX = config?.overflowY ?? 'initial';
    }
    setFixedButtonConfigRecoil(config?.fixedButton ?? { display: 'flex' });
    setIsSidebar(config?.isSidebar ?? true);
    setIsStaticHeader(config?.isStaticHeader ?? false);
    setIsFullPage(config?.fullPage ?? false);
  }, [])
}
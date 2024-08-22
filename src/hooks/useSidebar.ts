import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { isSidebarState } from "@/atoms/sidebar";

/** 사이드바 유무 적용 */
const useSidebar = (bool: boolean) => {
  const [, setIsSidebar] = useRecoilState(isSidebarState);

  useEffect(() => {
    setIsSidebar(bool);
  }, [bool, setIsSidebar]);

  return bool;
}

export default useSidebar;
'use client'

import { useLayout } from "@/hooks/useLayout";
import useSidebar from "@/hooks/useSidebar";
import { useLayoutEffect } from "react";

const PageLayout = (): null => {
  const { setFixedButtonConfig, setOverflow } = useLayout();
  useSidebar(true);

  useLayoutEffect(() => {
    setFixedButtonConfig({ display: 'flex' });
    setOverflow('visible');
  }, [])

  return null
}

export default PageLayout;
'use client'

import { useLayout } from "@/hooks/useLayout";

const PageLayout = (): null => {
  useLayout({
    fixedButton: { display: 'flex' },
  });

  return null
}

export default PageLayout;
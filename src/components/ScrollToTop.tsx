"use client";

import { useEffect } from 'react';
import { Router } from 'next/router';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    window.scrollTo(0, 0);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [pathname]);

  return null;
}

export default ScrollToTop;
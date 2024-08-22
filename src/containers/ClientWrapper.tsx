'use client'

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { routeLoadingState } from '@/atoms/pageLoading';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const setIsRouteLoading = useSetRecoilState(routeLoadingState);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsRouteLoading(true);
      setTimeout(() => setIsRouteLoading(false), 400);
    };

    if (!searchParams.get('tag')) {
      handleRouteChange();
    } else {
      setTimeout(() => setIsRouteLoading(false), 400);
    }
  }, [pathname, searchParams, setIsRouteLoading]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      // 새 탭에서 링크를 열거나, 새 창으로 열 때 사용하는 키 체크
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin) && !anchor.target && !anchor.download) {
        const currentURL = new URL(window.location.href);
        const clickedURL = new URL(anchor.href);

        const currentPath = currentURL.pathname;
        const clickedPath = clickedURL.pathname;

        const currentParams = new URLSearchParams(currentURL.search);
        const clickedParams = new URLSearchParams(clickedURL.search);

        // 'tag' 파라미터를 제외한 나머지 파라미터들을 비교
        currentParams.delete('tag');
        clickedParams.delete('tag');

        if (clickedPath !== currentPath || currentParams.toString() !== clickedParams.toString()) {
          setIsRouteLoading(true);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, setIsRouteLoading]);

  return children;
}

export default ClientWrapper;
import type { Metadata } from "next";
import "@styles/variable.scss"
import "@styles/globals.scss"
import StyledComponentsRegistry from "@lib/registry";
import Header from "@containers/Header";
import Sidebar from "@containers/Sidebar";
import Contents from "@containers/Contents";
import PageLoading from "@containers/PageLoading";
import Script from "next/script";
import RecoilRootWrapper from "@containers/RecoilRootWrapper";
import Toast from "@components/Toast";
import ScrollToTop from "@/components/ScrollToTop";
import FixedButton from "@/containers/FixedButton";
import Modals from "@/containers/Modals";
import ClientWrapper from "@/containers/ClientWrapper";
import RouteLoading from "@/containers/RouteLoading";
import { defaultMeta } from "@/constants/meta";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: defaultMeta.title,
  description: defaultMeta.description,
  icons: {
    icon: [
      { rel: 'icon', type: 'image/png', url: '/meta/fav/fav.png' },
    ],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const codeToRunOnClient = `(function() {
    const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const localTheme = localStorage.getItem('theme');

    console.clear();

    if(localTheme === null) {
      document.documentElement.setAttribute("data-theme", osTheme);
      localStorage.setItem('theme', osTheme);
    } else document.documentElement.setAttribute("data-theme", localTheme);
  })();
  `;

  const devToolBlock = `
  (function() {
    const isProduction = ${process.env.NODE_ENV === 'production'};
    if (isProduction) {
      function detectDevTool(allow) {
        if(isNaN(+allow)) allow = 100;
        var start = +new Date();
        debugger;
        var end = +new Date();
        if(isNaN(start) || isNaN(end) || end - start > allow) {
        }
      }

      function preventDevTools(event) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
        if (
          event.keyCode === 123 ||
          (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)) ||
          (event.ctrlKey && event.keyCode === 85)
        ) {
          event.preventDefault();
          return false;
        }
      }

      // 키 이벤트 리스너 추가
      document.addEventListener('keydown', preventDevTools);

      function preventDevTools(event) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
        if (
          event.keyCode === 123 ||
          (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)) ||
          (event.ctrlKey && event.keyCode === 85)
        ) {
          event.preventDefault();
          return false;
        }
      }

      document.addEventListener('keydown', preventDevTools);

      if(window.attachEvent) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
          detectDevTool();
          window.attachEvent('onresize', detectDevTool);
          window.attachEvent('onmousemove', detectDevTool);
          window.attachEvent('onfocus', detectDevTool);
          window.attachEvent('onblur', detectDevTool);
        } else {
          setTimeout(argument.callee, 0);
        }
      } else {
        window.addEventListener('load', detectDevTool);
        window.addEventListener('resize', detectDevTool);
        window.addEventListener('mousemove', detectDevTool);
        window.addEventListener('focus', detectDevTool);
        window.addEventListener('blur', detectDevTool);
      }
    }
  })();
  `

  return (
    <html lang="ko" data-theme='dark'>
      <body>
        <Script id="client-side-code" dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
        <Suspense fallback={<div>Loading...</div>}>
          <RecoilRootWrapper>
            <StyledComponentsRegistry>
              <ClientWrapper>
                <ScrollToTop />
                <Contents>
                  <Sidebar />
                  {children}
                </Contents>
                <Header />
                <FixedButton />
                <Modals />
                <Toast />
                <RouteLoading />
                <PageLoading />
              </ClientWrapper>
            </StyledComponentsRegistry>
          </RecoilRootWrapper>
          <Script id="dev-tool-detector" strategy="afterInteractive">
            {devToolBlock}
          </Script>
        </Suspense>
      </body>
    </html>
  );
}

export default RootLayout;
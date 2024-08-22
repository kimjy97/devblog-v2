'use client'

import { useEffect, useRef, useState } from "react"
import styled, { keyframes } from "styled-components"
import { AvantGarde, Pretendard } from "../../../public/fonts";
import HeaderMenuList from "@containers/Header/HeaderMenuList";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "@public/images/Logo.png"
import IconHamburger from '@public/svgs/hamburger.svg'
import { INDEX_HEADER } from "@constants/zIndex";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAIChatMenuToggleState, sidebarToggleState } from "@atoms/sidebar";
import { useHeader } from "@/hooks/useHeader";
import { usePathname, useRouter } from "next/navigation";
import { IHeaderMenu, headerMenuArr } from "@/constants/header";
import { isStaticHeaderState } from "@/atoms/haeder";
import { apiPost } from "@/services/api";
import { blacklistReasonState } from "@/atoms/blocked";

const Header = () => {
  const headerRef = useRef(null);
  const isStaticHeader = useRecoilValue(isStaticHeaderState);
  const [sidebarToggle, setSidebarToggle] = useRecoilState<boolean>(sidebarToggleState);
  const [isAIChatMenuToggle, setIsAIChatMenuToggle] = useRecoilState(isAIChatMenuToggleState);
  const [, setBlacklistReason] = useRecoilState(blacklistReasonState);
  const [logoName, setLogoName] = useState<string>('');
  const [url, setUrl] = useState<string>('/');
  const router = useRouter();
  const pathname = usePathname();
  const visible = useHeader();
  const containerClass = isStaticHeader ? 'static' : visible ? 'fixed' : '';

  const handleClickHamburger = () => {
    switch (pathname) {
      case '/chat':
        setIsAIChatMenuToggle(!isAIChatMenuToggle);
        break;
      default:
        setSidebarToggle(!sidebarToggle);
    }
  }

  const getView = async () => {
    await apiPost('/api/log/visit', {
      pathname,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).catch((error) => {
      if (error.status === 403 && pathname !== '/guard') {
        setBlacklistReason(error.message);
        router.replace('/guard');
      }
    });
  }

  useEffect(() => {
    const currentMenu = headerMenuArr.find((i: IHeaderMenu) => {
      if (i.slug) {
        const split = pathname.split('/');
        return `/${split[split.length - 2]}` === i.url;
      }
      return i.url === pathname;
    })
      ?? { logoUrl: '/', url: '', logoName: 'PLAYGROUND' };
    if (currentMenu) {
      setLogoName(currentMenu.logoName);
      setUrl(currentMenu.logoUrl);
    }

    getView();

  }, [pathname]);

  return pathname !== '/guard' ? (
    <Container className={containerClass} ref={headerRef}>
      <Wrapper className={AvantGarde.className}>
        <Side id='logoWrapper'>
          <Link href={url} replace>
            <Logo className={Pretendard.className}>
              <Image id='logo' src={LogoImg} alt='logo' />
              <p>{logoName}</p>
            </Logo>
          </Link>
        </Side>
        <Side id='menuWrapper'>
          <MenuWrapper className={Pretendard.className}>
            {headerMenuArr.map((i: IHeaderMenu, idx: number) => i.menu &&
              <HeaderMenuList
                key={idx}
                name={i.name}
                url={i.url}
              />
            )}
          </MenuWrapper>
        </Side>
      </Wrapper>
      <Wrapper className={AvantGarde.className}>
        <Hamburger onClick={handleClickHamburger}>
          <HamburgerIcon width={22} height={22} />
        </Hamburger>
        <Center>
          <Link href={url} replace>
            <Logo className={Pretendard.className}>
              <Image id='logo' src={LogoImg} alt='logo' />
              <p>{logoName}</p>
            </Logo>
          </Link>
        </Center>
        <Side id='menuWrapper' />
      </Wrapper>
    </Container>
  ) : null
}

export default Header;

const SlideDownAni = keyframes`
  100% {
    top: 0px;
    opacity: 1;
  }
`
const Container = styled.header`
  position: absolute;
  top: 0px;
  left: 10px;
  width: calc(100% - 10px);
  height: calc(var(--header-height) + 1rem);

  background: var(--bg-header2);
  border-bottom-left-radius: 26px;
  border-bottom-right-radius: 26px;

  z-index: ${INDEX_HEADER};

  transition: background 700ms cubic-bezier(0.19, 1, 0.22, 1), height 150ms;

  &.fixed {
    position: fixed;
    top: calc(-1 * var(--header-height));
    width: calc(100% - 10px);
    height: calc(var(--header-height) + 0.5rem);

    box-shadow: var(--bg-header-boxshadow);
    background: var(--bg-header1);
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(40px);
    opacity: 0;

    will-change: opacity;
    animation: ${SlideDownAni} 400ms forwards cubic-bezier(0.19, 1, 0.22, 1);
    transition: width 400ms, padding-left 150ms, right 400ms;
  }

  &.static {
    position: fixed !important;
  }
  
  &>div:nth-child(2) {
    display: none;
  }

  @media (max-width: 1280px) {
    height: calc(var(--header-height) + 0.5rem);
    &.fixed {
      width: 100%;
      right: auto;
      left: 0px;
      padding-left: 10px;
    }
    &>div:nth-child(1) {
      display: none;
    }
    &>div:nth-child(2) {
      display: flex;
    }
  }
`
const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 0 16px;

  box-sizing: border-box;

  @media (max-width: 1280px) {
    padding-right: 0px;
    padding-left: 0px;
  }
`
const Side = styled.div`
  display: flex;
  align-items: center;

  &>a {
    height: 100%;
  }
`
const Center = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;

  &>a {
    height: 100%;
  }
`
const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;

  cursor: pointer;
  transition: color 150ms, margin-left 200ms;

  &>#logo {
    width: auto;
    height: 36%;
  }

  &>p {
    color: var(--text-normal);
    font-weight: 800;
    font-size: 1.25rem;
  }

  &:hover {
      margin-left: 5px;
  }

  @media (max-width: 1280px) {
    height: 100%;
    gap: 10px;

    &>#logo {
      height: 36%;
    }
    &>p {
      font-weight: 800;
      font-size: 1.25rem;
    }
    &:hover {
      margin-left: initial;
    }
  }

  @media (max-width: 768px) {
    &:hover {
      margin-left: 0px;
    }
  }
`
const MenuWrapper = styled.ul`
  display: flex;
  align-items: center;
  height: 100%;
  transition: 150ms;
  gap: 8px;
`
const HamburgerIcon = styled(IconHamburger)`
`
const Hamburger = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding: 16px;

  opacity: 0.4;
  cursor: pointer;
  z-index: 1;

  svg {
    filter: var(--filter-invert-reverse);

    transition: 150ms;
  }

  &:hover {
    opacity: 0.8;
  }
`


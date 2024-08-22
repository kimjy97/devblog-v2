'use client'

import styled from "styled-components";
import { Pretendard } from "../../public/fonts";
import IconWarning from "@public/svgs/warning1.svg";
import useSidebar from "@/hooks/useSidebar";
import { useStaticHeader } from "@/hooks/useHeader";
import { useLayout } from "@/hooks/useLayout";
import { useLayoutEffect } from "react";

const NotFound = () => {
  const { setFixedButtonConfig, setOverflow } = useLayout();
  useSidebar(false);
  useStaticHeader(true);

  useLayoutEffect(() => {
    setFixedButtonConfig({ display: 'none' });
    setOverflow('hidden');
  }, [])

  return (
    <Container className={Pretendard.className}>
      <Notice>
        <WarningIcon width={30} height={30} />
        <p>페이지를 찾을 수 없습니다.</p>
      </Notice>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-body);

  transition: 150ms;
`
const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  transition: 150ms;

  p{
    color: var(--text-normal);
    font-weight: 500;
    font-size: 1.2rem;

    transition: 150ms;
  }
`
const WarningIcon = styled(IconWarning)`
  * {
    transition: 150ms;
  }
  path {
    &:nth-child(1), &:nth-child(2) {
      stroke: #9392e2;
    }
    &:nth-child(3) {
      fill: #9392e2;
    }
  }
`



'use client'

import styled from "styled-components";
import IconWarning from "@public/svgs/warning1.svg";
import useSidebar from "@/hooks/useSidebar";
import { useStaticHeader } from "@/hooks/useHeader";
import { useLayout } from "@/hooks/useLayout";
import { useLayoutEffect } from "react";
import { Pretendard } from "@public/fonts";
import { useRecoilValue } from "recoil";
import { blacklistReasonState } from "@/atoms/blocked";

const NotFound = () => {
  const blacklistReason = useRecoilValue(blacklistReasonState);
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
        <WarningIcon width={60} height={60} />
        <TextWrapper>
          <p>페이지에 접근할 수 없습니다.</p>
          <p>{blacklistReason}</p>
        </TextWrapper>
      </Notice>
      <CustomerService>
        <p>본 페이지는 서버에 이상이 있거나 사용자의 이상행위가 있을 경우 노출되는 페이지입니다.</p>
        <p>문의 사항은 <b>poot972@gmail.com</b>으로 메일주세요.</p>
      </CustomerService>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  padding: 0 1.5em;

  background-color: var(--bg-body);

  transition: 150ms;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`
const Notice = styled.div`
  display: flex;
  gap: 1.625em;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2em;
    margin-bottom: 12.5rem;
  }
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75em;

  transition: 150ms;

  p{
    color: var(--text-normal);
    font-weight: 500;
    font-size: 1.75em;
    font-weight: 700;

    transition: 150ms;

    &:nth-child(2) {
      color: var(--text-red);
      font-size: 1em;
      font-weight: 500;
      opacity: 0.9;
    }
  }

  @media (max-width: 768px) {
    align-items: center;
  }
`
const WarningIcon = styled(IconWarning)`
  flex-shrink: 1;
  width: 3.75em;
  height: 3.75em;
  
  transition: 150ms;

  path {
    stroke: #9392e2;

    &:nth-child(3) {
      fill: #9392e2;
    }
  }

  @media (max-width: 768px) {
    width: 4em;
    height: 4em;
  }
`
const CustomerService = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  position: absolute;
  bottom: 3%;
  width: 100%;
  padding: 1.5em;
  
  color: var(--text-sub-dark);
  font-size: 0.875em;
  line-height: 1.5em;
  font-weight: 500;
  text-align: center;

  b {
    font-weight: 700;
  }
`
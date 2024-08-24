'use client'

import { isFullPlageState } from '@/atoms/layout';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

interface IProps {
  children: any,
}

const Contents = ({ children }: IProps): JSX.Element => {
  const isFullPage = useRecoilValue(isFullPlageState);

  return (
    <Container className={isFullPage ? 'fullPage' : ''}>
      {children}
    </Container>
  )
};

export default Contents;

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100%;
  
  transition: background-color 150ms;

  &.fullPage {
    position: fixed;
    height: 100%;
    overflow: hidden;
  }
`
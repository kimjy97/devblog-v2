'use client'

import styled from 'styled-components';

interface IProps {
  children: any,
}

const Contents = ({ children }: IProps): JSX.Element => {
  return (
    <Container>
      {children}
    </Container>
  )
};
export default Contents;


const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  background: var(--bg-body);

  transition: background-color 150ms;
`
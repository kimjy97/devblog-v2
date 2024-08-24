import { guestbookVisitState } from '@/atoms/guestbook';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const GuestBookTitle = (): JSX.Element => {
  const visitData = useRecoilValue(guestbookVisitState);

  return (
    <Container>
      <Title>방명록</Title>
      <SubTitle>오늘의 <span>{visitData?.visitorRank ?? 0}번째</span> 방문 감사합니다. 의견과 질문이 있다면 마음껏 남겨주세요!!</SubTitle>
    </Container>
  )
};

export default GuestBookTitle;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 0 1rem;
  padding-top: 2.625rem;
  margin-bottom: 3.375rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding-top: 1.25rem;
    margin-bottom: 2.25rem;
  }
`
const Title = styled.h1`
  font-size: 2.375rem;
  font-weight: 700;
  color: var(--color-blue);

  transition: 150ms;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`
const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-normal);
  text-align: center;

  transition: 150ms;

  &>span {
    color: var(--text-yellow);
    font-weight: 600;
  } 

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`


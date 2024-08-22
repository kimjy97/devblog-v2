import { guestbookVisitState } from '@/atoms/guestbook';
import { apiGet } from '@/services/api';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const GuestBookInfo = (): JSX.Element => {
  const [visitData, setVisitData] = useRecoilState(guestbookVisitState);

  const getVisitData = async () => {
    apiGet(`/api/log/visit/guest?timezone=${encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)}`)
      .then(res => {
        setVisitData(res);
      })
  }

  useEffect(() => {
    getVisitData();
  }, [])

  return (
    <Container>
      <InfoItem>
        <Label>YESTERDAY</Label>
        <NumberText>{visitData?.yesterdayVisits ?? '-'}</NumberText>
      </InfoItem>
      <InfoItem>
        <Label>TODAY</Label>
        <NumberText>{visitData?.todayVisits ?? '-'}</NumberText>
      </InfoItem>
      <InfoItem className='total'>
        <Label>TOTAL</Label>
        <NumberText>{visitData?.totalVisits ?? '-'}</NumberText>
      </InfoItem>
    </Container>
  )
};

export default GuestBookInfo;

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4.375rem;

  @media (max-width: 768px) {
    gap: 1.125rem;
    margin-bottom: 2.5rem;
  }
`
const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.125rem;
  width: 6rem;
  height: 6.125rem;
  padding-top: 0rem;

  background-color: var(--bg-guestbook-info);
  border: 2px solid var(--bg-guestbook-info-border);
  border-radius: 1.125rem;

  transition: 350ms cubic-bezier(0.23, 1, 0.320, 1);

  &.total {
    border: 2px solid var(--bg-guestbook-info-total-border);
  }

  &:hover {
    transform: scale(1.05);
    border: 2px solid var(--bg-guestbook-info-hover-border);

    &.total {
      border: 2px solid var(--bg-guestbook-info-total-hover-border);
    }
  }

  @media (max-width: 768px) {
    gap: 1rem;
    width: 5.25rem;
    height: 5.625rem;

    border-radius: 1.125rem;
  }
`
const Label = styled.p`
  color: var(--text-sub);
  font-weight: 500;
  font-size: 0.625rem;
`
const NumberText = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-normal);
  font-weight: 700;
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`


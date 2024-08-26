import styled from 'styled-components';
import { Pretendard } from '../../public/fonts';
import IconFootprint from '@public/svgs/footprint.svg';
import { getFormatDate, getIsNewPost } from '@utils/date';
import Tooltip from '@components/Tooltip';
import { useEffect, useState } from 'react';
import { apiGet } from '@/services/api';
import Link from 'next/link';
import LoadingCircle from '@/components/LoadingCircle';

interface IActivity {
  content: string,
  nickname: string,
  date: any,
  link?: string,
};


const RecentLog = (): JSX.Element => {
  const [list, setList] = useState<IActivity[] | undefined>(undefined);

  const getRecentLog = async () => {
    await apiGet('/api/blog/recentLog')
      .then(res => {
        setList(res.logs);
      })
      .catch(() => {
        setList([])
      });
  }

  useEffect(() => {
    getRecentLog();
  }, [])

  return (
    <Container className={Pretendard.className} id='fade_4'>
      <Title>
        <FootprintIcon width={16} height={16} />
        <p>RECENT LOG</p>
      </Title>
      <ActivityList>
        {list ? list.length > 0 ? [...list].map((i: IActivity, idx: number) =>
          <Activity key={idx} href={i.link ?? ''}>
            <Content>
              <p id='ct'>{i.content}</p>
              {getIsNewPost(new Date(i.date), 5) && <p id='new'>new</p>}
            </Content>
            <DateText>
              <Tooltip ct={getFormatDate(new Date(i.date), true)}>
                <p>{getFormatDate(new Date(i.date), false)}</p>
              </Tooltip>
            </DateText>
            <Name>{i.nickname}</Name>
          </Activity>
        ) : <NoList>활동 기록이 없습니다.</NoList> : <LoadingCircle />
        }
      </ActivityList>
    </Container>
  )
};

export default RecentLog;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  height: 328px;

  border-radius: 12px;
  background-color: var(--bg-recent);
  box-shadow: var(--bg-pitem-boxshadow);

  cursor: default;
  user-select: none;

  transition: 150ms;
`
const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  padding-left: 22px;

  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 600;

  transition: 150ms;

  &>svg {
    filter: var(--filter-invert-reverse);

    transition: 150ms;
  }
`
const FootprintIcon = styled(IconFootprint)`
`
const ActivityList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;

  overflow: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 6px 6px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 6px 6px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-recent);
  }

  @media (max-width: 1280px) {
    overscroll-behavior: initial;
  }
`
const Activity = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 0.625rem 1.25rem;
  background-color: #eef0;

  transition: 150ms;

  &:hover {
    background-color: var(--bg-recent-activity-hover);
    z-index: 1;
    transition: 0ms;
  }
  &:not(:hover) {
    z-index: 0;
  }
`
const Content = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.5rem;

  #new {
    padding: 0.0625rem 0.25rem;
    padding-bottom: 0.125rem;
    border-radius: 0.375rem;
    background-color: var(--bg-recent-new);

    color: #fff;
    font-size: 0.625rem;

    transition: 150ms;
  }
  #ct {
    color: var(--text-normal);
    font-size: 0.75rem;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;

    transition: 150ms;
  }
`
const Name = styled.p`
  min-width: 70px;

  text-align: right;
  color: var(--text-normal);
  font-size: 0.75rem;

  transition: 150ms;
`
const DateText = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 90px;

  text-align: right;
  color: var(--text-sub);
  font-size: 0.75rem;

  transition: 150ms;
`
const NoList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--text-sub-dark);
  font-size: 0.875rem;
  font-weight: 500;
`


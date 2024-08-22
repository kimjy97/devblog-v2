import Board from '@containers/Sidebar/Board';
import styled from 'styled-components';
import { Pretendard } from '../../../public/fonts';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { darkmodeState } from '@atoms/darkmode';
import { apiGet } from '@/services/api';
import { shimmer } from '@/styles/animation';
import { usePathname } from 'next/navigation';

const BoardList = (): JSX.Element => {
  const [boardColorArr, setBoardColorArr] = useState([]);
  const [boardArr, setBoardArr] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const darkmode = useRecoilValue(darkmodeState);
  const pathname = usePathname();

  /** 게시판 색상 배열 초기화 */
  const initBoardColocrArray = (bool?: boolean): void => {
    if (boardColorArr.length === 0 || bool) {
      const arrDark: any = [];
      const arrLight: any = [];
      let result: any = [];

      for (let i = 0; i < 16; i++) {
        arrDark.push({
          backgroundColor: `rgb(
            ${Math.round(Math.random() * 95 + 45)}, 
            ${Math.round(Math.random() * 95 + 45)}, 
            ${Math.round(Math.random() * (Math.random() * 57 + 80) + (Math.random() * 35 + 30))}
          )`
        });
        arrLight.push({
          backgroundColor: `rgb(
            ${Math.round(Math.random() * 135 + 110)}, 
            ${Math.round(Math.random() * 135 + 110)}, 
            ${Math.round(Math.random() * 135 + 110)}
          )`
        });
      }
      result = arrDark;
      result.push(...arrLight);

      setBoardColorArr(result);
    }
  }

  /** 
   * 게시판 색상 반환
   * 
   * @param idx 게시판의 인덱스
   * @return 다크모드와 라이트모드를 구분하여 색상배열에서 해당하는 색상을 반환한다.
  */
  const getBoardColor = (idx: number) => {
    let result: any;
    try {
      const theme: string | null = document.documentElement.getAttribute("data-theme");
      if (boardColorArr.length > 0) {
        if (theme === 'dark') {
          result = boardColorArr[idx];
        }
        if (theme === 'light') {
          result = boardColorArr[idx + 15];
        }
      }
    } catch {
      // empty
    }
    return result;
  }

  const getBoardList = async () => {
    if (pathname !== '/guard') {
      let count = 0;
      const data = await apiGet('/api/blog/boardList')
        .then((res: any) => res.boards)
        .catch();

      if (data) {
        data.forEach((i: any) => { count += i.count })
        setBoardArr(data);
        setTotalCount(count);
      }
    }
  }

  useEffect(() => {
    getBoardList();
    initBoardColocrArray();
  }, [pathname])

  useEffect(() => {
    initBoardColocrArray(true);
  }, [darkmode])

  return (
    <Container className={Pretendard.className}>
      {boardArr.length > 0 ?
        <>
          <Board
            name='전체글보기'
            count={totalCount}
            date=''
            route='all'
            color={getBoardColor(1)}
          />
          {boardArr.map((i: any, idx: number) => (
            <Board
              key={idx}
              name={i.name}
              count={i.count}
              date={i.dateString}
              route={i.name}
              color={getBoardColor(idx + 1)}
            />
          ))}
        </>
        :
        <PlaceholderWrapper>
          {Array.from({ length: 10 }).map((i: any, idx: number) =>
            <Placeholder key={idx} />
          )}
        </PlaceholderWrapper>
      }
    </Container>
  )
};

export default BoardList;

const Container = styled.ul`
  display: flex;
  gap: 12px;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  padding: 0 10px;
  padding-bottom: 40px;
`
const PlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 0.5rem;
`
const Placeholder = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 1.875rem;
  background-color: var(--bg-post-placeholder);
  border-radius: 0.625rem;
    
  ${shimmer}
`
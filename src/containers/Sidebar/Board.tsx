import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';

interface IProps {
  name: string,
  count: number,
  date: string,
  route: string,
  color: any,
};

const Board = ({ name, count, date, route, color }: IProps): JSX.Element => {
  const params = useSearchParams();
  const board = params.get('board');

  return (
    <Container className={(board === route) ? 'active' : ''}>
      <BoardLink
        href={{
          pathname: '/',
          query: {
            board: route,
          }
        }}
        replace
      >
        <BoardEffect />
        <Bar style={color} />
        <Name>
          <span>{name}</span>
          {count !== 0 && <span>{count}</span>}
        </Name>
        <DateStr>{date}</DateStr>
      </BoardLink>
    </Container>
  )
};
export default Board;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  
  border-radius: 12px;
  overflow: hidden;

  cursor: pointer;
  transition: background-color 200ms;
  
  &:hover:not(.active) {
    background-color: var(--bg-sidebar-menu-hover);
    & p {
      padding-left: 40px;
    }
    & div {
      width: 13px;
      border-radius: 4px;
    }
  }

  &.active {
    background-color: var(--bg-sidebar-menu-hover);

    & p {
      padding-left: 40px;

      font-weight: 600;
    }
    & div {
      width: 23px;
      left: 0;

      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    & span {
      transform: translateX(580px);
      transition: 730ms cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  }
`
const Bar = styled.div`
  position: absolute;
  width: 6px;
  height: calc(100% - 30px);
  left: 10px;

  border-radius: 5px;

  transition: 100ms;
`
const BoardLink = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
`
const BoardEffect = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  width: 38px;
  height: 100%;
  
  background-color: rgb(170,170,188);
  filter: blur(46px);
  transform: translateX(-145px);
  
  z-index: 0;
`
const Name = styled.p`
  flex: 1;
  padding-bottom: 16px;
  padding-top: 15px;
  padding-left: 35px;

  color: var(--text-normal);
  font-size: 0.9rem;
  font-weight: 400;

  transition: padding-left 150ms;

  &>span:nth-child(2) {
    margin-left: 0.5rem;
    color: var(--text-sub-dark);
  }
`
const DateStr = styled.p`
  position: absolute;
  right: 0;
  padding-right: 1rem;

  color: var(--text-sub-dark);
  font-size: 0.75rem;
  font-weight: 500;
`





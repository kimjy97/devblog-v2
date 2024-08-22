import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { Pretendard } from '../../../public/fonts';
import { useRecoilValue } from 'recoil';
import { darkmodeState } from '@atoms/darkmode';
import TitleComponent from './TitleComponent';
import ChartComponent from './ChartComponent';
import useMouseDragScroll from '@hooks/useMouseDragScroll';

const BlogInfo = (): JSX.Element => {
  const chartRef = useRef<any>(null);
  const chartContainerRef = useRef<any>(null);
  const darkmode = useRecoilValue(darkmodeState);
  const [chartType, setChartType] = useState<'라인 그래프' | '바 그래프'>('라인 그래프');
  const [dataType, setDataType] = useState<'방문자 수'>('방문자 수');

  useMouseDragScroll(chartContainerRef);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth;
    }
  }, [darkmode]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (chartRef.current) {
          chartRef.current.update();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Container
      className={Pretendard.className}
      id='fade_5'
    >
      <TitleComponent
        chartType={chartType}
        dataType={dataType}
        setChartType={setChartType}
        setDataType={setDataType}
      />
      <ChartContainer ref={chartContainerRef}>
        <ChartWrapper>
          <ChartComponent
            chartRef={chartRef}
            chartType={chartType}
            dataType={dataType}
          />
        </ChartWrapper>
      </ChartContainer>
    </Container>
  );
};

export default BlogInfo;

const Container = styled.div`
  width: 100%;
  //padding-bottom: 14px;

  background-color: var(--bg-postlist);
  box-shadow: var(--bg-pitem-boxshadow);
  border-radius: 12px;
  overflow: hidden;

  user-select: none;

  transition: 150ms;
`;

const ChartContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 24px;
  padding-bottom: 6px;
  padding-top: 0px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 14px;
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
    background-color: var(--bg-postlist);
  }
`;

const ChartWrapper = styled.div`
  width: 200%;
  min-height: 250px;
`;

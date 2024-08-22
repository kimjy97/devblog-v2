import styled from 'styled-components';
import Selection from '@containers/Selection';
import IconChart from '@public/svgs/chart.svg';

interface TitleComponentProps {
  chartType: '라인 그래프' | '바 그래프';
  dataType: '방문자 수';
  setChartType: (type: '라인 그래프' | '바 그래프') => void;
  setDataType: (type: '방문자 수') => void;
}

const TitleComponent: React.FC<TitleComponentProps> = ({ chartType, dataType, setChartType, setDataType }) => {
  const chartTypeArr = ['라인 그래프', '바 그래프'];
  const dataTypeArr = ['방문자 수'];

  return (
    <TitleWrapper>
      <TitleText>
        <ChartIcon />
        <p>BLOG CHART</p>
      </TitleText>
      <OptionWrapper>
        <Selection
          value={dataType}
          items={dataTypeArr}
          onChange={(e: any) => setDataType(e.value.toLowerCase() as '방문자 수')}
          align='right'
        />
        <Selection
          value={chartType}
          items={chartTypeArr}
          onChange={(e: any) => setChartType(e.value.toLowerCase() as '라인 그래프' | '바 그래프')}
          align='right'
        />
      </OptionWrapper>
    </TitleWrapper>
  );
};

export default TitleComponent;

const TitleWrapper = styled.h1`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 16px;
  padding-left: 22px;
  padding-bottom: 10px;

  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 600;

  transition: 150ms;

  &>svg {
    filter: var(--filter-invert-reverse);
  }
`;

const TitleText = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  &>svg {
    filter: var(--filter-invert-reverse);

    transition: 150ms;
  }

  @media (max-width: 480px) {
    &>p {
      display: none;
    }
  }
`;

const ChartIcon = styled(IconChart)`
  width: 16px;
  height: 16px;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  gap: 8px;
`;
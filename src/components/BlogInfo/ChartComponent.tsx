import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useRecoilValue } from 'recoil';
import { darkmodeState } from '@atoms/darkmode';
import { generateLastDays, getMaxTicks, getMinTicks, getStepSize } from '@constants/chart';
import { useEffect, useState } from 'react';
import { apiPost } from '@/services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);


interface ChartComponentProps {
  chartRef: any,
  chartType: '라인 그래프' | '바 그래프';
  dataType: '방문자 수';
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartRef, chartType, dataType }) => {
  const darkmode = useRecoilValue(darkmodeState);
  const [visitorsArr, setVisitorsArr] = useState<any>([]);
  const isLightMode = darkmode === 'light';

  const getData = async () => {
    const result = await apiPost('/api/blog/chart', {
      days: 14,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
      .then((res: any) => res.data);
    setVisitorsArr(result);
  }

  const data = {
    labels: generateLastDays(visitorsArr.length, chartType === '라인 그래프'),
    datasets: [
      {
        label: dataType,
        data: visitorsArr,
        borderColor: isLightMode ? '#adadef' : '#c04b4b',
        backgroundColor: isLightMode ? 'rgba(59, 72, 255, 0.6)' : 'rgba(203, 38, 38, 0.4)',
        fill: true,
        pointRadius: (context: any) => {
          const index = context.dataIndex;
          const count = context.dataset.data.length;
          return index === count - 1 ? 8 : 0;
        },
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 6,
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        position: 'nearest',
        yAlign: chartType === '라인 그래프' ? 'top' : 'bottom',
        xAlign: 'center',
        caretPadding: chartType === '라인 그래프' ? 18 : 8,
        caretSize: 0,
        displayColors: false,
        backgroundColor: '#6b66ff8f',
        bodyFont: {
          size: 14,
          weight: 'bold'
        },
        padding: 10,
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y}명`;
          },
          title: () => ''
        }
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 50,
        backgroundColor: isLightMode ? '#5b73f8' : '#f8bdbd',
        borderColor: isLightMode ? '#5b73f8' : '#f8bdbd',
        hoverRadius: 8,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy. MM. dd',
          displayFormats: {
            day: 'MM. dd',
          },
        },
        grid: {
          display: true,
          color: isLightMode ? '#e7e7f6' : '#121214',
          lineWidth: 1,
        },
        ticks: {
          color: isLightMode ? '#9999a6' : '#444450',
        },
      },
      y: {
        position: 'left',
        grid: {
          display: true,
          color: isLightMode ? '#e7e7f6' : '#121214',
          lineWidth: 1,
        },
        ticks: {
          stepSize: getStepSize(data),
          color: isLightMode ? '#9999a6' : '#444450',
        },
        min: chartType === '라인 그래프' ? getMinTicks(data) - 1 : getMinTicks(data),
        max: getMaxTicks(data),
      },
      y1: {
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          stepSize: getStepSize(data),
          color: isLightMode ? '#9999a6' : '#444450',
        },
        min: chartType === '라인 그래프' ? getMinTicks(data) - 1 : getMinTicks(data),
        max: getMaxTicks(data),
      },
    },
  };

  useEffect(() => {
    getData();
  }, [])

  return chartType === '바 그래프'
    ?
    <Bar ref={chartRef} data={data} options={options} />
    :
    <Line ref={chartRef} data={data} options={options} />;
};

export default ChartComponent;

import { darkmodeState } from "@atoms/darkmode";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

interface CircularProgressProps {
  size: number;
  progress: number; // 0 to 100
  strokeWidth: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  progress,
  strokeWidth,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const fill = circumference - 1 * circumference;
  const darkmode = useRecoilValue(darkmodeState);
  const isDark = darkmode === 'dark';
  const isFull = progress >= 100;

  const adjustedCircleTwoStroke =
    isFull ? (isDark ? "#d33e3e" : '#f85d5d')
      : (isDark ? "#f1f43d" : "#796be5");

  return (
    <SVG id='progress' width={size} height={size}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={darkmode === 'dark' ? "#6a6c7b" : "#dfe1f1"}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={adjustedCircleTwoStroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={progress >= 100 ? fill : offset}
      />
    </SVG>
  );
};

const SVG = styled.svg`
  transform: rotate(-45deg);
  transition: transform 250ms;
`;

const Circle = styled.circle`
  transition: stroke-dashoffset 550ms cubic-bezier(.04,.97,.08,1);
  transform: rotate(-45deg);
  transform-origin: 50% 50%;
`;

export default CircularProgress;

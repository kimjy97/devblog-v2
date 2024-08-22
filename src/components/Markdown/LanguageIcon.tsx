import React from 'react';
import { IconType } from 'react-icons';
import { FaPython, FaJava, FaJsSquare, FaHtml5, FaCss3Alt, FaReact } from 'react-icons/fa';
import styled from 'styled-components';

const iconMap: { [key: string]: IconType } = {
  python: FaPython,
  java: FaJava,
  javascript: FaJsSquare,
  html: FaHtml5,
  css: FaCss3Alt,
  react: FaReact,
  // 필요한 경우 여기에 더 많은 아이콘을 추가할 수 있습니다.
};

interface LanguageIconProps {
  language: string;
  size?: number;
}

const LanguageIcon: React.FC<LanguageIconProps> = ({ language, size = 50 }) => {
  const IconComponent = iconMap[language.toLowerCase()];
  return IconComponent ?
    <Container>
      <IconComponent size={size} />
    </Container>
    :
    null;
};

export default LanguageIcon;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`


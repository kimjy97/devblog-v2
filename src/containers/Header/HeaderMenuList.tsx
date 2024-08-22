import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

interface IProps {
  name: string;
  url: string;
};

const HeaderMenuList = ({ name, url }: IProps) => {
  const pathname = usePathname();

  const getCompareUrl = (u: string) => {
    const result: boolean = pathname === u;

    return result ? 'active' : '';
  }

  return (
    <List className={getCompareUrl(url)}>
      <Link href={url} >
        {name}
      </Link>
    </List>
  )
};

export default HeaderMenuList;

const List = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 70%;
  max-height: 2.9rem;
  
  color: var(--text-inactive);
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  line-height: var(--header-height);
    
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  transition: color 150ms;
  
  &>a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 18px;
  }
  &::before {
    position: absolute;
    content: '';
    width: 0%;
    height: 100%;
    left: 50%;
    top: 50%;
    
    background-color: var(--bg-header-menu-hover);
    border-radius: 12px;
    opacity: 0;
    transform: translate(-50%, -50%);
    
    z-index: -1;
    transition: 150ms;
  }
  &:hover{
    color: var(--text-normal);
    &::before {
      width: 100%;
      opacity: 1;
    }
  }
  &.active {
    color: var(--text-normal);
    &::before {
      width: 100%;
      background-color: var(--bg-header-menu-active);
        
      opacity: 1;
    }
  }        
`
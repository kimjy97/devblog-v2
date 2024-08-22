import styled from 'styled-components';
import IconArrowDown from '@public/svgs/arrow_down.svg'
import { useEffect, useRef, useState } from 'react';
import { pixel } from '@utils/pixel';

interface IProps {
  items: any[],
  value: any,
  onChange: any,
  border?: boolean,
  align?: 'left' | 'right',
};

const HEIGHT = 36;

const Selection = ({ items, value, onChange, border = true, align = 'left' }: IProps): JSX.Element => {
  const ContainerRef = useRef<any>(null);
  const WrapperRef = useRef<any>(null);
  const ItemListRef = useRef<any>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(items.indexOf(value));

  const handleClickToggle = () => {
    setToggle(!toggle);
  }

  const handleClikeItem = (val: string, idx: number) => {
    onChange({ value: val, index: idx });
    setSelected(idx);
    setToggle(false);
  }

  const handleChangeContainerHeight = () => {
    const wRef = WrapperRef.current;
    const iRef = ItemListRef.current;

    if (wRef) {
      if (toggle) {
        wRef.style.height = pixel(HEIGHT + iRef.offsetHeight + 10);
        wRef.style.minWidth = pixel(iRef.offsetWidth);
      } else {
        wRef.style.height = pixel(HEIGHT);
        wRef.style.minWidth = 0;
      }
    }
  }

  useEffect(() => {
    if (ContainerRef.current) {
      ContainerRef.current.style.width = pixel(WrapperRef.current.offsetWidth)
    }
  }, [WrapperRef])

  useEffect(() => {
    handleChangeContainerHeight();
  }, [toggle])

  useEffect(() => {
    setSelected(items.indexOf(value));
  }, [value])

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (WrapperRef.current && !WrapperRef.current.contains(e.target)) {
        setToggle(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const gStyles = {
    align: {
      left: align === 'left' ? 0 : 'auto',
      right: align === 'right' ? 0 : 'auto',
    },
  }

  const styles = {
    border: {
      ...gStyles.align,
    },
    noneBorder: {
      ...gStyles.align,
      borderColor: 'transparent',
      backgroundColor: toggle ? 'var(--bg-selection)' : 'transparent',
    },
    value: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    container: {
    }
  }

  return (
    <Container ref={ContainerRef} style={border ? {} : styles.container}>
      <Wrapper
        ref={WrapperRef}
        className={toggle ? 'active' : ''}
        style={border ? styles.border : styles.noneBorder}
      >
        <Selected onClick={handleClickToggle}>
          <p id='value' style={border ? {} : styles.value}>{items[selected]}</p>
          <ArrowDownIcon id='dropdownIcon' width={12} height={12} stroke='#72728e' />
        </Selected>
        <ItemList ref={ItemListRef}>
          {items.map((i: any, idx: number) =>
            <button type='button' key={idx} onClick={() => handleClikeItem(i, idx)}>
              <p className={i === items[selected] ? 'selected' : ''}>{i}</p>
            </button>
          )}
        </ItemList>
      </Wrapper>
    </Container>
  )
};

export default Selection;

const Container = styled.div`
  position: relative;
  height: 36px;

  z-index: 1;
`
const Wrapper = styled.div`
  position: absolute;

  background-color: var(--bg-selection);
  border-radius: 16px;
  border: 1.5px solid var(--bg-selection-border);
  box-sizing: initial;
  overflow: hidden;
  backdrop-filter: blur(30px);
  margin-top: -0.0625rem;

  transition: 150ms, height 300ms cubic-bezier(.04,.97,.08,1), width 300ms;

  #dropdownIcon {
    opacity: 0.5;
    transition: 150ms, transform 100ms cubic-bezier(.04,.97,.08,1);
  }

  #value {
    flex: 1;
    padding-left: 14px;
    padding-right: 12px;
    
    color: var(--text-normal);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    
    user-select: none;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;

    transition: 150ms;
  }

  &.active {
    border: 1.5px solid var(--bg-selection-border-active) !important;
    box-shadow: 0 2px 10px #0001;

    #dropdownIcon {
      opacity: 1;
      transform: rotate(-180deg);
    }
  }

  &:hover {
    border: 1.5px solid var(--bg-selection-border-hover);

    #dropdownIcon {
      opacity: 1;
    }
  }
`
const Selected = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  padding-right: 14px;

  cursor: default;
  transition: 150ms;
`
const ItemList = styled.ul`
  position: absolute;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 4px;

  &>button {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    padding-right: 22px;

    border-radius: 6px;

    color: var(--text-normal);
    font-size: 0.875rem;
    font-weight: 500;

    cursor: default;
    user-select: none;
    transition: 50ms;

    &>p {
      white-space: nowrap;

      &.selected {
        color: var(--text-selection-list-selected)
      }
    }

    &:not(:has(.selected)):hover {
      background-color: var(--bg-selection-list-hover);
    }
  }
`
const ArrowDownIcon = styled(IconArrowDown)`
  padding-top: 1px;
`

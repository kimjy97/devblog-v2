import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface IProps {
  value: string;
  width?: string;
  label: string;
  placeholder?: string;
  password?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ width = '10em', label, placeholder, password, value, onChange }: IProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;

    const handleFocus = () => {
      if (container) {
        container.style.borderColor = 'var(--bg-comment-input-focus-border)';
      }
    };

    const handleBlur = () => {
      if (container) {
        container.style.borderColor = 'var(--bg-comment-input-border)';
      }
    };

    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      style={{ width }}
      onClick={() => inputRef.current?.focus()}
    >
      <Label>{label}</Label>
      <Text
        ref={inputRef}
        placeholder={placeholder ?? ''}
        type={password ? 'password' : 'text'}
        value={value}
        onChange={onChange}
      />
    </Container>
  );
};

export default Input;

const Container = styled.div`
  flex-shrink: 1;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875em;
  height: 2.6875em;
  min-width: 0;
  padding: 0 1em;
  
  border-radius: 0.625em;
  background-color: var(--bg-comment-input);
  border: 1px solid var(--bg-comment-input-border);

  transition: 150ms;
  cursor: text;
`;

const Label = styled.p`
  color: var(--text-sub);
  white-space: nowrap;
  user-select: none;
`;

const Text = styled.input`
  flex-shrink: 1;
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;

  color: var(--text-normal);

  &::placeholder {
    color: var(--text-sub-dark);
  }

  &:focus {
    &::placeholder {
      color: transparent;
    }
  }
`;

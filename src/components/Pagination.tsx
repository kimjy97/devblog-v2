import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}

const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages].filter(n => n > 0);
    return [page - 2, page - 1, page, page + 1, page + 2];
  };
  const pageNumbers = getPageNumbers();
  return (
    <PaginationWrapper>
      {pageNumbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => setPage(num)}
          disabled={num === page}
          className={num === page ? 'active' : ''}
        >
          {num}
        </button>
      ))}
    </PaginationWrapper>
  );
};

export default Pagination;

const PaginationWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin: 4rem 0 2rem 0;
  
  button {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: none;
    background: var(--bg-tag);
    color: var(--text-normal);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    &.active {
      background: var(--bg-tag-active);
      color: var(--text-pitem-tagname);
      font-weight: 700;
      cursor: default;
    }
    &:disabled {
      background: var(--bg-tag-hover);
      color: var(--text-tag);
      cursor: not-allowed;
    }
    &:not(:disabled):hover {
      background: var(--bg-tag-active);
    }
  }
`; 
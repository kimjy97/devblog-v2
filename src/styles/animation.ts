export const shimmer = `
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -250%;
    width: 200%;
    height: 100%;
    background: linear-gradient(120deg, transparent, var(--bg-post-placeholder-shimmer), transparent);
    animation: shimmer 2s infinite linear;
  }

  @keyframes shimmer {
    0% {
      left: -250%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: 150%;
    }
  }
`
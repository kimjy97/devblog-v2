import styled from 'styled-components';

interface IProps {
  text: string,
  red?: boolean,
  green?: boolean,
  blue?: boolean,
  onClick: any,
};

const Button = ({ text, red, green, blue, onClick }: IProps): JSX.Element => {
  const getColor = () => {
    let result = '';
    if (blue) result = 'blue';
    if (green) result = 'green';
    if (red) result = 'red';

    return result;
  }

  return (
    <Container
      className={getColor()}
      onClick={onClick}
    >
      {text}
    </Container>
  )
};

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 1rem;
`
const Container = styled.div`
  padding: 0.5rem 1rem;

  border-radius: 8px;
  border: 1px solid var(--bg-modal-button-border);

  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-normal);
  cursor: pointer;

  transition: 50ms;

  &.red {
    border: 1px solid var(--bg-modal-button-border-red);
    background-color: var(--bg-modal-button-red);

    color: #fff;
  }

  &.blue {
    border: 1px solid var(--bg-modal-button-border-blue);
    background-color: var(--bg-modal-button-blue);

    color: #fff;
  }

  &:hover {
    border: 1px solid var(--bg-modal-button-hover-border);

    &.red {
      border: 1px solid var(--bg-modal-button-border-red);
      background-color: var(--bg-modal-button-hover-red);
    }

    &.blue {
      border: 1px solid var(--bg-modal-button-border-blue);
      background-color: var(--bg-modal-button-hover-blue);
    }
  }
`

export { Button, ModalButtons };
import styled from 'styled-components';

interface IProps {
  className?: string;
  children: any;
};

const ModuleLayout = ({ className, children }: IProps): JSX.Element => {
  return (
    <Container className={className ?? ''}>
      {children}
    </Container>
  )
};
export default ModuleLayout;


const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 1280px) {
    gap: 1rem;
  }

  @media (max-width: 1024px) {
    &:not(.banner) {
      gap: 3rem;
    }
  }

  @media (max-width: 432px) {
    grid-template-columns: 100%;
  }
`
import ModuleLayout from '@components/ModuleLayout';
import GithubBanner from '@containers/Banner/GithubBanner';
import PortfolioBanner from '@containers/Banner/PortfolioBanner';

const Banner = (): JSX.Element => {
  return (
    <ModuleLayout className='banner'>
      <PortfolioBanner />
      <GithubBanner />
    </ModuleLayout>
  )
};
export default Banner;
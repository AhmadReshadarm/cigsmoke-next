import StoreLayout from 'components/store/storeLayout/layouts';
import Banners from 'components/home-page/banners';
import Bestsellers from 'components/home-page/bestsellers';
import CreatedForYou from 'components/home-page/createdForYou';
import Reviews from 'components/home-page/reviews';
import SEOstatic from 'components/store/SEO/SEOstatic';

const IndexPage = (): JSX.Element => {
  return (
    <>
      <SEOstatic
        page={{
          name: 'Главный',
          url: '/',
          desc: 'Интернет-магазин Wuluxe купить табак для кальян и одноразовые, многоразовый электронные сигареты, аксессуары для кальяна и вейпа в москве и все россия',
          keywords:
            'wuluxe, wuluxe.ru, волюкс, одноразовые, одноразовые сигареты, купить одноразовые, одноразовые электронные, одноразовые электронные сигареты, одноразовые сигареты купить',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        image="https://wuluxe.ru/wuluxe.svg"
      />
      <Banners />
      <Bestsellers />
      <CreatedForYou />
      <Reviews />
    </>
  );
};

IndexPage.PageLayout = StoreLayout;
export default IndexPage;

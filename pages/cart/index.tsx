import StoreLayout from 'components/store/storeLayout/layouts';
import Head from 'next/head';
import { baseUrl } from 'common/constant';
// import dynamic from 'next/dynamic';
// import { LoaderMask } from 'ui-kit/generalLoaderMask';
// const Cart = dynamic(() => import('components/store/cart'), {
//   ssr: false,
//   // loading: () => <LoaderMask />,
// });
import Cart from 'components/store/cart';
import styles from 'components/store/cart/cartStyles.module.css';

const CardPage = () => {
  return (
    <>
      <Head>
        <title>Корзина | WULUXE</title>
        <meta
          property="og:image"
          name="og:image"
          content={`${baseUrl}/static/logo_800x800.png`}
        />
      </Head>
      <div className={styles.Container}>
        <Cart />
      </div>
    </>
  );
};

CardPage.PageLayout = StoreLayout;
export default CardPage;

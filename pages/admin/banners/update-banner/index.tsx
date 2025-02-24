import AdminLayout from 'components/admin/adminLayout/layout';
import dynamic from 'next/dynamic';
import { LoaderMask } from 'ui-kit/generalLoaderMask';
const BannersFormLayout = dynamic(
  () => import('components/admin/banners/BannersFormLayout'),
  {
    ssr: false,
    loading: () => <LoaderMask />,
  },
);

import styles from '../index.module.scss';
import Head from 'next/head';

const UpdateBanner = () => {
  return (
    <>
      <Head>
        <title>
          Администрирование {`>`} Баннеры {'>'} Обновление баннеров | WULUXE
        </title>
      </Head>
      <div>
        <h1 className={styles.bannersHeader__title}>Обновление баннеров</h1>
      </div>
      <div>
        <BannersFormLayout />
      </div>
    </>
  );
};

UpdateBanner.PageLayout = AdminLayout;

export default UpdateBanner;

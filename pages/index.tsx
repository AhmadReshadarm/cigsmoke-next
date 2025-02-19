import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import StoreLayout from 'components/store/storeLayout/layouts';
import SEOstatic from 'components/store/SEO/SEOstatic';
import { baseUrl } from '../common/constant';
import { Product, Slide } from 'swagger/services';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductVariantsImages } from 'common/helpers/getProductVariantsImages.helper';
import Banners from 'components/store/homePage/banners';
import ProductsSlider from 'components/store/homePage/productsSlider';
import { LoaderMask } from 'ui-kit/generalLoaderMask';
import axios from 'axios';

const MainPageCatalog = dynamic(
  () => import('components/store/homePage/mainPageCatalog'),
  {
    ssr: false,
    loading: () => <LoaderMask />,
  },
);
const BestProduct = dynamic(
  () => import('components/store/homePage/bestProducts'),
  {
    ssr: false,
    loading: () => <LoaderMask />,
  },
);
const Subscribers = dynamic(() => import('ui-kit/Subscribers'), {
  loading: () => <LoaderMask />,
});
const ContactsMainPage = dynamic(
  () => import('components/store/homePage/contactsMainPage'),
  {
    loading: () => <LoaderMask />,
  },
);

export const getServerSideProps = (async () => {
  let slides: Slide[];
  let caroselImages: string[];

  try {
    const resSlides = await fetch(`${process.env.API_URL}/slides`);
    const resCarosel = await fetch(
      `${process.env.API_URL}/products?tags[]=main_page`,
    );
    slides = await resSlides.json();
    const caroselProducts: { rows: Product[]; lenght: number } =
      await resCarosel.json();

    caroselImages = getProductVariantsImages(
      caroselProducts.rows[0].productVariants,
    );

    const getBase64Image = async (imageUrl) => {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(response.data, 'binary');
      const base64Image = buffer.toString('base64');
      return `data:image/webp;base64,${base64Image}`; // Adjust the MIME type as needed
    };
    // `/api/images/compress/${caroselImages[0]}?qlty=1&width=200&height=200&lossless=true`;

    const base64Image = await getBase64Image(
      `${process.env.API_URL}/images/compress/${caroselImages[0]}?qlty=1&width=100&height=100&lossless=false`,
    );
    const base64Image_2 = await getBase64Image(
      `${process.env.API_URL}/images/compress/${slides[0].image}?qlty=1&width=190&height=80&lossless=false`,
    );

    return {
      props: {
        slides,
        caroselProducts: caroselProducts.rows,
        base64Image,
        base64Image_2,
      },
    };
  } catch (error) {
    return {
      props: {
        slides: [],
        caroselProducts: [],
        base64Image: null,
        base64Image_2: null,
      },
    };
  }
}) as GetServerSideProps<{
  slides: Slide[];
  caroselProducts: Product[];
  base64Image: any;
  base64Image_2: any;
}>;

// ---------------------------------------------------------------------------------------
const IndexPage = ({
  slides,
  caroselProducts,
  base64Image,
  base64Image_2,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isClient, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <>
      <SEOstatic
        page={{
          realName:
            'WULUXE - Всё для дома: шторы, карнизы, товары для ванной, уборки, кухни и дачи Доставка по Москва и России',
          name: 'WULUXE - Всё для дома: шторы, карнизы, товары для ванной, уборки, кухни и дачи Доставка по Москва и России',
          url: '',
          desc: 'Интернет-магазин товаров для дома: шторы, карнизы, уборочный инвентарь, техника для кухни, товары для дачи, ванной и рукоделия. Широкий ассортимент, качество и доступные цены! Быстрая доставка по России. Заходите и выбирайте! 🛍️✨',
          keywords:
            'оптом, товары для дома, хозяйственные товары, мелкая оптовая торговля, купить оптом, продажа оптом, оптовый склад, оптовый поставщик, швабры, губки, столовые приборы, инструменты, коврики, спортивный инвентарь',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        image={`${baseUrl}/static/logo_800x800.png`}
      />
      <Head>
        <link rel="canonical" href="https://wuluxe.ru" />
      </Head>
      <Banners slides={slides} base64Image_2={base64Image_2} />
      <ProductsSlider
        caroselProducts={caroselProducts}
        base64Image={base64Image}
      />
      {isClient ? (
        <>
          <MainPageCatalog />
          <BestProduct />
          <Subscribers />
          <ContactsMainPage />
        </>
      ) : (
        <LoaderMask />
      )}
    </>
  );
};

IndexPage.PageLayout = StoreLayout;
export default IndexPage;

import color from 'components/store/lib/ui.colors';
import {
  Container,
  Wrapper,
  Content,
} from 'components/store/storeLayout/common';
import StoreLayout from 'components/store/storeLayout/layouts';
import SEOstatic from 'components/store/SEO/SEOstatic';
import styled from 'styled-components';
import Subscribers from 'ui-kit/Subscribers';
import { baseUrl } from 'common/constant';
import dynamic from 'next/dynamic';
const MapContainer = dynamic(
  () => import('components/store/addressContactUs/index'),
  {
    ssr: true,
    loading: () => <LoaderMask />,
  },
);
const Contacts = () => {
  return (
    <>
      <SEOstatic
        page={{
          realName:
            'WULUXE - интернет магазин хозтовары оптом. по выгодным ценам',
          name: 'WULUXE - интернет магазин хозтовары оптом. по выгодным ценам',
          url: '/',
          desc: `WULUXE, Дешевые хозтовары оптом в интернет магазине wuluxe в Москве и все Россия`,
          keywords:
            'wuluxe, wuluxe.ru, Товары для сервировки стола,купить Кухонная утварь, Товары для ванной комнаты, Дешевые хозтовары',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        image={`${baseUrl}/static/logo_800x800.png`}
      />

      <Container
        flex_direction="column"
        justify_content="center"
        align_items="center"
        padding="50px 0"
        gap="40px"
        bg_color={color.textPrimary}
      >
        <Wrapper>
          <Content
            flex_direction="column"
            justify_content="flex-start"
            align_items="center"
            gap="30px"
          >
            <MapContainer />
          </Content>
        </Wrapper>
        <Subscribers />
      </Container>
    </>
  );
};

const LoaderMask = styled.div`
  width: 100vw;
  height: 100vh;
  background: #cccccca3;
  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100px);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: loading 0.8s infinite;
  }

  @keyframes loading {
    100% {
      transform: translateX(100%);
    }
  }
`;

Contacts.PageLayout = StoreLayout;

export default Contacts;

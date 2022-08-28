import color from 'components/store/lib/ui.colors';
import variants from 'components/store/lib/variants';
import {
  Container,
  Content,
  Wrapper,
} from 'components/store/storeLayout/common';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TAuthState } from 'redux/types';
import { useAppSelector } from 'redux/hooks';
import {
  Product,
  // ProductService,
  ForyouProductsService,
  UserHistoryService,
  UserHistoryInDbService,
} from 'swagger/services';
import ProductGrid from '../../../ui-kit/products/productGrid';
import Subscription from './subscription';

const Section = () => {
  const { user } = useAppSelector<TAuthState>((state) => state.auth);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const history = localStorage.getItem('histroy');
    (async () => {
      setLoading(true);
      const userHistoryInDB = await UserHistoryInDbService.getUserHistory();
      let products: any = [];
      if (!history) {
        products = await ForyouProductsService.getProducts();
      }
      if (history && !user && !userHistoryInDB) {
        products = await UserHistoryService.getUserHistory({
          body: { history },
        });
      }
      if (history && user && !userHistoryInDB) {
        await UserHistoryInDbService.createUserHistory({ body: { history } });
      }
      if (history && user && userHistoryInDB) {
        await UserHistoryInDbService.updateUserHistory({ body: { history } });
        products = await UserHistoryInDbService.getUserHistory();
      }
      // (
      //   await ProductService.getProducts({
      //     limit: 8,
      //   }),
      // ) as unknown as { rows: Product[] };
      setLoading(false);
      setProducts(products.rows);
    })();
  }, []);

  return (
    <Container
      variants={variants.fadInOut}
      key="section_three"
      initial="start"
      whileInView="middle"
      flex_direction="row"
      justify_content="space-evenly"
      padding="50px 0 0 0"
      bg_color={color.bgSecondary}
    >
      <Wrapper>
        <Content
          flex_direction="column"
          justify_content="space-between"
          align_items="center"
          gap="35px"
        >
          <Header
            key="header-goods"
            custom={0.2}
            initial="init"
            whileInView="animate"
            exit="exit"
            viewport={{ once: true }}
            variants={variants.fadInSlideUp}
          >
            <h2>Создано для тебе</h2>
          </Header>

          <ContentInner>
            <ProductGrid
              gridStyle={{
                gridTemplateAreas: "'item item item subscribe'",
                justify_content: 'space-between',
                alignItems: 'center',
                rowGap: '30px',
                columnGap: '35px',
                padding: '50px 20px',
                laptopColumnGap: '70px!important',
                laptopGridTemplateAreas: `'item item subscribe' !important`,
                laptopSColumnGap: '14px!important',
                laptopSGridTemplateAreas: `'item item subscribe'!important`,
              }}
              products={products}
              loading={loading}
            >
              <Subscription />
            </ProductGrid>
            <Footer
              key="header-messege"
              custom={0.2}
              initial="init"
              whileInView="animate"
              viewport={{ once: true }}
              variants={variants.fadInSlideUp}
            >
              <p>
                Мы рады поделиться некоторыми из лучших товаров, связанных с
                вашей деятельностью на нашем веб-сайте, не стесняйтесь проверить
                их все, ура!
              </p>
              <Link href={`/catalog/id`}>
                <motion.a
                  whileHover="hover"
                  whileTap="tap"
                  variants={variants.boxShadow}
                >
                  <button>Показать все</button>
                </motion.a>
              </Link>
            </Footer>
          </ContentInner>
        </Content>
      </Wrapper>
    </Container>
  );
};
// подобранные товары для вас
const ContentInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  place-items: center;
  gap: 50px;
  border-radius: 30px 30px 0 0;
  background-color: ${color.bgProduct};
  padding-bottom: 80px;
`;

const Header = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  h2 {
    font-family: intro;
    font-weight: 700;
    font-size: 4rem;
    margin: 0;
    color: ${color.textPrimary};
  }
`;

const Footer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${color.bgProduct};
  p {
    text-align: center;
    width: 60%;
  }
  button {
    width: 130px;
    height: 45px;
    background: ${color.btnPrimary};
    color: ${color.textPrimary};
    border: none;
    border-radius: 8px;
  }
  a {
    border-radius: 8px;
  }
`;

export default Section;

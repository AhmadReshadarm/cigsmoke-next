import { useEffect, useState } from 'react';
import { Product, ProductService } from 'swagger/services';
import { useInViewportNoDelay } from 'components/store/storeLayout/useInViewport';
import dynamic from 'next/dynamic';
const ProductFlex = dynamic(() =>
  import('./common').then((module) => module.ProductFlex),
);
const ProductFlexEmpty = dynamic(() =>
  import('./common').then((module) => module.ProductFlexEmpty),
);
import styles from '../styles/RecomendationSub.module.css';
const WeRecomend = ({ product }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInViewport, ref } = useInViewportNoDelay();
  useEffect(() => {
    if (isInViewport) {
      (async () => {
        const response = (await ProductService.getProducts({
          limit: 17,
          parent: product?.category.parent?.url,
        })) as unknown as { rows: Product[]; length: number };
        const offset = Math.floor(Math.random() * response.length) - 18;
        const weRecomend = (await ProductService.getProducts({
          limit: 18,
          offset: `${offset < 18 ? 0 : offset}`,
          parent: product?.category.parent?.url,
        })) as unknown as { rows: Product[]; length: number };
        setProducts(weRecomend.rows.filter((item) => item.id != product.id));
        setLoading(false);
      })();
    }
  }, [isInViewport]);

  return (
    <>
      <div className={styles.ContentWrapper} ref={ref}>
        <div className={styles.HeaderWrapper}>
          <h3>Рекомендуем также</h3>
        </div>
        {isInViewport ? (
          products.length !== 0 ? (
            <ProductFlex
              products={products}
              loading={loading}
              seeMoreUrl={`/catalog?categories=${product?.category.parent?.url}`}
            />
          ) : (
            <ProductFlexEmpty />
          )
        ) : (
          <ProductFlexEmpty />
        )}
      </div>
    </>
  );
};

export default WeRecomend;

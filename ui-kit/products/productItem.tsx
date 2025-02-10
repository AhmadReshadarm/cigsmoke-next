import { getProductVariantsImages } from 'common/helpers/getProductVariantsImages.helper';
import { sizesNum } from 'components/store/lib/Devices';
import Link from 'next/link';
import { Product } from 'swagger/services';
import Slider from './slider';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { Basket } from 'swagger/services';
import { AddToCart, AddToWishlist } from 'ui-kit/ProductActionBtns';
import { findCartQTY } from 'ui-kit/HeaderProductItems/helpers';
import {
  clearSearchProducts,
  clearSearchQuery,
} from 'redux/slicers/store/globalSlicer';
import { useEffect, useState } from 'react';
import styles from './styles/productItem.module.css';
type Props = {
  // key: string;
  product: Product;
  custom: number;
};
// key,
const ProductItem: React.FC<Props> = ({ product, custom }) => {
  const images = getProductVariantsImages(product.productVariants);
  const cart: Basket = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const calculateImageSizeContainer = (windowWidth: number) => {
    switch (true) {
      // laptopM
      case sizesNum.laptopS < windowWidth && windowWidth < sizesNum.laptopM:
        return {
          minMaxWidth: windowWidth / 5 - 10,
        };
      // laptopS
      case sizesNum.tabletL < windowWidth && windowWidth < sizesNum.laptopS:
        return {
          minMaxWidth: windowWidth / 4 - 10,
        };
      // tabletL
      case sizesNum.tabletM < windowWidth && windowWidth < sizesNum.tabletL:
        return {
          minMaxWidth: windowWidth / 3 - 10,
        };
      // tabletM
      case sizesNum.tabletS < windowWidth && windowWidth < sizesNum.tabletM:
        return {
          minMaxWidth: windowWidth / 2 - 10,
        };
      // tabletS
      case sizesNum.mobileL < windowWidth && windowWidth < sizesNum.tabletS:
        return {
          minMaxWidth: windowWidth / 2 - 10,
        };
      // mobileL, mobileM, mobileS, mobileES
      case sizesNum.mobileES < windowWidth && windowWidth < sizesNum.mobileL:
        return {
          minMaxWidth: windowWidth - 20,
        };
      default:
        return {
          minMaxWidth: 200,
        };
    }
  };

  const [wrapperSizes, setWrapperSizes] = useState({
    minMaxWidth: calculateImageSizeContainer(windowWidth).minMaxWidth,
  });
  useEffect(() => {
    setWrapperSizes({
      minMaxWidth: calculateImageSizeContainer(windowWidth).minMaxWidth,
    });
  }, [windowWidth]);
  //

  return (
    <li
      className={styles.ItemContainer}
      style={{
        minWidth: `${wrapperSizes.minMaxWidth}px`,
        maxWidth: `${wrapperSizes.minMaxWidth}px`,
      }}
    >
      <div className={styles.ItemWrapper}>
        <Slider
          product={product}
          images={images}
          url={product.url}
          windowWidth={windowWidth}
        />
        <div className={styles.product_title_add_to_card_wrapper}>
          <div className={styles.product_price_wrapper}>
            {product.productVariants![0]?.oldPrice ? (
              <span className={styles.old_price}>
                {product.productVariants![0]?.oldPrice} ₽
              </span>
            ) : (
              ''
            )}
            <span>{product.productVariants![0]?.price} ₽</span>
          </div>
          <Link
            className={styles.product_title}
            onClick={() => {
              dispatch(clearSearchQuery());
              dispatch(clearSearchProducts());
            }}
            href={`/product/${product.url}`}
            aria-label={product.name}
            prefetch={false}
          >
            <span title={product.name}>
              {product.name?.length! > 35
                ? `${product.name?.slice(0, 35)}...`
                : product.name}
            </span>
          </Link>
          {/* ------------ rating --------------- */}
          <div
            title={`${
              Math.floor(product.reviews?.length!) == 1
                ? Math.floor(product.reviews?.length!) + ' Оценка'
                : Math.floor(product.reviews?.length!) / 2 == 0
                ? Math.floor(product.reviews?.length!) + ' Оценки'
                : Math.floor(product.reviews?.length!) + ' Оценок'
            } `}
            className={styles.rating_wrapper}
            style={{ display: product.reviews?.length! == 0 ? 'none' : 'flex' }}
          >
            <span className={styles.review_star}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9.64421L9.708 12L8.724 7.56L12 4.57263L7.686 4.18737L6 0L4.314 4.18737L0 4.57263L3.276 7.56L2.292 12L6 9.64421Z"
                  fill="#FAAF00"
                />
              </svg>
            </span>
            <span className={styles.review_text}>{product.rating?.avg}</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                style={{ color: 'rgba(0, 26, 52, 0.4)' }}
              >
                <path
                  fill="currentColor"
                  d="M8.545 13C11.93 13 14 11.102 14 8s-2.07-5-5.455-5C5.161 3 3.091 4.897 3.091 8c0 1.202.31 2.223.889 3.023-.2.335-.42.643-.656.899-.494.539-.494 1.077.494 1.077.89 0 1.652-.15 2.308-.394.703.259 1.514.394 2.42.394"
                ></path>
              </svg>
            </span>
            <span className={styles.review_text}>
              {Math.floor(product.reviews?.length!) == 1
                ? Math.floor(product.reviews?.length!) + ' Оценка'
                : Math.floor(product.reviews?.length!) / 2 == 0
                ? Math.floor(product.reviews?.length!) + ' Оценки'
                : Math.floor(product.reviews?.length!) + ' Оценок'}
            </span>
          </div>
          {/* ------------- end of rating ---------------- */}

          <div className={styles.action_buttons_wrapper}>
            {/* <AddToWishlist product={product} /> */}
            <AddToCart
              product={product}
              qty={findCartQTY(product, cart)}
              variant={product?.productVariants![0]}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;

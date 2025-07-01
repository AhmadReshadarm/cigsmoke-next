import { getProductVariantsImages } from 'common/helpers/getProductVariantsImages.helper';
import { sizesNum } from 'components/store/lib/Devices';
import Link from 'next/link';
import { Product, ProductVariant } from 'swagger/services';
import Slider from './slider';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { Basket } from 'swagger/services';
import { AddToCart, AddToWishlist } from 'ui-kit/ProductActionBtns';
import { findCartQTY } from 'ui-kit/HeaderProductItems/helpers';
import {
  clearSearchProducts,
  clearSearchQuery,
} from 'redux/slicers/store/globalSlicer';
import React, { useEffect, useState } from 'react';
import styles from './styles/productItem.module.css';
import Image from 'next/image';
import { ImageTooltip } from 'components/store/product/productInfo/details/helpers';
import color from 'components/store/lib/ui.colors';
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
  const [variant, setVariant] = useState(product.productVariants![0]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loadingComplet, setLoadingComplet] = useState(false);

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
  //-------------------------------------------------

  const articals = product.productVariants?.map((variant) => variant.artical);

  // remove the repated product artical from array to only show in UI once
  const filteredArticals = articals!.filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });

  // Helper function to get unique variants by article
  const getUniqueVariants = (product: any) => {
    if (!product?.productVariants) return [];

    const seen = new Set();
    return product.productVariants.filter((variant: any) => {
      if (seen.has(variant.artical)) return false;
      seen.add(variant.artical);
      return true;
    });
  };

  const uniqueVariants = getUniqueVariants(product);

  const colors: string[] = [];
  product.productVariants!.map((variant) => {
    if (variant.color?.url !== '-') {
      colors.push(variant.color?.code!);
    }
  });
  // remove the repated product colors from array to only show in UI once
  const filteredColors = colors.filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });

  const currentVariant = (artical) =>
    product.productVariants?.find((variant) => variant.artical == artical);
  // this is neccesery for setting the varian for when the product search result changes it should also set the new
  // variant, if this is not present the UI will show the previus product variant data
  useEffect(() => {
    setVariant(product.productVariants![0]);
  }, [product]);

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
          images={variant.images ? variant.images.split(', ') : []}
          url={product.url}
          windowWidth={windowWidth}
          variant={variant}
        />
        <div className={styles.product_title_add_to_card_wrapper}>
          <div className={styles.product_price_wrapper}>
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
          {/* ----------- aritcale ---------- */}
          <div
            style={{
              alignItems: uniqueVariants.length > 2 ? 'flex-start' : 'center',
            }}
            className={styles.artical_wrapper}
          >
            <div className={styles.artical_content_wrapper}>
              {uniqueVariants.length > 1 ? (
                uniqueVariants.map(
                  (variantDB: ProductVariant, index: number) => {
                    return (
                      <ImageTooltip
                        enterTouchDelay={0}
                        leaveTouchDelay={5000}
                        key={`image-item-${index}`}
                        title={
                          <React.Fragment>
                            <Image
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '15px',
                              }}
                              src={`/api/images/${
                                variantDB.images?.split(', ')[0]
                              }`}
                              alt={`${product.name}`}
                              width={0}
                              height={0}
                              sizes="100vw"
                              loading="lazy"
                              priority={false}
                            />
                            <hr
                              style={{
                                backgroundColor: color.textTertiary,
                                width: '100%',
                              }}
                            />
                            {variantDB.color?.url === '_' ||
                            variantDB.color?.url === '-' ||
                            variantDB.color?.url == ' ' ? (
                              <></>
                            ) : (
                              <span
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center',
                                }}
                                className={styles.ColorPickerSpan}
                              >
                                <span>Цвет:</span>
                                <div
                                  style={{
                                    backgroundColor: variantDB.color?.code,
                                  }}
                                  className={styles.ColorItem}
                                />
                              </span>
                            )}
                            <div className={styles.ArticalWrapper}>
                              <span>Артикул:</span>
                              <span>
                                {variantDB.artical?.includes('|')
                                  ? variantDB.artical
                                      ?.split('|')[0]
                                      .toLocaleUpperCase()
                                  : variantDB.artical?.toLocaleUpperCase()}
                              </span>
                            </div>

                            {variantDB.artical?.includes('|') ? (
                              <div className={styles.ArticalWrapper}>
                                <span>
                                  {variantDB.artical
                                    .split('|')[1]
                                    .toLocaleUpperCase()}
                                </span>
                              </div>
                            ) : (
                              <></>
                            )}
                            {!variantDB.available ? (
                              <span className={styles.ColorPickerSpan}>
                                Нет в наличии
                              </span>
                            ) : (
                              <div className={styles.ColorPickerPriceWrapper}>
                                <span className={styles.ColorPickerSpan}>
                                  {variantDB.price} ₽
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        }
                      >
                        <li
                          style={{
                            border:
                              variantDB.artical == variant.artical
                                ? '1px solid #00000075'
                                : 'none',
                          }}
                          className={styles.ColorPickerThumbnailWrapper}
                          onClick={() => {
                            const currentOrderVariant =
                              product.productVariants?.find(
                                (variant) =>
                                  variant.artical == variantDB.artical,
                              );

                            if (currentOrderVariant) {
                              setVariant(currentOrderVariant);
                            }
                          }}
                        >
                          <div
                            className={styles.ColorPickerItems}
                            style={{
                              backgroundColor: variantDB.color?.code,
                            }}
                          >
                            <div
                              style={{
                                display: loadingComplet ? 'none' : 'flex',
                              }}
                              className={styles.LoaderMask}
                            />
                            <Image
                              style={{
                                width: '30px',
                                height: '30px',
                                opacity: loadingComplet ? 1 : 0,
                                position: loadingComplet
                                  ? 'inherit'
                                  : 'absolute',
                                zIndex: loadingComplet ? 1 : -1,
                              }}
                              src={`/api/images/compress/${
                                variantDB.images?.split(', ')[0]
                              }?qlty=10&width=50&height=50&lossless=true`}
                              alt={`${
                                product?.name?.includes('(')
                                  ? product.name.split('(')[0]
                                  : product?.name
                              } ${variantDB.artical!}`}
                              width={50}
                              height={50}
                              loading="lazy"
                              priority={false}
                              onLoadingComplete={() => setLoadingComplet(true)}
                            />
                            {!variantDB.available ? (
                              <div className={styles.not_available_mask}>
                                <div
                                  className={styles.inner_not_available_mask}
                                ></div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <span className={styles.preview_artical}>
                            {variantDB.artical?.includes('|')
                              ? variantDB.artical
                                  .split('|')[0]
                                  .toLocaleUpperCase()
                              : variantDB.artical?.includes(' ')
                              ? variantDB.artical
                                  .split(' ')[0]
                                  .toLocaleUpperCase()
                              : variantDB.artical?.toLocaleUpperCase()}
                          </span>
                        </li>
                      </ImageTooltip>
                    );
                  },
                )
              ) : (
                <></>
              )}
            </div>
          </div>
          {/* ----------- end of articale ------------ */}
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
              qty={findCartQTY(product, cart, variant)}
              variant={variant}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;

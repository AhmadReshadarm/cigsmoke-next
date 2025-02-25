import { getProductVariantsImages } from 'common/helpers/getProductVariantsImages.helper';
import color from 'components/store/lib/ui.colors';
import Link from 'next/link';
import { useAppSelector } from 'redux/hooks';
import { TCartState } from 'redux/types';
import styled from 'styled-components';
import { Product } from 'swagger/services';
import { AddToCart, AddToWishlist } from 'ui-kit/ProductActionBtns';
import { findCartQTY } from 'ui-kit/HeaderProductItems/helpers';
import styles from 'ui-kit/HeaderProductItems/headerProductItems.module.css';
import { checkIfItemInCart } from 'ui-kit/ProductActionBtns/helpers';

type Props = {
  product: Product;
  handleMenuState?: () => void;
};

const HeaderProductItmesHistory: React.FC<Props> = ({
  product,
  handleMenuState,
}) => {
  const { cart } = useAppSelector<TCartState>((state) => state.cart);

  if (checkIfItemInCart(product, cart!)) {
    return;
  }
  const images = getProductVariantsImages(product?.productVariants);

  return (
    <ProductItemWrapper>
      <>
        <Link
          onClick={() => (handleMenuState ? handleMenuState() : '')}
          href={`/product/${product?.url}`}
          prefetch={false}
        >
          <img
            src={`/api/images/${images[0]}`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/img_not_found.png';
            }}
          />
        </Link>
        <div className="product-details-wrapper">
          <div className="product-title-description-wrapper">
            <Link
              onClick={() => (handleMenuState ? handleMenuState() : '')}
              href={`/product/${product?.url}`}
              prefetch={false}
            >
              <h1>
                {product!?.name?.length! > 18
                  ? product!?.name?.slice(0, 18) + ' ...'
                  : product!?.name}
              </h1>
            </Link>
            {/* ------------ rating --------------- */}
            <div
              title={`${
                Math.floor(product!?.reviews?.length!) == 1
                  ? Math.floor(product!?.reviews?.length!) + ' Оценка'
                  : Math.floor(product!?.reviews?.length!) / 2 == 0
                  ? Math.floor(product!?.reviews?.length!) + ' Оценки'
                  : Math.floor(product!?.reviews?.length!) + ' Оценок'
              } `}
              className={styles.rating_wrapper}
              style={{
                display: product!?.reviews?.length! == 0 ? 'none' : 'flex',
              }}
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
              <span className={styles.review_text}>
                {Math.floor(product!?.reviews?.length!) == 1
                  ? Math.floor(product!?.reviews?.length!) + ' Оценка'
                  : Math.floor(product!?.reviews?.length!) / 2 == 0
                  ? Math.floor(product!?.reviews?.length!) + ' Оценки'
                  : Math.floor(product!?.reviews?.length!) + ' Оценок'}
              </span>
            </div>
            {/* ------------- end of rating ---------------- */}
            {/* ----------- color ------------------- */}
            <div
              style={{
                alignItems: 'center',
              }}
              className={styles.artical_wrapper}
            >
              <span>Цвет{`(а)`} : </span>
              {product?.productVariants!.map((variant, index) => {
                if (
                  variant.color?.url == '' ||
                  variant.color?.url == '-' ||
                  variant.color?.url == '_'
                ) {
                  return;
                }
                return (
                  <span
                    key={`${variant.color?.name}-${index}`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: variant.color?.code,
                      border: '1px solid rgb(129 129 129)',
                    }}
                    title={variant.color?.name}
                  />
                );
              })}
            </div>
            {/* ---------- end of color ----------- */}
          </div>

          <div className="price-sperator-wrapper">
            <div className="old-new-price-wrapper">
              <span
                style={{
                  display: !product?.productVariants![0].oldPrice
                    ? 'none'
                    : 'flex',
                }}
                className="old-price"
              >
                {product?.productVariants![0].oldPrice} ₽
              </span>
              <span>{product?.productVariants![0].price} ₽</span>
            </div>
          </div>
        </div>
        <div className="action-buttons-wrapper">
          <AddToWishlist product={product} />
          <AddToCart
            product={product}
            qty={findCartQTY(product, cart!)}
            variant={product?.productVariants![0]}
          />
        </div>
      </>
    </ProductItemWrapper>
  );
};

const ProductItemWrapper = styled.li`
  width: 100%;
  height: 200px;
  max-hight: 200px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  padding: 10px;
  background-color: ${color.backgroundPrimary};
  border: 1px solid #e5e2d9;
  border-radius: 30px;
  img {
    min-width: 180px;
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 30px;
  }
  .product-details-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 0;
    .product-title-description-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 15px;

      a {
        padding: 0;
        h1 {
          font-size: 1.4rem;
          font-weight: 600;
        }
      }
    }

    .price-sperator-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 40px;
      .old-new-price-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;

        .old-price {
          text-decoration: line-through;
          font-size: 0.8rem;
          color: ${color.textBase};
        }
      }

      .total-price-wrapper {
        font-size: 1.5rem;
      }
    }
  }

  .action-buttons-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 0 10px 10px 0;
    gap: 20px;
  }
`;

export default HeaderProductItmesHistory;

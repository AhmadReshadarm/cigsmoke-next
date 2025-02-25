import { getProductVariantsImages } from 'common/helpers/getProductVariantsImages.helper';
import Link from 'next/link';
import styled from 'styled-components';
import { OrderProduct, Product } from 'swagger/services';
import { devices } from '../lib/Devices';
import color from '../lib/ui.colors';
import { AddToCart, AddToWishlist } from 'ui-kit/ProductActionBtns';
import styles from './cartStyles.module.css';
type Props = {
  orderProduct: OrderProduct;
  product?: Product;
};

const CartItem: React.FC<Props> = ({ orderProduct, product }) => {
  const images = getProductVariantsImages(
    orderProduct.product?.productVariants,
  );

  return (
    <ProductItemWrapper>
      <a href={`/product/${orderProduct!.product?.url}`}>
        <img
          src={`/api/images/${images[0]}`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = '/img_not_found.png';
          }}
        />
      </a>
      <div className="product-details-wrapper">
        <div className="product-title-description-wrapper">
          <Link href={`/product/${orderProduct!.product?.url}`}>
            <h1>{orderProduct!?.product!?.name}</h1>
          </Link>

          {/* ------------ rating --------------- */}
          <div
            title={`${
              Math.floor(orderProduct!?.product!?.reviews?.length!) == 1
                ? Math.floor(orderProduct!?.product!?.reviews?.length!) +
                  ' Оценка'
                : Math.floor(orderProduct!?.product!?.reviews?.length!) / 2 == 0
                ? Math.floor(orderProduct!?.product!?.reviews?.length!) +
                  ' Оценки'
                : Math.floor(orderProduct!?.product!?.reviews?.length!) +
                  ' Оценок'
            } `}
            className={styles.rating_wrapper}
            style={{
              display:
                orderProduct!?.product!?.reviews?.length! == 0
                  ? 'none'
                  : 'flex',
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
              {Math.floor(orderProduct!?.product!?.reviews?.length!) == 1
                ? Math.floor(orderProduct!?.product!?.reviews?.length!) +
                  ' Оценка'
                : Math.floor(orderProduct!?.product!?.reviews?.length!) / 2 == 0
                ? Math.floor(orderProduct!?.product!?.reviews?.length!) +
                  ' Оценки'
                : Math.floor(orderProduct!?.product!?.reviews?.length!) +
                  ' Оценок'}
            </span>
          </div>
          {/* ------------- end of rating ---------------- */}
          {/* ----------- color ------------------- */}
          <div
            style={{
              alignItems: 'center',
              display:
                orderProduct?.productVariant?.color?.url == '-' ||
                orderProduct?.productVariant?.color?.url == '_' ||
                orderProduct?.productVariant?.color?.url == ''
                  ? 'none'
                  : 'flex',
            }}
            className={styles.artical_wrapper}
          >
            <span>Цвет : </span>
            {
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: orderProduct?.productVariant?.color?.code,
                  border: '1px solid rgb(129 129 129)',
                }}
              />
            }
          </div>
          {/* ---------- end of color ----------- */}
        </div>

        <div className="price-sperator-wrapper">
          <div className="old-new-price-wrapper">
            <span
              style={{
                display: !orderProduct!.productVariant?.oldPrice
                  ? 'none'
                  : 'flex',
              }}
              className="old-price"
            >
              {orderProduct!?.productVariant?.oldPrice} ₽
            </span>
            <span>
              {orderProduct!?.qty!}шт x {orderProduct!?.productVariant?.price} ₽
            </span>
          </div>
          <span className="total-price-wrapper">
            Итого:{orderProduct!?.qty! * orderProduct!?.productVariant?.price!}{' '}
            ₽
          </span>
        </div>
      </div>
      <div className="action-buttons-wrapper">
        <AddToWishlist product={orderProduct!?.product!} />
        <AddToCart
          product={orderProduct!?.product!}
          qty={orderProduct!?.qty!}
          variant={product?.productVariants![0]}
        />
      </div>
    </ProductItemWrapper>
  );
};

const ProductItemWrapper = styled.li`
  width: 100%;
  height: 200px;
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
          font-size: 1.1rem;
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

  @media ${devices.laptopS} {
    flex-direction: column;
    height: unset;
    img {
      width: 100%;
      height: 100%;
      min-width: unset;
      min-height: unset;
    }
    .action-buttons-wrapper {
      justify-content: flex-start;
    }
  }
  @media ${devices.tabletL} {
    flex-direction: column;
    height: unset;
    img {
      width: 100%;
      height: 100%;
      min-width: unset;
      min-height: unset;
    }
    .action-buttons-wrapper {
      justify-content: flex-start;
    }
  }
  @media ${devices.tabletS} {
    flex-direction: column;
    height: unset;
    img {
      width: 100%;
      height: 100%;
      min-width: unset;
      min-height: unset;
    }
    .action-buttons-wrapper {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  @media ${devices.mobileL} {
    flex-direction: column;
    height: unset;
    img {
      width: 100%;
      height: 100%;
      min-width: unset;
      min-height: unset;
    }
    .action-buttons-wrapper {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  @media ${devices.mobileM} {
    flex-direction: column;
    height: unset;
    img {
      width: 100%;
      height: 100%;
      min-width: unset;
      min-height: unset;
    }
    .action-buttons-wrapper {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  @media ${devices.mobileS} {
    flex-direction: column;
    height: unset;
    img {
      width: 100%;
      height: 100%;
      min-width: unset;
      min-height: unset;
    }
    .action-buttons-wrapper {
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

export default CartItem;

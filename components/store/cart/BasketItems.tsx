import CartItem from './cartItem';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { TCartState, TGlobalState } from 'redux/types';
import { handleRemoveClick } from './helpers';
import { useEffect, useState } from 'react';
import { fetchHistoryProducts } from 'redux/slicers/store/globalSlicer';
import styles from './cartStyles.module.css';
import HeaderProductItmesHistory from 'ui-kit/HeaderProductItemsHistory';
import CartItemLoader from './cartItemLoaders';
import { emptyLoading } from 'common/constants';

type Props = {};
const BasketItems: React.FC<Props> = ({}) => {
  const { cart, loading } = useAppSelector<TCartState>((state) => state.cart);
  const { historyProducts, loadingHistory } = useAppSelector<TGlobalState>(
    (state) => state.global,
  );
  const [cartProductIds, setCartProductIds] = useState(
    new Set(cart?.orderProducts!.map((item) => item.product!.id)),
  );
  const [hasAllProducts, setHasAllProducts] = useState(
    historyProducts.every((product) => cartProductIds.has(product.id)),
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const userHistoy = localStorage.getItem('history');
    if (userHistoy) {
      dispatch(fetchHistoryProducts({ userHistory: JSON.parse(userHistoy) }));
    }
  }, [cart]);

  useEffect(() => {
    setCartProductIds(
      new Set(cart?.orderProducts!.map((item) => item.product!.id)),
    );
  }, [cart, historyProducts]);

  useEffect(() => {
    setHasAllProducts(
      historyProducts.every((product) => cartProductIds.has(product.id)),
    );
  }, [cartProductIds, historyProducts]);

  return (
    <div className={styles.ItemsWrapper}>
      {cart?.orderProducts?.length && !loading ? (
        <div className={styles.action_btn_wrapper}>
          <button onClick={() => handleRemoveClick(dispatch)}>
            <span>ОЧИСТИТЬ КОРЗИНУ</span>
          </button>
        </div>
      ) : loading ? (
        <div className={styles.action_btn_wrapper}>
          <button className={styles.LoaderMask}></button>
        </div>
      ) : (
        <></>
      )}
      <ul className={styles.CartBody}>
        {cart?.orderProducts?.length && !loading ? (
          <>
            {cart?.orderProducts?.map((orderProduct, index) => {
              return (
                <CartItem
                  key={`cart-item-page-${index}`}
                  orderProduct={orderProduct}
                />
              );
            })}
          </>
        ) : loading ? (
          <>
            {emptyLoading.map((item, index) => {
              return <CartItemLoader key={index} />;
            })}
          </>
        ) : (
          <div
            style={{ justifyContent: 'center' }}
            className={styles.PopupBtnsDivider}
          >
            <h1 style={{ fontWeight: '600' }}>Ваша корзина пуста</h1>
          </div>
        )}
        {!historyProducts.length && loadingHistory ? (
          <>
            {emptyLoading.map((item, index) => {
              return <CartItemLoader key={index} />;
            })}
          </>
        ) : (
          <>
            {!hasAllProducts ? (
              <>
                <li style={{ width: '100%' }}>
                  <div
                    style={{ justifyContent: 'center' }}
                    className={styles.PopupBtnsDivider}
                  >
                    <h1 style={{ fontWeight: '600' }}>Вы смотрели</h1>
                  </div>
                </li>
                {historyProducts.map((historyProduct, index) => {
                  return (
                    <HeaderProductItmesHistory
                      key={`history-item-${index}`}
                      product={historyProduct}
                    />
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default BasketItems;

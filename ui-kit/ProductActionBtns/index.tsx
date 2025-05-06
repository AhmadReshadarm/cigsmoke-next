import { motion } from 'framer-motion';
import { Product, ProductVariant } from 'swagger/services';
import { checkIfItemInCart, checkIfItemInWishlist } from './helpers';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { TCartState, TWishlistState } from 'redux/types';
import {
  handleAddToCartBtnClick,
  handleCartBtnClick,
  handleWishBtnClick,
} from 'ui-kit/products/helpers';
import { useState } from 'react';
import styles from './ProductActionBtns.module.css';
import dynamic from 'next/dynamic';
const ItemCounter = dynamic(() => import('ui-kit/ItemCounter'));

type PropsCart = {
  product: Product;
  qty: number;
  variant: ProductVariant | undefined;
};

export const AddToCart: React.FC<PropsCart> = ({ product, qty, variant }) => {
  const { cart, countLoading } = useAppSelector<TCartState>(
    (state) => state.cart,
  );

  const dispatch = useAppDispatch();

  // -------------------- UI Hooks ---------------------
  const [isAdding, setIsAdding] = useState(false);

  // ------------------- end of UI Hooks --------------------

  return (
    <>
      {!checkIfItemInCart(product, cart!) ? (
        <motion.button
          onClick={async () => {
            setIsAdding(true);
            try {
              await handleAddToCartBtnClick(
                product,
                dispatch,
                variant!,
                cart!,
              )();
            } finally {
              setIsAdding(false);
            }
          }}
          disabled={countLoading ? true : false}
          title={`Добавить ${product.name} в корзину`}
          type="button"
          className={styles.CartButtonWrapper}
        >
          <motion.div
            initial={{ height: '0%', width: '0%' }}
            animate={{ height: '100%', width: '100%' }}
            transition={{ duration: 0.15 }}
            className={styles.content_wrapper}
          >
            {countLoading && isAdding ? (
              <div className={styles.Loader} />
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                В КОРЗИНУ
              </motion.span>
            )}
          </motion.div>
          <div className={styles.content_indecator}></div>
        </motion.button>
      ) : (
        <ItemCounter product={product} qty={qty} />
      )}
    </>
  );
};

type PropsWishlist = {
  product: Product;
};

export const AddToWishlist: React.FC<PropsWishlist> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { wishlist, loading }: TWishlistState = useAppSelector(
    (state) => state.wishlist,
  );

  // -------------------- UI Hooks ---------------------

  const [productId, setProductId] = useState('');

  // ------------------- end of UI Hooks --------------------

  return (
    <button
      onClick={handleWishBtnClick(product, dispatch, wishlist!)}
      onMouseDown={() => {
        setProductId('');
        setProductId(product.id!);
        setTimeout(() => setProductId(''), 1000);
      }}
      disabled={loading ? true : false}
      title={
        checkIfItemInWishlist(product, wishlist!)
          ? `Удалить ${product.name} из избранного`
          : `Добавить ${product.name} в избранное`
      }
      type="button"
      className={styles.WishlistButtonWrapper}
    >
      <div
        className={styles.InWishlistButtonContent}
        style={{
          background: checkIfItemInWishlist(product, wishlist!)
            ? `linear-gradient(
      90deg,
      #cda172 -6.8%,
      #fef5ca 34.14%,
      #fff8d7 38.26%,
      #fdf3c8 66.52%,
      #cda172 107.04%
    )`
            : `linear-gradient(94deg, #f2d099 9.58%, #c6986a 106.37%)`,
          border: checkIfItemInWishlist(product, wishlist!)
            ? `1px solid #00000017`
            : `none`,
        }}
      >
        {loading && productId === product.id ? (
          <div className={styles.Loader} />
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="wishlist-text-wrapper"
            style={{
              fontSize: checkIfItemInWishlist(product, wishlist!)
                ? '0.7rem'
                : '',
            }}
          >
            {checkIfItemInWishlist(product, wishlist!)
              ? 'УЖЕ В ИЗБРАННОЕ'
              : 'В ИЗБРАННОЕ'}
          </motion.span>
        )}
        <div className={styles.content_indecator}></div>
      </div>
    </button>
  );
};

export const CartWishlistBtn: React.FC<PropsWishlist> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { wishlist, loading }: TWishlistState = useAppSelector(
    (state) => state.wishlist,
  );
  return (
    <button
      onClick={handleWishBtnClick(product, dispatch, wishlist!)}
      className={styles.cartWishlistBtnWrapper}
      disabled={loading ? true : false}
      title={
        checkIfItemInWishlist(product, wishlist!)
          ? `Удалить ${product.name} из избранного`
          : `Добавить ${product.name} в избранное`
      }
      type="button"
    >
      {checkIfItemInWishlist(product, wishlist!) ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
        >
          <path
            fill="#F8104B"
            fill-rule="evenodd"
            d="M12 22c-.316-.02-.56-.147-.848-.278a23.5 23.5 0 0 1-4.781-2.942C3.777 16.705 1 13.449 1 9a6 6 0 0 1 6-6 6.18 6.18 0 0 1 5 2.568A6.18 6.18 0 0 1 17 3a6 6 0 0 1 6 6c0 4.448-2.78 7.705-5.375 9.78a23.6 23.6 0 0 1-4.78 2.942c-.543.249-.732.278-.845.278"
            clip-rule="evenodd"
          ></path>
        </svg>
      ) : (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26.7963 7.07956C25.1124 5.09388 22.7694 4 20.1975 4C18.7152 4 17.2811 4.33729 16.0003 4.97898C14.7209 4.33729 13.2854 4 11.8031 4C9.23124 4 6.88819 5.09388 5.20437 7.07956C3.38012 9.23072 2.6234 12.1675 3.17861 14.9364C4.47105 21.3722 11.1777 25.845 14.0019 27.4694C14.6182 27.8218 15.3086 28 15.999 28C16.6894 28 17.3812 27.8219 17.9975 27.4682C20.8216 25.845 27.5283 21.3722 28.8207 14.9364C29.3772 12.1675 28.6205 9.23072 26.7963 7.07956ZM26.2684 14.4514C25.1775 19.883 19.195 23.843 16.6739 25.2931C16.2591 25.5306 15.7416 25.5306 15.3268 25.2931C12.8056 23.843 6.82188 19.883 5.73228 14.4514C5.324 12.4165 5.87661 10.2602 7.21327 8.68503C8.39389 7.29177 10.0244 6.52632 11.8044 6.52632C13.0657 6.52632 14.2749 6.86357 15.3008 7.50021C15.7273 7.76421 16.2734 7.76421 16.6998 7.50021C17.727 6.86357 18.935 6.52632 20.1962 6.52632C21.9775 6.52632 23.608 7.29177 24.7874 8.68503C26.124 10.2602 26.6779 12.4165 26.2684 14.4514Z"
            fill="#545454"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.6738 25.2931C19.195 23.843 25.1775 19.883 26.2683 14.4514C26.6779 12.4165 26.124 10.2602 24.7873 8.68506C23.6081 7.29175 21.9775 6.52631 20.1963 6.52631C18.935 6.52631 17.727 6.86359 16.6999 7.50018C16.2734 7.76422 15.7273 7.76422 15.3007 7.50018C14.2749 6.86359 13.0656 6.52631 11.8044 6.52631C10.0244 6.52631 8.39376 7.29175 7.21334 8.68506C5.87667 10.2602 5.32394 12.4165 5.73214 14.4514C6.82174 19.883 12.8056 23.843 15.3269 25.2931C15.7414 25.5306 16.259 25.5306 16.6738 25.2931Z"
            fill="white"
          />
        </svg>
      )}
    </button>
  );
};

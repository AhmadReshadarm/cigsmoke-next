import { useAppSelector } from 'redux/hooks';
import { TWishlistState } from 'redux/types';
import { useEffect, useState } from 'react';
import ItemWishlist from './ItemWishlist';
import { emptyLoading } from 'common/constants';
import CartItemLoader from '../cart/cartItemLoaders';
import styles from './wishlistStyles.module.css';

const WishlistItems = () => {
  const { wishlist, loading }: TWishlistState = useAppSelector(
    (state) => state.wishlist,
  );

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

  return (
    <div className={styles.ItemWrapper}>
      <ul className={styles.CartBody}>
        {wishlist?.items?.length && !loading ? (
          <>
            {wishlist.products!.map((product, index) => {
              return (
                <ItemWishlist key={index} index={index} product={product} />
              );
            })}
          </>
        ) : loading ? (
          <>
            {emptyLoading.map((item, index) => {
              return <CartItemLoader key={index} windowWidth={windowWidth} />;
            })}
          </>
        ) : (
          <div className={styles.NoCartItem}>
            <h2>Список избранного пуста</h2>
          </div>
        )}
      </ul>
    </div>
  );
};

export default WishlistItems;

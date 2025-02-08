import { emptyLoading } from 'common/constants';
import { sizesNum } from 'components/store/lib/Devices';
import { useEffect, useState } from 'react';
import styles from './styles/productItem.module.css';
const Loader = () => {
  return (
    <>
      <div className="section-title-wrapper">
        <div
          className={styles.LoaderMask}
          style={{ width: '150px', height: '50px' }}
        />
        <ul className="best-product-grid-wrapper">
          {emptyLoading.map((item, index) => {
            return <LoaderItem index={index} />;
          })}
        </ul>
      </div>
    </>
  );
};

export const LoaderItem = ({ index }) => {
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

  const calculateImageSize = (windowWidth: number) => {
    switch (true) {
      // laptopM
      case sizesNum.laptopS < windowWidth && windowWidth < sizesNum.laptopM:
        return {
          minMaxheight: windowWidth / 5 - 20,
          minMaxWidth: windowWidth / 5 - 30,
          width: 100,
        };
      // laptopS
      case sizesNum.tabletL < windowWidth && windowWidth < sizesNum.laptopS:
        return {
          minMaxheight: windowWidth / 4 - 10,
          minMaxWidth: windowWidth / 4 - 30,
          width: 100,
        };
      // tabletL
      case sizesNum.tabletM < windowWidth && windowWidth < sizesNum.tabletL:
        return {
          minMaxheight: windowWidth / 3 - 10,
          minMaxWidth: windowWidth / 3 - 30,
          width: 100,
        };
      // tabletM
      case sizesNum.tabletS < windowWidth && windowWidth < sizesNum.tabletM:
        return {
          minMaxheight: windowWidth / 2 - 10,
          minMaxWidth: windowWidth / 2 - 30,
          width: 100,
        };
      // tabletS,
      case sizesNum.mobileL < windowWidth && windowWidth < sizesNum.tabletS:
        return {
          minMaxheight: windowWidth / 2 - 10,
          minMaxWidth: windowWidth / 2 - 30,
          width: 100,
        };
      // mobileL, mobileM, mobileS, mobileES
      case sizesNum.mobileES < windowWidth && windowWidth < sizesNum.mobileL:
        return {
          minMaxheight: windowWidth - 10,
          minMaxWidth: windowWidth - 30,
          width: 100,
        };
      default:
        return {
          minMaxWidth: 190,
          minMaxheight: 190,
          width: 100,
        };
    }
  };

  const [wrapperSizes, setWrapperSizes] = useState({
    minMaxWidth: calculateImageSize(windowWidth).minMaxWidth,
    minMaxheight: calculateImageSize(windowWidth).minMaxheight,
    width: calculateImageSize(windowWidth).width,
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

  const [wrapperSizesContainer, setWrapperSizesContainer] = useState({
    minMaxWidth: calculateImageSizeContainer(windowWidth).minMaxWidth,
  });
  useEffect(() => {
    setWrapperSizes({
      minMaxWidth: calculateImageSize(windowWidth).minMaxWidth,
      minMaxheight: calculateImageSize(windowWidth).minMaxheight,
      width: calculateImageSize(windowWidth).width,
    });
    setWrapperSizesContainer({
      minMaxWidth: calculateImageSizeContainer(windowWidth).minMaxWidth,
    });
  }, [windowWidth]);

  return (
    <li
      className={styles.ItemContainer_dummy_data}
      key={index}
      style={{
        minWidth: `${wrapperSizesContainer.minMaxWidth}px`,
        maxWidth: `${wrapperSizesContainer.minMaxWidth}px`,
      }}
    >
      <div className={styles.ItemWrapper}>
        <div
          className={styles.ImageSliderWrapper}
          style={{
            minWidth: `${wrapperSizes.minMaxWidth}px`,
            maxWidth: `${wrapperSizes.minMaxWidth}px`,
            minHeight: `${wrapperSizes.minMaxheight}px`,
            maxHeight: `${wrapperSizes.minMaxheight}px`,
            width: `${wrapperSizes.width}%`,
          }}
        >
          <div className={styles.ImageSliderSlide}>
            <div
              className={styles.LoaderMask}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        <div className={styles.product_title_add_to_card_wrapper}>
          <span>
            {
              <div
                className={styles.LoaderMask}
                style={{ width: '100%', height: '20px' }}
              />
            }
          </span>

          <div className={styles.product_price_wrapper}>
            <span>
              <div
                className={styles.LoaderMask}
                style={{ width: '80px', height: '15px' }}
              />
            </span>
          </div>
          <div className={styles.product_title}>
            <div
              className={styles.LoaderMask}
              style={{ width: '80px', height: '15px' }}
            />
          </div>
          <div className={styles.action_buttons_wrapper}>
            <div
              className={styles.LoaderMask}
              style={{
                width: '150px',
                height: '50px',
                borderRadius: '30px',
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default Loader;

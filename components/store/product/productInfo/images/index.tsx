import Slider from './Slider';
import { Product } from 'swagger/services';
import { Dispatch, SetStateAction } from 'react';
import styles from '../../styles/images.module.css';
import { useAppSelector } from 'redux/hooks';
import { TCartState } from 'redux/types';
import Image from 'next/image';

type Props = {
  product?: Product;
  images: string[];
  selectedIndex: number;
  direction: number;
  page: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  paginateImage: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<[number, number]>>;
  base64Image: any;
  zoomEnabeld: boolean;
};

const Images: React.FC<Props> = ({
  selectedIndex,
  direction,
  product,
  images,
  page,
  setSelectedIndex,
  paginateImage,
  base64Image,
  zoomEnabeld,
}) => {
  const { variant } = useAppSelector<TCartState>((state) => state.cart);
  let imagess;
  if (variant) {
    imagess = variant!.images ? variant!.images.split(', ') : [];
  }
  return (
    <div className={styles.ImagesContainer}>
      {variant ? (
        <ul
          className={styles.thumbnails_wrapper}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          {imagess.map((image, index) => {
            console.log(`/api/images/${image}`);

            return (
              <li className={styles.thumbnails_circle} key={index}>
                {' '}
                <Image
                  // style={{
                  //   width: '50px',
                  //   height: '50px',
                  // }}
                  // src={`/api/images/compress/${variant.image}?qlty=10&width=50&height=50&lossless=true`} // `/api/images/${variant.image}`
                  src={`/api/images/${image}`}
                  // src={`/api/images/${variant.image}`}
                  // alt={variant.image}
                  alt={image}
                  width={50}
                  height={50}
                  loading="lazy"
                  priority={false}
                  // onLoadingComplete={() => setLoadingComplet(true)}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <>loading...</>
      )}
      <Slider
        images={images}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        direction={direction}
        page={page}
        paginateImage={paginateImage}
        alt={product?.name}
        base64Image={base64Image}
        zoomEnabeld={zoomEnabeld}
      />
    </div>
  );
};

export default Images;

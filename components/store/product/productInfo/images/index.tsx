import Slider from './Slider';
import { Product } from 'swagger/services';
import { Dispatch, SetStateAction } from 'react';
import styles from '../../styles/images.module.css';
import { useAppSelector } from 'redux/hooks';
import { TCartState } from 'redux/types';
import Image from 'next/image';
import { emptyLoading } from 'common/constants';

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
  let thumbnaiImages: string[] = [];
  const imagesWithUrlUI: string[] = [];
  if (variant) {
    thumbnaiImages = variant!.images ? variant!.images.split(', ') : [];
    for (let i = 0; i < thumbnaiImages?.length; i++) {
      imagesWithUrlUI.push(`/api/images/${thumbnaiImages[i]}`);
    }
  }
  const handleImageChange =
    (
      index: number,
      selectedIndex: number,
      setSelectedIndex: (index: number) => void,
      paginateImage: (index: number) => void,
    ) =>
    () => {
      setSelectedIndex(index);

      if (index != selectedIndex) {
        paginateImage(selectedIndex > index ? -1 : 1);
      }
    };

  return (
    <div className={styles.ImagesContainer}>
      {variant ? (
        <ul
          className={styles.thumbnails_wrapper}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          {thumbnaiImages.map((image, index) => {
            return (
              <li
                className={styles.thumbnails_circle}
                key={index}
                onClick={handleImageChange(
                  index,
                  selectedIndex,
                  setSelectedIndex,
                  paginateImage,
                )}
                onMouseOver={handleImageChange(
                  index,
                  selectedIndex,
                  setSelectedIndex,
                  paginateImage,
                )}
              >
                <Image
                  src={`/api/images/${image}`}
                  alt={image}
                  width={65}
                  height={65}
                  loading="lazy"
                  priority={false}
                  style={{
                    border: selectedIndex == index ? '2px solid white' : 'none',
                  }}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className={styles.thumbnails_wrapper}>
          {emptyLoading.map((data, index) => (
            <li key={index} className={styles.thumbnails_circle}>
              <div className={styles.LoaderMask}></div>
            </li>
          ))}
        </ul>
      )}
      <Slider
        images={variant ? imagesWithUrlUI : images}
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

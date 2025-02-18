import { Carousel, Image, Checkbox } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { imageFallback } from 'common/constants';
import { ProductVariant, Tag } from 'swagger/services';
import { handleRedirectCategory } from '../categories/helpers';

import ActionButtons from '../generalComponents/ActionButtons';
import { handleRedirectTags } from '../tags/helpers';
import { handleDeleteProduct, handleRedirectProducts } from './helpers';
import styles from './products.module.scss';
import TableLink from './TableLink';
import { addSelectedProducts } from 'redux/slicers/store/catalogSlicer';
const isChecked = (selectedProducts, productId) => {
  return selectedProducts.find(
    (selectedProductId) => selectedProductId === productId,
  );
};
export const columns: ColumnsType<any> = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: '3.5%',
    render: (value, record) => {
      const checked = isChecked(record.selectedProducts, value);

      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          {record.isCheckBoxEnabled ? (
            <Checkbox
              checked={checked}
              onChange={(evt) => {
                let newData: string[] = [];
                if (
                  record.selectedProducts.length === 0 &&
                  evt.target.checked
                ) {
                  newData.push(value);
                  record.dispatch(addSelectedProducts(newData));
                }
                if (record.selectedProducts.length > 0) {
                  newData = record.selectedProducts.filter((selectedIds) => {
                    if (selectedIds !== value) {
                      return selectedIds;
                    }
                  });
                  if (evt.target.checked) {
                    newData.push(value);
                  }
                  record.dispatch(addSelectedProducts(newData));
                }
              }}
            />
          ) : (
            ''
          )}
          <p>{value}</p>
        </div>
      );
    },
  },
  {
    title: 'Изображения',
    dataIndex: 'images',
    render: (_, record) => {
      if (record.productVariants) {
        const images: string[] = [];
        record.productVariants.map((variant: any) => {
          const variantImages = variant.images?.split(', ');
          variantImages.map((image) => {
            images.push(image);
          });
        });

        return (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid',
            }}
          >
            <Carousel effect="fade">
              {(images as unknown as string[])?.map((image, index) => {
                if (image) {
                  return (
                    <div key={`${image}-${index}`}>
                      <Image
                        className={styles.productsTable__contentStyle}
                        src={`/api/images/${image}`}
                        fallback={imageFallback}
                      />
                    </div>
                  );
                }
                return (
                  <img
                    key={'not-found-key'}
                    src="/img_not_found.png"
                    className={styles.image}
                  />
                );
              })}
            </Carousel>
          </div>
        );
      }
    },
    width: '8%',
  },
  {
    title: 'Имя',
    dataIndex: 'name',
    width: '7.5%',
  },
  {
    title: 'Категория',
    render: (_, record) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <TableLink
            id={record.category?.parent?.id as string}
            name={record.category?.parent?.name}
            handleRedirect={handleRedirectCategory}
          />
          <span>
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L4.84375 5.53125L1.03125 9.34375"
                stroke="#AAB4BD"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <TableLink
            id={record.category!.id as string}
            name={record.category!.name}
            handleRedirect={handleRedirectCategory}
          />
        </div>
      );
    },
    width: '12%',
  },
  {
    title: 'URL',
    dataIndex: 'url',
    render: (_, record) => {
      return (
        <>
          <a
            target="__blank"
            href={`/product/${record.url}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '5px',
            }}
            title={record.url}
          >
            {record.url?.slice(0, 20)}
            <img
              src="/icons/blank.png"
              alt="target blank"
              style={{ width: '10px' }}
            />
          </a>
        </>
      );
    },
    width: '10%',
  },
  {
    title: 'Коллекции',
    dataIndex: 'tags',
    render: (_, record) => {
      return (
        <ul>
          {(record?.tags as Tag[]).map((tag) => (
            <li key={tag.id}>
              <TableLink
                id={tag!.id as string}
                name={tag!.name as string}
                handleRedirect={handleRedirectTags}
              />
            </li>
          ))}
        </ul>
      );
    },
    width: '8%',
  },
  {
    title: 'Артикул | Цена | Статус на складе',
    dataIndex: 'price',
    render: (_, record) => {
      return (
        <ul>
          {(record?.productVariants as ProductVariant[]).map((variant) => (
            <li
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '5px',
              }}
              key={variant.id}
            >
              <span>{variant.artical}</span>
              <span> | </span>
              <span>{variant.price} ₽</span>
              <span> | </span>
              <span>В наличии</span>
              <span>:</span>
              <span>{variant.available ? 'да' : 'нет'}</span>
            </li>
          ))}
        </ul>
      );
    },
    width: '15%',
  },

  {
    title: 'Действия',
    render: (_, record) => {
      return (
        <ActionButtons
          id={record.id as string}
          handleDelete={handleDeleteProduct}
          handleRedirect={handleRedirectProducts}
          option={'products'}
          title="продукт"
        />
      );
    },
    width: '7.5%',
  },
];

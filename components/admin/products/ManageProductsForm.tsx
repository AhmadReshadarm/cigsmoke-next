import { Button, Form, Input, Select, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { navigateTo } from 'common/helpers/navigateTo.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  clearImageList,
  setDefaultImageList,
} from 'redux/slicers/mutipleImagesSlicer';
import { TMultipleImageState, TProductState } from 'redux/types';
import { Page } from 'routes/constants';
import { Category, Color, Tag } from 'swagger/services';

import FormItem from '../generalComponents/FormItem';
import { handleFormSubmitProduct, initialValuesConverter } from './helpers';
import { ManageProductFields } from './ManageProductsFields.enum';
import styles from './products.module.scss';
import ProductVariantForm from './ProductVariantForm';

const { Option } = Select;

type Props = {
  title: string;
  editMode: boolean;
  tags: Tag[];
  colors: Color[];
  categories: Category[];
};

const ManageProductForm = ({
  title,
  editMode,
  tags,
  colors,
  categories,
}: Props) => {
  const { chosenProduct, loading, saveLoading } = useAppSelector<TProductState>(
    (state) => state.products,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const [variants, setVariants] = useState<any[]>([]);
  const [charictristicProduct, setCharictristicProduct] = useState<
    Record<number, any[]>
  >({});
  const [isInitialSpecs, setIsInitialSpecs] = useState(false);

  const { imagesMap } = useAppSelector<TMultipleImageState>(
    (state) => state.multipleImages,
  );

  useEffect(() => {
    // ---------------------------------------------------------------
    // set UI Varaints Ids in edit mode from DB id
    if (chosenProduct?.productVariants && editMode) {
      const initialVariants = chosenProduct.productVariants.map((v) => ({
        id: v.id,
      }));
      setVariants(initialVariants);
    }

    // ---------------------------------------------------------------
    // Initialize images
    if (chosenProduct && editMode) {
      chosenProduct!.productVariants?.forEach((variant, index) => {
        const images = variant.images?.split(', ').map((image, index) => ({
          uid: `${variant.id}-${index}`,
          name: image,
          url: `/api/images/${image}`,
        }));
        images?.forEach((image) => {
          dispatch(setDefaultImageList({ file: image, index: variant.id }));
        });
      });
    }
    return () => {
      dispatch(clearImageList());
    };
  }, [chosenProduct]);

  useEffect(() => {
    //  set intial values from DB in edit mode
    if (
      chosenProduct &&
      editMode &&
      variants.length !== 0 &&
      charictristicProduct &&
      !isInitialSpecs
    ) {
      const values = initialValuesConverter(
        chosenProduct,
        variants,
        charictristicProduct,
      );
      form.setFieldsValue(values); // Update form fields
    }
  }, [variants, charictristicProduct]);
  //
  const handleAddVariant = () => {
    setIsInitialSpecs(true);
    const uniqueId = Math.floor(Math.random() * 5000);
    setVariants((prev) => prev.concat({ id: uniqueId }));
  };

  const filteredTags = tags.map((tag) => {
    return { value: tag.id, label: tag.name };
  });

  return (
    <>
      <div className={styles.createProductHeader}>
        <h1 className={styles.createProductHeader__title}>{title}</h1>
      </div>
      {(loading || !chosenProduct) && editMode ? (
        <Spin className={styles.spinner} size="large" />
      ) : (
        <Form
          layout="vertical"
          onFinish={handleFormSubmitProduct(
            router,
            dispatch,
            imagesMap,
            variants.length,
            charictristicProduct,
            variants,
          )}
          form={form}
          requiredMark={true}
          className={styles.createProductForm}
        >
          {/* ----------------------NAME---------------------- */}
          <FormItem
            option={ManageProductFields.Name}
            children={
              <Input required={true} placeholder="Введите имя продукта" />
            }
          />
          {/* ----------------------ULR---------------------- */}
          <FormItem
            option={ManageProductFields.Url}
            children={
              <Input required={true} placeholder="Введите Url продукта" />
            }
          />
          {/* ----------------------DESCRIPTION---------------------- */}

          <FormItem
            option={ManageProductFields.Desc}
            children={
              <TextArea required={true} rows={10} placeholder="Описание" />
            }
          />

          {/* ----------------------SHORT DESCRIPTION---------------------- */}
          <FormItem
            option={ManageProductFields.ShortDesc}
            children={
              <TextArea
                required={true}
                rows={10}
                placeholder="Краткое описание"
              />
            }
          />
          {/* ----------------------KEYWORDS---------------------- */}
          <FormItem
            option={ManageProductFields.Keywords}
            children={
              <TextArea
                required={true}
                rows={10}
                placeholder="ключевые слова SEO"
              />
            }
          />
          {/* ----------------------CATEGORIES---------------------- */}
          <Form.Item label="Категория" name="category" required>
            <Select style={{ width: '100%', height: '50px' }}>
              {categories?.map((item) => {
                return (
                  <Option
                    key={item.id}
                    value={item.id}
                    style={{ padding: '10px' }}
                  >
                    <div
                      style={{
                        borderBottom: '1px solid #4096FF',
                      }}
                    >
                      <p style={{ fontWeight: '600', fontSize: '1rem' }}>
                        {item.parent?.name}{' '}
                        <svg
                          width="6"
                          height="10"
                          viewBox="0 0 6 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1.5L4.84375 5.53125L1.03125 9.34375"
                            stroke="#4096FF"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>{' '}
                        {item.name}
                      </p>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {/* ----------------------TAGS---------------------- */}
          <Form.Item label="коллекция" name="tags" style={{ height: '50px' }}>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: '100%',
                height: '50px',
              }}
              placeholder={`Выберите несколько или одну коллекцию`}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={filteredTags}
            />
          </Form.Item>

          {/* ----------------------PRODUCT VARIANTS---------------------- */}
          <h2 style={{ fontSize: '2rem', padding: '30px 0' }}>
            Варианты товара
          </h2>
          <div className={styles['product-variants']}>
            {variants.map((variant, index) => (
              <ProductVariantForm
                key={`product-variant-${variant.id}`}
                colors={colors}
                index={index}
                variantId={variant.id}
                setVariants={setVariants}
                imagesList={imagesMap[variant.id] || []}
                isInitialSpecs={isInitialSpecs}
                setCharictristicProduct={setCharictristicProduct}
                editMode={editMode}
                setIsInitialSpecs={setIsInitialSpecs}
                form={form}
              />
            ))}
            <Button
              style={{ width: '200px' }}
              type="primary"
              onClick={handleAddVariant}
            >
              Добавить вариант
            </Button>
          </div>

          {/* ----------------------THE END OF INPUTS---------------------- */}
          <Form.Item className={styles.createProductForm__buttonsStack}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.createProductForm__buttonsStack__submitButton}
              loading={saveLoading}
            >
              {editMode ? 'Сохранить' : 'Создать'}
            </Button>
            <Button
              type="primary"
              onClick={navigateTo(router, Page.ADMIN_PRODUCTS)}
            >
              Вернуться назад
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default ManageProductForm;

import { Button, Form, Input, List, Select, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { generateArrayOfNumbers } from 'common/helpers/array.helper';
import { navigateTo } from 'common/helpers/navigateTo.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  clearImageList,
  setDefaultImageList,
} from 'redux/slicers/mutipleImagesSlicer';
import { TMultipleImageState } from 'redux/types';
import { Page } from 'routes/constants';
import {
  // Brand,
  Category,
  Color,
  ParameterProduct,
  Product,
  // Size,
  Tag,
} from 'swagger/services';

import FormItem from '../generalComponents/FormItem';
import {
  handleCategoryChange,
  handleFormSubmitProduct,
  initialValuesConverter,
  handleParameterChange,
} from './helpers';
import { ManageProductFields } from './ManageProductsFields.enum';
import styles from './products.module.scss';
import ProductVariantForm from './ProductVariantForm';

const { Option } = Select;

type Props = {
  products: Product[];
  product?: Product;
  title: string;
  isLoading: boolean;
  isSaveLoading: boolean;
  editMode: boolean;
  tags: Tag[];
  // sizes: Size[];
  colors: Color[];
  categories: Category[];
};

const ManageProductForm = ({
  title,
  products,
  product,
  isLoading,
  isSaveLoading,
  editMode,
  tags,
  // sizes,
  colors,
  categories,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const [curCategory, setCurCategory] = useState<Category>();
  const [variants, setVariants] = useState<any[]>([]);
  const [charictristicProduct, setCharictristicProduct] = useState<any[]>([]);
  const [parameterProducts, setParameterProducts] = useState<
    ParameterProduct[]
  >([]);
  // const initialValues = initialValuesConverter(product as Product, variants);
  const [initialValues, setInitialValues] = useState<any>({});
  const { imagesMap } = useAppSelector<TMultipleImageState>(
    (state) => state.multipleImages,
  );

  useEffect(() => {
    for (let index = 0; index < product?.productVariants?.length!; index++) {
      initialValues[index]?.forEach((image) => {
        dispatch(setDefaultImageList({ file: image, index }));
      });
    }

    if (product && variants.length > 0) {
      const values = initialValuesConverter(product, variants);
      setInitialValues(values);
      form.setFieldsValue(values); // Update form fields
    }
    setCurCategory(product?.category);
    setParameterProducts(
      product?.category?.parameters?.map((parameter) => {
        const parameterProduct = product.parameterProducts?.find(
          (parameterProduct) => parameterProduct.parameterId === parameter.id,
        );

        return {
          parameter: parameter,
          value: parameterProduct?.value,
        };
      })!,
    );
    if (product?.productVariants && editMode) {
      const initialVariants = product.productVariants.map((v) => ({
        id: v.id,
      }));
      setVariants(initialVariants);
    }
    // setVariants(generateArrayOfNumbers(product?.productVariants?.length ?? 0));
    return () => {
      dispatch(clearImageList());
    };
  }, [product]);

  const handleAddVariant = () => {
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
      {(isLoading || !product) && editMode ? (
        <Spin className={styles.spinner} size="large" />
      ) : (
        <Form
          layout="vertical"
          onFinish={handleFormSubmitProduct(
            router,
            dispatch,
            imagesMap,
            parameterProducts,
            variants.length,
            charictristicProduct,
            variants,
            // editorModal,
          )}
          form={form}
          // initialValues={initialValues}
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
                placeholder="Краткое описание, Не более 350 символов"
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
                placeholder="Введите keywords | Пользователь ',' между каждым ключевым словом, Например: ключевое слово-1, ключевое слово-2."
              />
            }
          />
          {/* ----------------------CATEGORIES---------------------- */}
          <Form.Item label="Категория" name="category" required>
            <Select
              onChange={handleCategoryChange(
                categories,
                setCurCategory,
                setParameterProducts,
              )}
              style={{ width: '100%', height: '50px' }}
            >
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
            {/* {tags?.map((item) => (
                <Option
                  key={item.id}
                  value={item.id}
                  style={{ padding: '10px' }}
                >
                  <p
                    style={{
                      fontWeight: '600',
                      fontSize: '1rem',
                      borderBottom: '1px solid #4096FF',
                    }}
                  >
                    {`${item.name}`}
                  </p>
                </Option>
              ))} */}
            {/* </Select> */}
          </Form.Item>

          {/* ----------------------PRODUCT VARIANTS---------------------- */}
          <h2 style={{ fontSize: '26px', marginBottom: '20px' }}>
            Варианты продукта
          </h2>
          <div className={styles['product-variants']}>
            {variants.map((variant, index) => (
              <ProductVariantForm
                key={`product-variant-${index}`}
                colors={colors}
                index={index}
                variants={variants}
                setVariants={setVariants}
                imagesList={imagesMap[index]}
                charictristicProduct={charictristicProduct}
                setCharictristicProduct={setCharictristicProduct}
                variant={variant}
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
          {/* ----------------------IMAGES LIST---------------------- */}
          {!!curCategory?.parameters?.length && (
            <>
              <h2 style={{ marginBottom: '10px' }}>Список характеристик</h2>
              <span>
                Оставьте пустым или добавьте тире - или подчеркните _, чтобы
                скрыть эту опцию на стороне клиента.
              </span>
              <List
                bordered={true}
                itemLayout="horizontal"
                dataSource={parameterProducts}
                style={{ marginBottom: '20px' }}
                renderItem={(parameterProduct, index) => (
                  <List.Item className={styles['list-item']}>
                    <span className={styles['list-item__title']}>
                      {parameterProduct.parameter?.name}
                    </span>
                    <Input
                      value={parameterProduct.value}
                      placeholder={'Ввдедите Значение характеристики'}
                      onChange={handleParameterChange(
                        index,
                        setParameterProducts,
                      )}
                    />
                  </List.Item>
                )}
              />
            </>
          )}
          {/* ----------------------THE END OF INPUTS---------------------- */}
          <Form.Item className={styles.createProductForm__buttonsStack}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.createProductForm__buttonsStack__submitButton}
              loading={isSaveLoading}
            >
              {products ? 'Сохранить' : 'Создать'}
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

import {
  deleteProduct,
  fetchProducts,
  createProduct,
  editProduct,
} from 'redux/slicers/productsSlicer';
import { AppDispatch } from 'redux/store';
import {
  hasWhiteSpace,
  navigateTo,
  openErrorNotification,
} from '../../../common/helpers';
import { NextRouter } from 'next/router';
import { Page, paths } from 'routes/constants';
import { TableProps } from 'antd';
import { DataType } from 'common/interfaces/data-type.interface';
import {
  Category,
  ParameterProduct,
  Product,
  ProductVariant,
} from 'swagger/services';
import { Dispatch, SetStateAction } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ManageProductFields } from './ManageProductsFields.enum';
import { createImage } from 'redux/slicers/imagesSlicer';
import { onLocationChange } from 'components/store/catalog/helpers';
const handleDeleteProduct =
  (id: string, dispatch: AppDispatch, setVisible: any, offset: number) =>
  async () => {
    const handleLocationChange = onLocationChange(dispatch);
    const isSaved: any = await dispatch(deleteProduct(id));
    if (!isSaved.error) {
      dispatch(
        fetchProducts({
          offset: String(offset),
          limit: '12',
        }),
      );
      setVisible((prev) => !prev);
    }
    handleLocationChange();
  };

const handleDataConvertation = (
  form,
  imagesMap: Object,
  parameterProducts: ParameterProduct[],
  variantsLength: number,
  variantsUIArray: [{ id: number }],
  charictristicProduct: any,
) => {
  const newForm = { ...form };
  newForm.price = Number.parseInt(newForm.price, 10);
  newForm.available && (newForm.available = JSON.parse(newForm.available));
  // newForm.parameterProducts = parameterProducts.map((parameterProduct) => ({
  //   parameterId: parameterProduct.parameter?.id,
  //   value: parameterProduct.value,
  // }));

  const productVariants: any[] = [];

  for (let index = 0; index < variantsLength; index++) {
    const variantId = variantsUIArray[index].id;
    const id: string = form[`id[${variantsUIArray[index].id}]`];
    const price: number = form[`${ManageProductFields.Price}[${variantId}]`];
    const oldPrice: number =
      form[`${ManageProductFields.OldPrice}[${variantId}]`];
    const artical: string =
      form[`${ManageProductFields.Artical}[${variantId}]`];
    const available: boolean =
      form[`${ManageProductFields.Available}[${variantId}]`];
    const color: number = form[`${ManageProductFields.Color}[${variantId}]`];
    const parameterProduct: any[] = [];
    if (charictristicProduct.length !== 0) {
      for (
        let indexParam = 0;
        indexParam < charictristicProduct[variantId].length;
        indexParam++
      ) {
        const key: string =
          form[
            `${ManageProductFields.KeyValue}[${charictristicProduct[variantId][indexParam].id}]`
          ];
        const value: string =
          form[
            `${ManageProductFields.Value}[${charictristicProduct[variantId][indexParam].id}]`
          ];
        parameterProduct.push({ key, value });
      }
    }
    const payload = {
      id,
      price,
      oldPrice,
      artical,
      available,
      color,
      images: null,
      parameterProduct,
    };
    const images = imagesMap[variantId];

    if (images?.length) {
      const imageNameArray = images.map((image) => {
        return image.url.split('/api/images/')[1];
      });

      payload.images = imageNameArray.join(', ');
    }

    productVariants.push(payload);
  }

  newForm.productVariants = productVariants;

  return newForm;
};

const checkForEmptyColorFieldInVariant = (variants: ProductVariant[]) => {
  let isEmpty = false;
  let emptyVariant;
  variants.map((variant) => {
    if (!variant.color) {
      isEmpty = true;
      emptyVariant = variant;
    }
  });
  return { isEmpty, emptyVariant };
};
const handleFormSubmitProduct =
  (
    router: NextRouter,
    dispatch: AppDispatch,
    imagesMap: Object,
    parameterProducts: ParameterProduct[],
    variantsLength: number,
    charictristicProduct: Record<number, any[]>,
    variantsUIArray: any,
  ) =>
  async (form) => {
    const convertedForm = handleDataConvertation(
      form,
      imagesMap,
      parameterProducts,
      variantsLength,
      variantsUIArray,
      charictristicProduct,
    );

    if (hasWhiteSpace(form.url)) {
      openErrorNotification(
        'В URL-адресе не допускается использование пробелов.',
      );
      return;
    }
    if (convertedForm.productVariants.length == 0) {
      openErrorNotification('Установить вариант товара');
      return;
    }
    if (convertedForm.productVariants[0].price == undefined) {
      openErrorNotification('Установить цену товара');
      return;
    }
    if (
      checkForEmptyColorFieldInVariant(convertedForm.productVariants).isEmpty
    ) {
      openErrorNotification(
        `Выберите цвет для ${
          checkForEmptyColorFieldInVariant(convertedForm.productVariants)
            .emptyVariant.artical
        }`,
      );
      return;
    }
    console.log(convertedForm);

    return;

    if (router.query.id) {
      const isSaved: any = await dispatch(
        editProduct({
          ...convertedForm,
          id: router.query.id,
        }),
      );

      if (!isSaved.error) {
        navigateTo(router, Page.ADMIN_PRODUCTS)();
      }

      return;
    }

    const isSaved: any = await dispatch(createProduct(convertedForm));

    if (!isSaved.error) {
      navigateTo(router, Page.ADMIN_PRODUCTS)();
    }
  };

const handleRedirectProducts = (id: string, router: NextRouter) => () => {
  router.push(`${paths[Page.ADMIN_PRODUCTS]}/${id}`);
};

const handleTableChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra,
) => {
  // console.log('params', pagination, filters, sorter, extra);
};

const multipleItemsConverter = (items) => {
  return items?.map((item) => item.id);
};

const initialValuesConverter = (product: Product, variants: any[]) => {
  const newProduct: any & Product = { ...product };
  newProduct.category = newProduct.category?.id;
  newProduct.tags = multipleItemsConverter(newProduct.tags);

  variants.forEach((variant, index) => {
    const dbVariant = product.productVariants?.[index];
    if (!dbVariant) return;

    newProduct[`id[${variant.id}]`] = variant.id;
    newProduct[`${ManageProductFields.Price}[${variant.id}]`] = dbVariant.price;
    newProduct[`${ManageProductFields.OldPrice}[${variant.id}]`] =
      dbVariant.oldPrice;
    newProduct[`${ManageProductFields.Artical}[${variant.id}]`] =
      dbVariant.artical;
    newProduct[`${ManageProductFields.Available}[${variant.id}]`] =
      dbVariant.available;
    newProduct[`${ManageProductFields.Color}[${variant.id}]`] =
      dbVariant.color?.id;
  });

  return newProduct;
};

const handleParameterChange =
  (
    index: number,
    setParameterProducts: Dispatch<SetStateAction<ParameterProduct[]>>,
  ) =>
  (e) => {
    setParameterProducts((prev) => {
      const parameterProducts = cloneDeep(prev);

      parameterProducts[index].value = e.target.value;

      return parameterProducts;
    });
  };

const handleCategoryChange =
  (
    categories: Category[],
    setCurCategory: Dispatch<SetStateAction<Category | undefined>>,
    setParameterProducts: Dispatch<SetStateAction<ParameterProduct[]>>,
  ) =>
  (id: string) => {
    const category = categories.find((category) => category.id === id)!;
    setCurCategory(category);
    setParameterProducts(
      category?.parameters?.map((parameter) => ({
        parameter: parameter,
        value: '',
      }))!,
    );
  };

async function uploadImage(file, dispatch) {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  const image = await dispatch(
    createImage({
      config,
      file,
    }),
  );

  return new Promise((resolve, reject) => {
    resolve({ data: { link: `/api/images/${image.payload}` } });
  });
}

export {
  handleDeleteProduct,
  handleFormSubmitProduct,
  handleRedirectProducts,
  handleTableChange,
  initialValuesConverter,
  handleParameterChange,
  handleCategoryChange,
  uploadImage,
};

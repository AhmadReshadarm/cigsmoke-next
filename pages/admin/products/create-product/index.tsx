import { basicRequestParams } from 'common/constants';
import AdminLayout from 'components/admin/adminLayout/layout';
import ManageProductForm from 'components/admin/products/ManageProductsForm';
import Head from 'next/head';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  clearCategories,
  fetchCategories,
} from 'redux/slicers/categoriesSlicer';
import { clearColors, fetchColors } from 'redux/slicers/colorsSlicer';
import { clearImageList } from 'redux/slicers/imagesSlicer';
import { clearTags, fetchTags } from 'redux/slicers/tagsSlicer';

const CreateProduct = () => {
  const title = 'Создание продукта';
  const dispatch = useAppDispatch();

  const colors = useAppSelector((state) => state.colors.colors);
  const categories = useAppSelector((state) => state.categories.categories);
  const filteredCategories = categories.filter((category) => !!category.parent);
  const tags = useAppSelector((state) => state.tags.tags);

  useEffect(() => {
    dispatch(fetchColors(basicRequestParams));
    dispatch(fetchCategories(basicRequestParams));
    dispatch(fetchTags(basicRequestParams));
    return () => {
      dispatch(clearColors());
      dispatch(clearCategories());
      dispatch(clearTags());
      dispatch(clearImageList());
    };
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>
          Администрирование {`>`} Продукты {`>`} Создание продукта | WULUXE
        </title>
      </Head>

      <ManageProductForm
        tags={tags}
        categories={filteredCategories}
        colors={colors}
        title={title}
        editMode={false}
      />
    </>
  );
};

CreateProduct.PageLayout = AdminLayout;

export default CreateProduct;

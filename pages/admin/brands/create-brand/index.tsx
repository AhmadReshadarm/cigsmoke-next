import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { useEffect } from 'react';
import { fetchBrands } from 'redux/slicers/brandsSlicer';
import ManageBrandForm from 'components/admin/brands/ManageBrandsForm';
import AdminLayout from 'components/admin/adminLayout/layout';
import { clearImageList } from 'redux/slicers/imagesSlicer';

const CreateBrand = () => {
  const title = 'Создание бренда';
  const categories = useAppSelector((state) => state.brands.brands);
  const isLoading = useAppSelector((state) => state.brands.loading);
  const isSaveLoading = useAppSelector((state) => state.brands.saveLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBrands());

    return () => {
      dispatch(clearImageList());
    };
  }, [dispatch]);

  return (
    <ManageBrandForm
      title={title}
      editMode={false}
      brands={categories}
      isLoading={isLoading}
      isSaveLoading={isSaveLoading}
    />
  );
};

CreateBrand.PageLayout = AdminLayout;

export default CreateBrand;

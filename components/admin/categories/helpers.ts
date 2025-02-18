import {
  hasWhiteSpace,
  navigateTo,
  openErrorNotification,
} from 'common/helpers';
import { NextRouter } from 'next/router';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import {
  createCategory,
  deleteCategory,
  editCategory,
  fetchCategories,
} from 'redux/slicers/categoriesSlicer';
import { AppDispatch } from 'redux/store';
import { Page, paths } from 'routes/constants';

const handleFormSubmit =
  (router: NextRouter, dispatch: AppDispatch, image: any) => async (form) => {
    if (hasWhiteSpace(form.url)) {
      openErrorNotification(
        'В URL-адресе не допускается использование пробелов.',
      );
      return;
    }
    if (router.query.id) {
      const payload = {
        ...form,
        image: image[0] ? image[0]?.url?.split('/api/images/')[1] : undefined,
        id: router.query.id,
      };

      const isSaved: any = await dispatch(editCategory(payload));

      if (!isSaved.error) {
        navigateTo(router, Page.ADMIN_CATEGORIES)();
      }

      return;
    }

    const isSaved: any = await dispatch(
      createCategory({
        ...form,
        image: image[0] ? image[0]?.url?.split('/api/images/')[1] : undefined,
      }),
    );

    if (!isSaved.error) {
      navigateTo(router, Page.ADMIN_CATEGORIES)();
    }
  };

const handleDeleteCategory =
  (id: string, dispatch: AppDispatch, setVisible: any, offset: number) =>
  async () => {
    const isSaved: any = await dispatch(deleteCategory(id));
    if (!isSaved.error) {
      dispatch(
        fetchCategories({
          offset: String(offset),
          limit: '20',
        }),
      );
      setVisible((prev) => !prev);
    }
  };

const handleRedirectCategory = (id: string, router: NextRouter) => () => {
  router.push(`${paths[Page.ADMIN_CATEGORIES]}/${id}`);
};

const handleRedirectProduct = (url: string, router: NextRouter) => () => {
  router.push(`/product/${url}`);
};

const handleChangeParent =
  (setHasParent: Dispatch<SetStateAction<boolean>>) => (id: string) => {
    setHasParent(!!id);
  };

export {
  handleFormSubmit,
  handleDeleteCategory,
  handleRedirectCategory,
  handleRedirectProduct,
  handleChangeParent,
};

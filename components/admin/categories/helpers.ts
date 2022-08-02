import { Dispatch } from "@reduxjs/toolkit";
import { TableProps } from "antd";
import { navigateTo } from "common/helpers";
import { DataType } from "common/interfaces/data-type.interface";
import { NextRouter } from "next/router";
import { createCategory, deleteCategory, editCategory, fetchCategories } from "redux/slicers/categoriesSlicer";
import { clearImageList } from "redux/slicers/imagesSlicer";
import { AppDispatch } from "redux/store";
import { Page, paths } from "routes/constants";

export const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

export const handleFormSubmit = (router: NextRouter, dispatch: AppDispatch, image: any) => async (form) => {
  if (router.query.id) {
    const payload = {
      ...form,
      image: image[0].url.split("/api/images/")[1],
      id: router.query.id,
    };
    const isSaved: any = await dispatch(
      editCategory(payload),
    );

    if (!isSaved.error) {
      navigateTo(router, Page.ADMIN_CATEGORIES)();
    }

    return;
  }

  const isSaved: any = await dispatch(createCategory({
    ...form,
    image: image[0]?.url.split("/api/images/")[1],
  }));

  if (!isSaved.error) {
    navigateTo(router, Page.ADMIN_CATEGORIES)();
  }
};

export const handleDeleteCategory = (id: string, dispatch: AppDispatch, setVisible: any) => async () => {
  const isSaved: any = await dispatch(deleteCategory(id));
  if (!isSaved.error) {
    dispatch(fetchCategories());
    setVisible(prev => !prev);
  }
};

export const handleRedirectCategory = (id: string, router: NextRouter) => () => {
  router.push(`${paths[Page.ADMIN_CATEGORIES]}/${id}`);
};

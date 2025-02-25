import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Table from 'antd/lib/table';
import { ColumnGroupType, ColumnType } from 'antd/lib/table/interface';
import { navigateTo } from 'common/helpers';
import { handleDateFormatter } from 'common/helpers/handleDateFormatter';
import { DataType } from 'common/interfaces/data-type.interface';
import AdminLayout from 'components/admin/adminLayout/layout';
import { columns } from 'components/admin/categories/constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Page } from 'routes/constants';

import {
  clearCategories,
  fetchCategories,
} from '../../../redux/slicers/categoriesSlicer';
import styles from './index.module.scss';
import Head from 'next/head';

const CategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize]: [number, any] = useState(20);

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const isLoading = useAppSelector((state) => state.categories.loading);
  const paginationLength = useAppSelector(
    (state) => state.categories.paginationLength,
  );
  const router = useRouter();

  const dataSource = categories?.map(
    ({ id, name, image, createdAt, updatedAt, url, parent }) => {
      return {
        key: id,
        id,
        name,
        image,
        createdAt: handleDateFormatter(createdAt),
        updatedAt: handleDateFormatter(updatedAt),
        url,
        parent,
      };
    },
  ) as unknown as DataType[];

  useEffect(() => {
    dispatch(
      fetchCategories({
        offset: String(currentPage - 1),
        limit: String(pageSize),
      }),
    );

    return () => {
      dispatch(clearCategories());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Администрирование {`>`} Категории | WULUXE</title>
      </Head>
      <div className={styles.categoriesHeader}>
        <h1 className={styles.categoriesHeader__title}>Категории</h1>
        <Button
          className={styles.categoriesHeader__createCategoryButton}
          type="primary"
          onClick={navigateTo(router, Page.ADMIN_CREATE_CATEGORY)}
        >
          Создать новую категорию
        </Button>
      </div>
      {isLoading ? (
        <Spin className={styles.spinner} size="large" />
      ) : (
        <Table
          scroll={{
            y: 768,
          }}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            total: paginationLength,
            pageSizeOptions: [20, 30, 40, 50, 100],
            locale: { items_per_page: '/ странице' },
          }}
          columns={
            columns as (ColumnGroupType<DataType> | ColumnType<DataType>)[]
          }
          dataSource={dataSource}
          onChange={(event) => {
            const newOffset = ((event.current as number) - 1) * pageSize;

            dispatch(
              fetchCategories({
                offset: String(newOffset),
                limit: String(event.pageSize),
              }),
            );
            setPageSize(event.pageSize);
            setCurrentPage(event.current as number);
          }}
        />
      )}
    </>
  );
};

CategoriesPage.PageLayout = AdminLayout;

export default CategoriesPage;

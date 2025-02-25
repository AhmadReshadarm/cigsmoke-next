import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Table from 'antd/lib/table';
import { ColumnGroupType, ColumnType } from 'antd/lib/table/interface';
import { navigateTo } from 'common/helpers';
import { DataType } from 'common/interfaces/data-type.interface';
import AdminLayout from 'components/admin/adminLayout/layout';
import { columns } from 'components/admin/colors/constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { clearColors, fetchColors } from 'redux/slicers/colorsSlicer';
import { Page } from 'routes/constants';
import styles from './index.module.scss';
import Head from 'next/head';

const Colors = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize]: [number, any] = useState(20);

  const dispatch = useAppDispatch();
  const colors = useAppSelector((state) => state.colors.colors);
  const isLoading = useAppSelector((state) => state.colors.loading);
  const paginationLength = useAppSelector(
    (state) => state.colors.paginationLength,
  );
  const router = useRouter();

  const dataSource = colors?.map(({ id, name, url, code, ...rest }) => ({
    key: id,
    id,
    name,
    url,
    code,
  })) as unknown as DataType[];

  useEffect(() => {
    dispatch(
      fetchColors({
        offset: String(currentPage - 1),
        limit: String(pageSize),
      }),
    );

    return () => {
      dispatch(clearColors());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Администрирование {`>`} Цвета | WULUXE</title>
      </Head>
      <div className={styles.colorsHeader}>
        <h1 className={styles.colorsHeader__title}>Цвета</h1>
        <Button
          className={styles.colorsHeader__createColorButton}
          type="primary"
          onClick={navigateTo(router, Page.ADMIN_CREATE_COLORS)}
        >
          Создать новый цвет
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
              fetchColors({
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

Colors.PageLayout = AdminLayout;

export default Colors;

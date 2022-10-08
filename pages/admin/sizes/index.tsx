import { Button, Spin, Table } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table/interface';
import { AppContext } from 'common/context/AppContext';
import { navigateTo } from 'common/helpers';
import { DataType } from 'common/interfaces/data-type.interface';
import AdminLayout from 'components/admin/adminLayout/layout';
// import { columns } from 'components/admin/tags/constants';
import { columns } from 'components/admin/sizes/constants';
import { handleTableChange } from 'components/admin/tags/helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Page } from 'routes/constants';

import { clearSizes, fetchSizes } from 'redux/slicers/sizesSlicer';
import styles from './index.module.scss';

const SizesPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { offset, setOffset } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const sizes = useAppSelector((state) => state.sizes.sizes);
  const isLoading = useAppSelector((state) => state.sizes.loading);
  const router = useRouter();
  const dataSource = sizes?.map(({ id, name, url }) => ({
    key: id,
    id,
    name,
    url,
  })) as unknown as DataType[];

  useEffect(() => {
    dispatch(
      fetchSizes({
        offset: String(offset),
        limit: '20',
      }),
    );

    return () => {
      dispatch(clearSizes());
      setOffset(0);
    };
  }, []);

  return (
    <>
      <div className={styles.sizesHeader}>
        <h1 className={styles.sizesHeader__title}>Размер</h1>
        <Button
          className={styles.sizesHeader__createSizeButton}
          type="primary"
          onClick={navigateTo(router, Page.ADMIN_CREATE_SIZE)}
        >
          Создать новый Размер
        </Button>
      </div>
      {isLoading ? (
        <Spin className={styles.spinner} size="large" />
      ) : (
        <Table
          scroll={{
            x: 1366,
            y: 768,
          }}
          pagination={{
            pageSize: 20,
            current: currentPage,
          }}
          columns={
            columns as (ColumnGroupType<DataType> | ColumnType<DataType>)[]
          }
          dataSource={dataSource}
          onChange={(event) => {
            const newOffset = ((event.current as number) - 1) * 20;
            setOffset(newOffset);
            dispatch(
              fetchSizes({
                offset: String(newOffset),
                limit: '20',
              }),
            );
            setCurrentPage(event.current as number);
          }}
        />
      )}
    </>
  );
};

SizesPage.PageLayout = AdminLayout;

export default SizesPage;

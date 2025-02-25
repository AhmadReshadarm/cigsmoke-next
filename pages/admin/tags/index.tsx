import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Table from 'antd/lib/table';
import { ColumnGroupType, ColumnType } from 'antd/lib/table/interface';
import { navigateTo } from 'common/helpers';
import { DataType } from 'common/interfaces/data-type.interface';
import AdminLayout from 'components/admin/adminLayout/layout';
import { columns } from 'components/admin/tags/constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Page } from 'routes/constants';
import { clearTags, fetchTags } from '../../../redux/slicers/tagsSlicer';
import styles from './index.module.scss';
import Head from 'next/head';

const TagsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize]: [number, any] = useState(20);

  const dispatch = useAppDispatch();
  const tags = useAppSelector((state) => state.tags.tags);
  const isLoading = useAppSelector((state) => state.tags.loading);
  const paginationLength = useAppSelector(
    (state) => state.tags.paginationLength,
  );
  const router = useRouter();

  const dataSource = tags?.map(({ id, name, url }) => ({
    key: id,
    id,
    name,
    url,
  })) as unknown as DataType[];

  useEffect(() => {
    dispatch(
      fetchTags({
        offset: String(currentPage - 1),
        limit: String(pageSize),
      }),
    );

    return () => {
      dispatch(clearTags());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Администрирование {`>`} Коллекция | WULUXE</title>
      </Head>
      <div className={styles.tagsHeader}>
        <h1 className={styles.tagsHeader__title}>Коллекция</h1>
        <Button
          className={styles.tagsHeader__createTagButton}
          type="primary"
          onClick={navigateTo(router, Page.ADMIN_CREATE_TAG)}
        >
          Создать новый Коллекция
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
              fetchTags({
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

TagsPage.PageLayout = AdminLayout;

export default TagsPage;

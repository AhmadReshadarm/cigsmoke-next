import { pushQueryParams } from 'common/helpers/manageQueryParams.helper';
import {
  onLocationChange,
  setPriceRange,
} from 'components/store/catalog/helpers';
import { devices } from 'components/store/lib/Devices';
import variants from 'components/store/lib/variants';
import { Container } from 'components/store/storeLayout/common';
import StoreLayout from 'components/store/storeLayout/layouts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchParentCategories } from 'redux/slicers/store/catalogSlicer';
import { TCatalogState } from 'redux/types';
import styled from 'styled-components';
import { Category, Product } from 'swagger/services';
import SEOstatic from 'components/store/SEO/SEOstatic';
import Pagination from 'antd/es/pagination';
import Head from 'next/head';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { LoaderMask } from 'ui-kit/generalLoaderMask';
const TopFilterBar = dynamic(
  () => import('components/store/catalog/TopFilterBar'),
  {
    ssr: false,
    loading: () => <LoaderMask />,
  },
);
const ProductGrid = dynamic(() => import('ui-kit/products/productGrid'), {
  ssr: false,
  loading: () => <LoaderMask />,
});

const queryStringToObject = (url) =>
  Object.fromEntries([...new URLSearchParams(url.split('?')[1])]);

export const getServerSideProps = (async (context) => {
  const query = context.resolvedUrl;

  const queryObj = {
    categories:
      queryStringToObject(query).categories == undefined
        ? null
        : queryStringToObject(query).categories,
    subCategories:
      queryStringToObject(query).subCategories == undefined
        ? null
        : queryStringToObject(query).subCategories,
  };

  const url = `${process.env.API_URL}/products?${
    queryObj.categories ? 'parent=' + queryObj.categories : ''
  }${
    queryObj.subCategories
      ? queryObj.categories
        ? '&categories[]=' + queryObj.subCategories
        : 'categories[]=' + queryObj.subCategories
      : ''
  }`;

  // Fetch data from external API
  try {
    const res = await fetch(url);
    const repo = await res.json();
    const randomProduct = Math.floor(Math.random() * repo.rows?.length);
    // Pass data to the page via props
    return {
      props: {
        repo: repo.rows,
        randomProduct,
      },
    };
  } catch (error) {
    return {
      props: {
        repo: [],
        randomProduct: 0,
      },
    };
  }
}) as GetServerSideProps<{ repo: Product[]; randomProduct: number }>;

const CatalogPage = ({
  repo,
  randomProduct,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const { categories, subCategories, colors, tags, parameters, priceRange } =
    useAppSelector<TCatalogState>((state) => state.catalog);

  const handleLocationChange = onLocationChange(dispatch);
  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    localStorage.removeItem('location');
    window.addEventListener('locationChange', () => {
      handleLocationChange();
    });
    setPriceRange(dispatch);

    (async () => {
      if (firstLoad) {
        await dispatch(fetchParentCategories());
        await handleLocationChange();
        setFirstLoad(false);
      }
    })();

    return () => {
      window.removeEventListener('locationChange', handleLocationChange);
    };
  }, []);

  const filteredTags: any = tags.filter((tag) => {
    if (
      tag.url?.match(/(?:^|\W)best_product(?:$|\W)/) ||
      tag.url?.match(/(?:^|\W)main_page(?:$|\W)/) ||
      tag.url == '-' ||
      tag.url == '_' ||
      tag.url == ' '
    ) {
      return;
    }
    return tag;
  });

  const filteredColors: any = colors.filter((color) => {
    if (
      color.url?.match(/(?:^|\W)-(?:$|\W)/) ||
      color.url?.match(/(?:^|\W)_(?:$|\W)/) ||
      color.url?.match(/(?:^|\W) (?:$|\W)/)
    ) {
      return;
    }
    return color;
  });

  const [expanded, setExpanded] = useState(false);

  const handleExpantionChange = () => {
    setExpanded((prev) => !prev);
  };

  const paginationLength = useAppSelector(
    (state) => state.catalog.productsLength,
  );

  // --------------------------------------------------------------------

  const uniqueParametersMap = new Map<
    string,
    { groupId: string; values: Set<{ id: string; value: string }> }
  >();

  parameters.forEach((param) => {
    const currentKey = param.key;
    const currentValue: { id: string; value: string } = {
      id: param.id!,
      value: param.value!,
    };
    if (!uniqueParametersMap.has(currentKey!)) {
      uniqueParametersMap.set(currentKey!, {
        groupId: param.id!.toString(),
        values: new Set(),
      });
    }
    uniqueParametersMap.get(currentKey!)?.values.add(currentValue);
  });

  const filteredParams = Array.from(uniqueParametersMap.entries()).map(
    ([key, groupData]) => {
      const unFilteredValues = Array.from(groupData.values);
      const uniqueValuesWithId: { id: string; value: string }[] = [];
      const seenValues = new Set();
      unFilteredValues.forEach((item) => {
        if (!seenValues.has(item.value)) {
          seenValues.add(item.value);
          uniqueValuesWithId.push(item);
        }
      });

      return {
        groupId: groupData.groupId,
        key,
        values: uniqueValuesWithId, //Array.from(values),
      };
    },
  );

  // ------------------------- pagination handlers ---------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]: [number, any] = useState(18);
  const handlePageChange = (
    page: number,
    pageSize: number,
    current: number,
  ) => {
    setPageSize(pageSize);
    setCurrentPage(current);
    pushQueryParams([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
    ]);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  // ---------------------------------------------------------------------------

  const [isClient, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <>
      {repo.length !== 0 ? (
        <SEOstatic
          page={{
            realName: `${selectedCategory?.name ?? 'Каталог'} | WULUXE`,
            name: `${
              repo[randomProduct].category?.parent?.name +
              ' > ' +
              repo[randomProduct].category?.name
            }`,
            url: `${router.asPath}`,
            desc: `${
              repo[0].category?.name ?? 'Каталог'
            } - покупайте на WULUXE по выгодным ценам! ${
              repo[randomProduct]?.shortDesc ?? selectedCategory?.desc
            }`,
            keywords: `${repo[randomProduct]?.keywords}`,
            createdAt:
              repo[randomProduct]?.createdAt ?? selectedCategory?.createdAt,
            updatedAt:
              repo[randomProduct]?.updatedAt ?? selectedCategory?.updatedAt,
          }}
          image={`https://nbhoz.ru/api/images/${repo[0]?.category?.parent?.image}`}
        />
      ) : (
        ''
      )}
      <Head>
        <link rel="canonical" href="https://nbhoz.ru/catalog" />
      </Head>

      {isClient ? (
        <Container
          variants={variants.fadInOut}
          key="header"
          initial="start"
          animate="middle"
          exit="end"
          flex_direction="column"
          justify_content="center"
          align_items="center"
          padding="10px 0"
        >
          <Wrapper>
            <CatelogContentWrapper>
              <TopFilterBar
                categories={categories}
                subCategories={subCategories}
                colors={filteredColors}
                priceRange={priceRange}
                tags={filteredTags}
                expanded={expanded}
                handleExpantionChange={handleExpantionChange}
                setSelectedCategory={setSelectedCategory}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                parameters={filteredParams}
              />

              <Content>
                <ProductGrid />
                <Pagination
                  style={{ marginTop: '20px' }}
                  defaultCurrent={currentPage}
                  current={currentPage}
                  total={paginationLength}
                  pageSize={pageSize}
                  pageSizeOptions={[18, 36, 54, 100, 150]}
                  onChange={(current, pageSize) => {
                    handlePageChange(current, pageSize, current);
                  }}
                  locale={{ items_per_page: '/ странице' }}
                />
              </Content>
            </CatelogContentWrapper>
          </Wrapper>
        </Container>
      ) : (
        ''
      )}
    </>
  );
};

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  .ant-pagination {
    .ant-pagination-options {
      .ant-pagination-options-size-changer {
        .ant-select-selector {
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
  @media ${devices.mobileL} {
    margin-left: 0;
  }
`;

const CatelogContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  @media ${devices.mobileM} {
    flex-direction: column;
  }

  @media ${devices.mobileS} {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media ${devices.laptopL} {
    max-width: 1230px;
  }
  @media ${devices.laptopM} {
    max-width: unset;
  }
  @media ${devices.laptopS} {
    max-width: unset;
    flex-direction: column;
  }
  @media ${devices.tabletL} {
    max-width: unset;
    flex-direction: column;
  }
  @media ${devices.tabletS} {
    max-width: unset;
    flex-direction: column;
  }
  @media ${devices.mobileL} {
    max-width: unset;
    flex-direction: column;
  }
  @media ${devices.mobileM} {
    max-width: unset;
    flex-direction: column;
  }
  @media ${devices.mobileS} {
    max-width: unset;
    flex-direction: column;
  }
`;

CatalogPage.PageLayout = StoreLayout;

export default CatalogPage;

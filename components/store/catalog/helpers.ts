import { getQueryParams } from 'common/helpers/manageQueryParams.helper';
import {
  clearColors,
  clearParameters,
  clearProducts,
  clearSubCategories,
  clearTags,
  fetchColors,
  fetchPriceRange,
  fetchProducts,
  fetchProducusParametersFilters,
  fetchSubCategories,
  fetchTags,
  setPage,
} from 'redux/slicers/store/catalogSlicer';
import { AppDispatch } from 'redux/store';
import { FilterOption } from 'ui-kit/FilterCheckbox/types';
import { TFiltersConfig } from './types';
import {
  isRussian,
  transliterateRussianToEnglish,
} from 'common/helpers/translateRussianToEnglish.helper';

const PAGE_ITEMS_LIMIT = 18;

const convertQueryParams = (query: {
  [k: string]: string | string[] | undefined;
}) => {
  const { categories, subCategories, colors, tags } = query;
  let parametersArray: string[] = [];
  const uniqueParameters = new Set<string>();
  for (const key in query) {
    let newParam: any;

    if (query.hasOwnProperty(key) && key.startsWith('parameters')) {
      newParam = query[key]
        ? Array.isArray(query[key])
          ? query[key]
          : [query[key]]
        : undefined;

      if (newParam) {
        newParam.forEach((param: string) => uniqueParameters.add(param)); // Add each param to the Set
      }
    }
  }

  parametersArray = Array.from(uniqueParameters);

  const categoriesArray = categories
    ? Array.isArray(categories)
      ? categories
      : [categories]
    : undefined;
  const subCategoriesArray = subCategories
    ? Array.isArray(subCategories)
      ? subCategories
      : [subCategories]
    : undefined;
  const colorsArray = colors
    ? Array.isArray(colors)
      ? colors
      : [colors]
    : undefined;
  const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;

  return {
    categories: categoriesArray,
    subCategories: subCategoriesArray,
    colors: colorsArray,
    tags: tagsArray,
    parameters: parametersArray.length !== 0 ? parametersArray : undefined,
  };
};

const convertDynamicQueryParams = (query: {
  [k: string]: string | string[] | undefined;
}) => {
  const parameters: { [key: string]: string[] } = {};

  for (const key in query) {
    if (key.startsWith('parameters_')) {
      const groupKey = key.replace('parameters_', '');
      const value = query[key];
      if (value) {
        parameters[groupKey] = Array.isArray(value) ? value : [value];
      }
    }
  }
  return {
    parameters,
  };
};

const getFiltersConfig = ({
  categories,
  subCategories,
  colors,
  priceRange,
  filters,
  tags,
  parameters,
  dynamicFilters,
}: TFiltersConfig) => {
  const dynamicOptions = parameters.map((param) => {
    const groupKey = isRussian(param.key)
      ? transliterateRussianToEnglish(param.key).replace(/\s/g, '')
      : param.key.replace(/\s/g, '');
    const selectedValues = dynamicFilters.parameters?.[groupKey] || [];

    return {
      groupId: param.groupId,
      title: param.key,
      options: param.values.map((val) => ({
        groupId: param.groupId,
        id: val.id,
        name: val.value,
        url: val.value,
        // checked: !!filters.parameters?.find((param) => param === val.value),
        checked: selectedValues.includes(val.value),
      })) as FilterOption[],
    } as { groupId: string; title: string; options: FilterOption[] };
  });

  return {
    sectionOptions: categories.map(({ id, name, url }) => ({
      id,
      name,
      url,
      checked: !!filters.categories?.find((categoryUrl) => categoryUrl === url),
    })) as FilterOption[],
    subSectionOptions: subCategories.map(({ id, name, url }) => ({
      id,
      name,
      url,
      checked: !!filters.subCategories?.find(
        (categoryUrl) => categoryUrl === url,
      ),
    })) as FilterOption[],
    colorOptions: colors.map(({ id, name, url, code }) => ({
      id,
      name,
      url,
      color: code,
      checked: !!filters.colors?.find((colorUrl) => colorUrl === url),
    })) as FilterOption[],
    tagOptions: tags.map(({ id, name, url }) => ({
      id,
      name,
      url,
      checked: !!filters.tags?.find((tagUrl) => tagUrl === url),
    })) as FilterOption[],
    dynamicOptions,
    minPrice: priceRange.minPrice!,
    maxPrice: priceRange.maxPrice!,
  };
};

const setPriceRange = (dispatch: AppDispatch) => {
  const queryParams = getQueryParams(window.location.search);
  const { categories, subCategories } = convertQueryParams(queryParams);
  const { name } = queryParams;
  const payload = {
    parent: categories ? categories[0] : undefined,
    categories: subCategories,
    name: name,
  };

  dispatch(fetchPriceRange(payload));
};

const onLocationChange = (dispatch: AppDispatch) => async () => {
  const queryParams = getQueryParams(window.location.search);
  const { minPrice, maxPrice, name, page, limit, sortBy, orderBy, available } =
    queryParams;
  const { categories, subCategories, colors, tags, parameters } =
    convertQueryParams(queryParams);

  const payload = {
    colors,
    tags,
    parameters,
    name: name ? name[0] : undefined,
    parent: categories ? categories[0] : undefined,
    categories: subCategories,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy ? String(sortBy) : 'name',
    orderBy: orderBy ? String(orderBy) : 'DESC',
    limit: limit ? limit : PAGE_ITEMS_LIMIT,
    offset: Number(limit ?? PAGE_ITEMS_LIMIT) * (Number(page ?? 1) - 1),
    available: available ? Boolean(available) : undefined,
  };

  dispatch(setPage(Number(page ?? 1)));

  dispatch(fetchProducts(payload));

  const curLocation = localStorage.getItem('location')!;
  localStorage.setItem('location', window.location.search);

  const rawPrevQueryParams = getQueryParams(curLocation);
  const prevQueryParams = convertQueryParams(rawPrevQueryParams);
  setPriceRange(dispatch);

  // -----------------------------------------------------------------------------
  if (
    JSON.stringify(prevQueryParams.categories) !== JSON.stringify(categories)
  ) {
    const category = categories ? categories[0] : '';

    if (category) {
      await dispatch(fetchSubCategories(category));
      await dispatch(fetchColors({ parent: category }));
    } else {
      dispatch(clearSubCategories());
      dispatch(clearColors());
    }
  }

  if (
    JSON.stringify(prevQueryParams.subCategories) !==
    JSON.stringify(subCategories)
  ) {
    const subCategory = subCategories ? subCategories[0] : '';
    if (subCategories) {
      await dispatch(fetchColors({ category: subCategories[0] }));
      await dispatch(fetchTags({ children: subCategory }));
      await dispatch(
        fetchProducusParametersFilters({
          children: subCategory,
          limit: '1000',
        }),
      );
    } else {
      dispatch(clearTags());
      dispatch(clearColors());
      dispatch(clearParameters());
    }
  }
  return () => dispatch(clearProducts());
};

export {
  convertQueryParams,
  getFiltersConfig,
  setPriceRange,
  onLocationChange,
  convertDynamicQueryParams,
};

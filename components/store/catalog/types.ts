import { TFilters } from 'redux/types';
import { Category, Color, PriceRange, Tag } from 'swagger/services';
import { FilterOption } from 'ui-kit/FilterCheckbox/types';
import { FilterType } from './constants';

export type Filter = {
  title: string;
  type?: FilterType | string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  onChange: (
    selectedOptions: (FilterOption[] | undefined) &
      FilterOption &
      [number, number],
    suffix?: string,
  ) => void;
};

export type TFiltersConfig = {
  categories: Category[];
  subCategories: Category[];
  colors: Color[];
  tags: Tag[];
  parameters: parameterFiltered[];
  priceRange: PriceRange;
  filters: TFilters;
};

export type parameterFiltered = {
  key: string;
  values: { id: string; value: string }[];
};

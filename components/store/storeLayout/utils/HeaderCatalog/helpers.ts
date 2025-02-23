import { Dispatch, SetStateAction } from 'react';
import { AppDispatch } from 'redux/store';
import { CategoryInTree } from 'swagger/services';
import { PopupDisplay } from '../../constants';

const handleCategoryHover =
  (
    category: CategoryInTree,
    setCurCategory: Dispatch<SetStateAction<CategoryInTree | undefined>>,
  ) =>
  () => {
    setCurCategory(category!);
  };

const handleSubCategoryHover =
  (
    subCategory: CategoryInTree,
    dispatch: AppDispatch,
    setCurSubCategory: Dispatch<SetStateAction<CategoryInTree | undefined>>,
  ) =>
  () => {
    setCurSubCategory(subCategory);
  };

const handleBrandClick =
  (
    setIsOpened: Dispatch<SetStateAction<boolean>>,
    setDisplay: Dispatch<SetStateAction<PopupDisplay>>,
  ) =>
  () => {
    setIsOpened(false);
    setTimeout(() => setDisplay(PopupDisplay.None), 150);
  };

export { handleCategoryHover, handleSubCategoryHover, handleBrandClick };

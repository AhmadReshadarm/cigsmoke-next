type FilterOption = {
  id: string;
  name: string;
  url: string;
  checked?: boolean;
  color?: string;
  groupId?: string;
};

enum FilterCheckboxSize {
  Small,
  Big,
}

export { FilterCheckboxSize };
export type { FilterOption };

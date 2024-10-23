enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export type PageResult<T> = {
  list: Array<T>;
  page: number;
  pageSize: number;
  total: number;
};
export type PageParams = {
  args?: Array<any>;
  filters?: Array<string>;
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder: SortOrder;
};

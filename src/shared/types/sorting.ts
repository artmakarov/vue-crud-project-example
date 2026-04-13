export interface ISortOption<T extends object> {
  key: keyof T;
  order: 'asc' | 'desc';
}

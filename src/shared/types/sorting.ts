export interface ISortOption<T extends {}> {
  key: keyof T;
  order: 'asc' | 'desc';
}

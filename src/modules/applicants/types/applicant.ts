export type ApplicantStatusType = 'new' | 'in_work' | 'done';

export interface IApplicant {
  id: number;
  fullName: string;
  phone: string;
  status: ApplicantStatusType;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicantFormDataType = Pick<
  IApplicant,
  'fullName' | 'phone' | 'status'
>;

export interface IFilters {
  status: ApplicantStatusType | null;
}

export interface IPaginationParams {
  page: number;
  itemsPerPage: number;
}

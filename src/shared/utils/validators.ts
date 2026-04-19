import { i18n } from '@/plugins';

export const validators = {
  required: (v: unknown): true | string =>
    !!v || i18n.global.t('validation.required'),

  minLength:
    (n: number) =>
    (v: string): true | string =>
      !v || v.length >= n || i18n.global.t('validation.minLength', { n }),

  maxLength:
    (n: number) =>
    (v: string): true | string =>
      !v || v.length <= n || i18n.global.t('validation.maxLength', { n }),

  phone: (v: string): true | string => {
    const digits = v?.replace(/\D/g, '') || '';

    return digits.length >= 10 || i18n.global.t('validation.phone');
  },
};

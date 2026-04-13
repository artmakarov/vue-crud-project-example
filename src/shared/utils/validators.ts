export const validators = {
  required: (v: unknown): true | string => !!v || 'Обязательное поле',

  minLength:
    (n: number) =>
    (v: string): true | string =>
      !v || v.length >= n || `Минимум ${n} символов`,

  maxLength:
    (n: number) =>
    (v: string): true | string =>
      !v || v.length <= n || `Максимум ${n} символов`,

  phone: (v: string): true | string => {
    const digits = v?.replace(/\D/g, '') || '';

    return digits.length >= 10 || 'Некорректный номер телефона';
  },
};

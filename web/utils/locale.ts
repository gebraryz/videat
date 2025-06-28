'use server';

import { cookies } from 'next/headers';

export const getLocale = async () => {
  console.log((await cookies()).get('NEXT_LOCALE'));

  return (await cookies()).get('NEXT_LOCALE')?.value || 'en';
};

export const setUserLocale = async (locale: string) => {
  (await cookies()).set('NEXT_LOCALE', locale);
};

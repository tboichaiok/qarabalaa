import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !['en', 'ru'].includes(locale as string)) {
    return {
      locale: 'ru',
      messages: (await import('../messages/ru.json')).default,
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
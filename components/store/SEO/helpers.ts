import { baseUrl } from 'common/constant';

const settings = {
  graphql: {
    uri: baseUrl,
  },
  meta: {
    rootUrl: baseUrl,
    title: 'wuluxe.ru',
    description:
      'WULUXE - Всё для дома: шторы, карнизы, товары для ванной, уборки, кухни и дачи Доставка по Москва и России',
    social: {
      graphic:
        'https://cheatcode-assets.s3.amazonaws.com/default-social-graphic.png',
      twitter: '@wuluxe',
    },
  },
  routes: {
    authenticated: {
      pathAfterFailure: '/',
    },
    public: {
      pathAfterFailure: '/',
    },
  },
};

export { settings };

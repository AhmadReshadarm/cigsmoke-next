const siteUrl = 'https://wuluxe.ru';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin',
      },
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
      {
        userAgent: '*',
        disallow: '/checkout',
      },
      {
        userAgent: '*',
        disallow: '/checkout/*',
      },
      {
        userAgent: '*',
        disallow: '/cart',
      },
      {
        userAgent: '*',
        disallow: '/cart/*',
      },
      {
        userAgent: '*',
        disallow: '/profile',
      },
      {
        userAgent: '*',
        disallow: '/profile/*',
      },
      {
        userAgent: '*',
        disallow: '/orders',
      },
      {
        userAgent: '*',
        disallow: '/orders/*',
      },
      {
        userAgent: '*',
        disallow: '/wishlist',
      },
      {
        userAgent: '*',
        disallow: '/wishlist/*',
      },
      {
        userAgent: '*',
        disallow: '/after-payment',
      },
      {
        userAgent: '*',
        disallow: '/after-payment/*',
      },
      {
        userAgen: '*',
        disallow: '/rekvizity-ooo-internet-resheniya',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${siteUrl}/server-sitemap.xml`,
      `${siteUrl}/sitemap.xml`,
    ],
  },
  exclude: [
    '/admin',
    '/admin/*',
    '/checkout',
    '/checkout/*',
    '/cart',
    '/cart/*',
    '/profile',
    '/profile/*',
    '/orders',
    '/orders/*',
    '/wishlist',
    '/wishlist/*',
    '/after-payment',
    '/after-payment/*',
    '/rekvizity-ooo-internet-resheniya',
  ],
};

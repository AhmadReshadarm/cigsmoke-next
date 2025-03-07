import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import 'styles.css';
import { wrapper } from '../redux/store';
import { ContextProvider } from 'common/context/AppContext';
import Head from 'next/head';
import { Roboto } from 'next/font/google';
const roboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['100', '300', '400', '500', '700', '900'],
});
export type ComponentWithPageLayout = AppProps & {
  Component: AppProps['Component'] & {
    PageLayout?: React.FC<any>;
  };
};

function App({ Component, pageProps }: ComponentWithPageLayout) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta
          property="viewport"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <ContextProvider>
        {Component.PageLayout ? (
          <Component.PageLayout>
            <div className={`${roboto.variable}`}>
              <Component {...pageProps} key={router.asPath} />
            </div>
          </Component.PageLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </ContextProvider>
    </>
  );
}

export default wrapper.withRedux(App);

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.svg" />

          {/* microsoft bing verification */}
          {/* <meta
            name="msvalidate.01"
            content="C34B962949690979DF0ADC0147270090"
          /> */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
          <link
            rel="icon"
            sizes="180x180"
            href="/apple-icon.png"
            type="image/png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.__initialWindowWidth = document.documentElement.clientWidth;
            `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

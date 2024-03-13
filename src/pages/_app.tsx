import { FC } from 'react';
import { AppProps } from 'next/app';
import * as React from 'react';
import '../styles/global.scss';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;

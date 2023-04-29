import '@/styles/global.css';

import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { FC } from 'react';

import { useDarkMode } from '@/hooks/useDarkMode';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { colorScheme, toggleColorScheme } = useDarkMode();

  return (
    <>
      <Head>
        <title>Pose Annotator</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <MantineProvider
            theme={{
              colorScheme,
            }}
          >
            <Component {...pageProps} />
          </MantineProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default App;

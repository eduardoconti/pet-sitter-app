import Layout from '@/components/layout';
import { ErrorBoundary } from 'react-error-boundary';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material';

import { AuthProvider } from '@/context/auth-context';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ErrorBoundary
      fallback={
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: `${theme.palette.background}`,
          }}
        >
          <Typography variant="h1">Oops, ocorreu um erro!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.reload()}
          >
            Tentar novamente
          </Button>
        </Box>
      }
    >
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ErrorBoundary>
  );
}

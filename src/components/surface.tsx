import { Paper, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

export default function Surface({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
      }}
      elevation={1}
    >
      {children}
    </Paper>
  );
}

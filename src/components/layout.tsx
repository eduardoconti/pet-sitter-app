import * as React from 'react';
import {
  createTheme,
  styled,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Menu, MenuItem, useMediaQuery } from '@mui/material';
import { AuthContext } from '@/context/auth-context';
import PersonIcon from '@mui/icons-material/Person';
import Router from 'next/router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Pets from '@mui/icons-material/Pets';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const ColorMode = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'right',
      }}
    >
      <IconButton
        sx={{ ml: 1 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
};
export default function Layout({ children }: React.PropsWithChildren) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light',
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const newTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#3f51b5',
          },
          secondary: {
            main: '#1de9b6',
          },
          mode,
        },
      }),
    [mode],
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={newTheme}>
        <CssBaseline />
        <AppDrawer>{children}</AppDrawer>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const AppDrawer = ({ children }: React.PropsWithChildren) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: 'none' }),
              alignItems: 'center',
            }}
          >
            <MenuIcon />
          </IconButton>
          <MainLogo color="#FFF" size="40px" />
          <Typography variant="h6" marginLeft={1}>
            Pet Sitter
          </Typography>
          <ColorMode />
          <UserDropdown />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => Router.push('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {children}
        </Box>
      </Main>
    </Box>
  );
};

const UserDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const { logout, user } = React.useContext(AuthContext);

  const handleDropdownOpen = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <IconButton sx={{ ml: 1 }} onClick={handleDropdownOpen} color="inherit">
        <PersonIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 180, marginTop: 2 } }}
      >
        {user?.nome ? (
          <Box>
            <Typography variant="subtitle1" align="center">
              {user.nome}
            </Typography>
            <Divider />
          </Box>
        ) : null}
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <Typography variant="subtitle2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

function MainLogo({ size, color }: { size?: string; color?: string }) {
  const defaultSize = '80px';
  const theme = useTheme();
  return (
    <Pets
      sx={{
        color: color ?? theme.palette.primary.main,
        width: size ?? defaultSize,
        height: size ?? defaultSize,
      }}
      fontSize="inherit"
    />
  );
}

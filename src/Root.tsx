import React from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Router from './router/Router';
import store from './reducers/configureStore';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#605F5F',
    },
    secondary: {
      main: '#E57F10',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function Root(): JSX.Element {
  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router />
        </Provider>
      </MuiThemeProvider>
    </>
  );
}

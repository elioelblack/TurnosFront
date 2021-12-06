import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Context from './Context';

const App = () => {
  console.log(routes)
  const routing = useRoutes(routes);

  return (
    <Context.Provider>
      <Context.Consumer>
        {({ isAuth }) => {
          return (
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              {routing}
              <ToastContainer />
            </ThemeProvider>
          )
        }}
      </Context.Consumer>


    </Context.Provider>
  );
};

export default App;

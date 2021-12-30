import React, { useState }from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import AuthenticationService from '../../service/AuthenticationService';
import Snackbar from '@material-ui/core/Snackbar';
import Context from 'src/Context';

import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));


const LoginView = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [msgToast, setMsgToast] = useState(false);

  const handleClose = ()=>{
    setOpen(false);
  }

  const showMessage = (msg)=>{
    setMsgToast(msg)
    setOpen(true)
  }
  return (
    <Context.Consumer>
    {({activateAuth})=>{
      return(
    <Page
      className={classes.root}
      title="Login QueueApp"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().max(255).required('Usuario es requerido'),
              password: Yup.string().max(255).required('Contraseña es requerida')
            })}
            onSubmit={(values,isSubmitting) => {
              isSubmitting = true;
              AuthenticationService
                .executeJwtAuthenticationService(values.username, values.password)
                .then((response) => {
                    activateAuth(response)
                    window.location = "/app/dashboard" //Ruta para obligar a refrescar y cargar de nuevo las rutas
                    isSubmitting = false;
                }).catch((err) => {
                    //console.log(err.response.data.message)
                    showMessage(String(err).indexOf("401")>0?String(err.response.data.message):String(err))
                    isSubmitting = false;
                })
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitionCompleted,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Iniciar Sesión
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Ingresar a QueueApp
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Usuario"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.username.trim()}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Contraseña"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password.trim()}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitionCompleted}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Ingresar
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
      <Snackbar
          anchorOrigin={{ vertical: 'top',
          horizontal: 'center'}}
          open={open}
          onClose={handleClose}
          variant="error"
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{msgToast}</span>}
        />
    </Page>
      )}}
    </Context.Consumer>
  );
};

export default LoginView;

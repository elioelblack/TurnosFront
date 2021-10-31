import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import AuthenticationService from 'src/service/AuthenticationService';
import solReact from '../../../js/solReact';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const action = solReact.getQueryVariable("action");
  const classes = useStyles();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    function loadUserDetails() {
      AuthenticationService.whoami()
        .then(response => {
          //console.log(response.data)
          setUserDetail(response.data)
        }).catch(err => {
          console.error(err)
        })
    }
    loadUserDetails();
  }, []);

  const user = {
    avatar: '/static/images/avatars/default-avatar.png',
    city: 'San Salvador',
    country: 'El Salvador',
    jobTitle: (userDetail != null) ? userDetail.username + ' (' + userDetail.id_rol.nombre_rol + ') ' : 'loading',
    name: (userDetail != null) ? userDetail.nombre + " " + userDetail.apellido : 'loading',
    timezone: 'GTM-7'
  };

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          {(action === 'view') && <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <Profile user={user} />
          </Grid>}
          {(action !== 'view') && <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <ProfileDetails />
          </Grid>}
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;

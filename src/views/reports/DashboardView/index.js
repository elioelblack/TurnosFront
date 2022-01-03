import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import LastTurns from './LastTurns';
import TurnsByCategory from './TurnsByCategory';
import TurnsRecalled from './TurnsRecalled';
import TurnsToday from './TurnsToday';
import TurnsNoAcude from './TurnsNoAcude';
import DashboardService from '../Service/serviceDashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [infoDasboard, setInfoDasboard] = useState(null);

  useEffect(() => {
    function loadDashboardInfo() {
      DashboardService.loadDashboardInfo()
        .then(response => {
          //console.log(response.data)
          setInfoDasboard(response.data)
        }).catch(err => {
          console.error(err)
        })
    }
    loadDashboardInfo();
  }, []);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <LastTurns data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TurnsToday data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TurnsRecalled data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TurnsNoAcude data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <TurnsByCategory />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;

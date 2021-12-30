import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import LastestEncuestas from './LastestEncuestas';
import Sales from './Sales';
import LastestUsers from './LastestUsers';
import TotalUsuarios from './TotalUsuarios';
import TotalPreguntasRespondidas from './TotalPreguntasRespondidas';
import TrafficByDevice from './TrafficByDevice';
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
  const [infoDasboard2, setInfoDasboard2] = useState(null);

  useEffect(()=>{
    function loadDashboardInfo(){
      DashboardService.loadDashboardInfo()
      .then(response=>{
        //console.log(response.data)
        setInfoDasboard(response.data)
      }).catch(err=>{
        console.error(err)
      })
    }
    loadDashboardInfo();
  },[]);
  useEffect(()=>{
    function loadDashboardInfo2(){
      DashboardService.loadDashboardInfo2()
      .then(response=>{
        console.log(response.data)
        setInfoDasboard2(response.data)
      }).catch(err=>{
        console.error(err)
      })
    }
    loadDashboardInfo2();
  },[]);
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
            <LastestEncuestas data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalUsuarios data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <LastestUsers data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalPreguntasRespondidas data={infoDasboard} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales dataP={infoDasboard2} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;

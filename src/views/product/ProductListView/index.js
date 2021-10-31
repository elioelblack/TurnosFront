import React,{useState,useEffect} from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import ReportAllEncuesta from './ReportAllEncuesta';
import serviceReport from '../service/serviceReport';


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

 const [arrayEncuesta, setArryEncuesta] = useState([])

 useEffect(()=>{
  function loadAll(){
    serviceReport.findAll()
    .then(response=>{
      console.log(response.data)
      setArryEncuesta(response.data)
    }).catch(err=>{
      console.error(err)
    })
  }

  loadAll();

 },[]);
 


  return (
    <Page
      className={classes.root}
      title="Reportes"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <ReportAllEncuesta encuestas={arrayEncuesta} />
          </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <ReportAllEncuesta />
          </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <ReportAllEncuesta />
          </Grid>
          <Grid
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <ReportAllEncuesta />
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;

import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  }
}));

const Budget = ({ className,data, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={1}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="subtitle2"
            >
              TURNOS ATENDIDOS LOS ÚLTIMOS 30 DÍAS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {(data!==null)?data.turnos_last_month:0}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AssignmentIndIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;

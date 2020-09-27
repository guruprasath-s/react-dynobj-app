import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewAgendaIcon from "@material-ui/icons/ViewAgenda";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(2)
  },
  grid: {
    display: "flex"
  },
  card: {
    minWidth: 275
  },
  layout__toggle: {
    display: "flex",
    justifyContent: "flex-end"
  },
  key: {
    display: "inline-block",
    color: "#5d8ed5"
  },
  value: {
    display: "inline-block",
    fontWeight: "500"
  }
}));
const Home = (props) => {
  const classes = useStyles();
  const showObj = (obj) => {
    let sorted;
    if (props.attrOrder.length > 0) {
      let not_sorted = obj;
      sorted = props.attrOrder.reduce(function (acc, key) {
        acc[key] = not_sorted[key];
        return acc;
      }, {});
    } else {
      sorted = obj;
    }
    let values = [];
    _.forEach(sorted, function (value, key) {
      if (_.includes(props.selectedAttr, key)) {
        values.push(
          value && (
            <div key={key}>
              <Typography
                className={classes.key}
                color="textSecondary"
                gutterBottom
              >
                {key}:
              </Typography>{" "}
              <Typography
                className={classes.value}
                color="textPrimary"
                gutterBottom
              >
                {value}
              </Typography>
            </div>
          )
        );
      }
    });
    return values;
  };
  return (
    <>
      <div className={classes.layout__toggle}>
        <ButtonGroup variant="contained" color="primary">
          <IconButton
            aria-label="Grid"
            onClick={() => {
              props.changeView("grid");
            }}
            size="medium"
          >
            <ViewModuleIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="list"
            onClick={() => {
              props.changeView("list");
            }}
          >
            <ViewAgendaIcon fontSize="medium" />
          </IconButton>
        </ButtonGroup>
      </div>
      <Grid container className={classes.root} spacing={2}>
        {props.selectedAttr.length > 0 &&
          props.businessObj.map((obj) => {
            return (
              <Grid
                item
                {...(props.view === "grid"
                  ? { xs: 6, md: 4, style: { display: "flex" } }
                  : { xs: 12 })}
              >
                <Card className={classes.card} elevation={3}>
                  <CardContent>{showObj(obj)}</CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default Home;

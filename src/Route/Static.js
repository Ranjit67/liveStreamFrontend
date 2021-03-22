import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100px",
  },
  startClass: {
    backgroundColor: "#fab1a0",
    marginRight: "20px",
  },
  attendClass: {
    backgroundColor: "#e17055",
  },
}));
export default function Static() {
  const history = useHistory();
  const classes = useStyles();
  const attendClassRoute = () => {
    history.push("/join");
  };
  return (
    <div className={classes.root}>
      <Button
        className={classes.startClass}
        onClick={() => {
          history.push("/class");
        }}
      >
        Start Class
      </Button>
      <Button onClick={attendClassRoute} className={classes.attendClass}>
        Attend Class
      </Button>
    </div>
  );
}

import { Button, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";
const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
  },
  submitBtn: {
    backgroundColor: "#8395a7",
    marginLeft: "40px",
  },
});
export default function JoinClass() {
  const history = useHistory();
  const [unique, setunique] = useState();

  const uniqueHandler = (e) => {
    setunique(e.target.value);
  };
  const makeRoute = () => {
    if (unique) {
      history.push(`video/${unique}`);
    } else {
      alert("Fill all the field.");
    }
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {/* <input
        type="text"
        name="unique"
        placeholder="enter unique key"
        onChange={uniqueHandler}
      /> */}
      <TextField
        id="standard-basic"
        type="text"
        name="unique"
        label="enter unique key"
        onChange={uniqueHandler}
      />
      <Button className={classes.submitBtn} onClick={makeRoute}>
        Submit
      </Button>
    </div>
  );
}

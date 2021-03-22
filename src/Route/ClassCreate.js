import { useEffect, useState, useRef } from "react";
import { Button, withStyles, TextField } from "@material-ui/core";
import { useHistory } from "react-router";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

const useStyles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100px",
  },
  startPublic: {
    backgroundColor: "#ff7675",
    marginRight: "10px",
  },
  startPrivate: {
    backgroundColor: "#ff7675",
  },
  inputField: {
    // height: "26px",
    marginRight: "20px",
  },
});

function ClassCreate(props) {
  const { classes } = props;
  const history = useHistory();
  const socketRef = useRef();

  const startVideo = () => {
    const uui = uuid();
    const uui2 = uuid();
    socketRef.current.emit("cheack have an already or new", {
      firstId: uui,
      secondId: uui2,
      name: subject,
    });
    history.push(`video/${uui}/${uui2}`);
  };
  const [subject, setsubject] = useState();
  useEffect(() => {
    //https://app-streamapi.herokuapp.com/
    //http://localhost:5000/
    socketRef.current = io.connect("https://app-streamapi.herokuapp.com/");
  }, []);
  const inputHandler = (e) => {
    setsubject(e.target.value);
  };
  return (
    <div className={classes.root}>
      {/* <input
        type="text"
        name="subjectName"
        placeholder="Enter Subject name"
        className={classes.inputField}
        onChange={inputHandler}
      /> */}
      <TextField
        id="standard-basic"
        type="text"
        name="subjectName"
        label="Enter Subject name"
        className={classes.inputField}
        onChange={inputHandler}
      />
      <Button className={classes.startPublic} onClick={startVideo}>
        Start
      </Button>
    </div>
  );
}
export default withStyles(useStyles)(ClassCreate);

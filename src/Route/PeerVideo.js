import { makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
const useStyles = makeStyles((theme) => ({
  peerVideo: {
    marginTop: 50,
    [theme.breakpoints.up("md")]: {
      width: "70%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));
export default function PeerVideo(props) {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);
  const classes = useStyles();
  return <video className={classes.peerVideo} playsInline autoPlay ref={ref} />;
}

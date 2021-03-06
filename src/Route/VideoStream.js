import { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router";
import io from "socket.io-client";
import Peer from "simple-peer";
import {
  Button,
  makeStyles,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PeerVideo from "./PeerVideo";
import ShareIcon from "@material-ui/icons/Share";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
  },
  optionAndNumPepleCont: {
    marginTop: 20,
    width: "90%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  btns: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "20%",
    },
  },
  acceptAllRequestDiv: {
    marginTop: "30px",
    width: "95%",
  },
  requestList: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
    marginBottom: "40px",
  },
  answerClient: {
    display: "flex",
    width: "95%",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  clintNameOnAnswer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  clientIdNameDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "140%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "140%",
    },
  },
  privateBtn: {
    backgroundColor: "#b2bec3",
    margin: "10px 0 20px 0",
  },
  publicBtn: {
    margin: "10px 0 20px 0",
    backgroundColor: "#636e72",
  },
  acceptAllreq: {
    backgroundColor: "#95a5a6",
  },
  acceptBtn: {
    backgroundColor: "#CAD3C8",
    marginRight: "20px",
  },
  rejectBtn: {
    backgroundColor: "#B53471",
  },
  leaveMeetingBtn: {
    margin: "10px 0 20px 0",
    backgroundColor: "#c8d6e5",
    transition: "1s",
    "&:hover": {
      color: "white",
    },
  },
  optionItem: {
    margin: "10px 0 20px 0",
    backgroundColor: "#aaa69d",
  },
  optionOn: {
    backgroundColor: "#1289A7",
  },
  optionOff: {
    backgroundColor: "#9980FA",
  },
  clearBtns: {
    backgroundColor: "#808e9b",
  },
  clearAnswer: {
    backgroundColor: "#ccae62",
  },
  answer: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  linksCode: {
    width: "95%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  pepleConnect: {
    [theme.breakpoints.down("md")]: {
      marginTop: 15,
    },
  },
  selfVideo: {
    marginTop: 50,
    [theme.breakpoints.up("md")]: {
      width: "70%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  nameDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
  },
  subName: {
    backgroundColor: "#c8d6e5",
    marginLeft: "20px",
  },
  linkBtnOffOn: {
    backgroundColor: "#b2bec3",
    marginTop: "40px",
  },
  //side draw css
  sideDrawPapear: {
    position: "absolute",
    top: 47,
    left: 1,
    // height: "400px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#c8d6e5",
    [theme.breakpoints.down("sm")]: {
      width: 230,
    },
    [theme.breakpoints.up("sm")]: {
      width: 300,
    },
  },
  menuBarAndSName: {
    display: "flex",
    alignItems: "center",
  },
  parentDivAppBarIconAndshare: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  shareIcoDivAppbar: {
    display: "flex",
    alignItems: "center",
  },
  sharebtnAppbar: {
    color: "white",
  },
  shareInManu: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    justifyContent: "center",
    transition: "1s",
    "&:hover": {
      backgroundColor: "#576574",
      color: "white",
    },
  },
  shareText: {
    marginRight: 10,
  },
  leaveMeetingManuBar: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    justifyContent: "center",
    transition: "1s",
    "&:hover": {
      backgroundColor: "#576574",
      color: "white",
    },
  },
  pubAndPriInManu: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    justifyContent: "center",
    transition: "1s",
    "&:hover": {
      backgroundColor: "#576574",
      color: "white",
    },
  },

  courseNameClient: {
    marginLeft: 20,
  },
}));
export default function VideoStream() {
  const { id, id2 } = useParams();
  const socketRef = useRef();
  const myVideo = useRef();
  const peersRef = useRef([]);
  const [sideDraw, setsideDraw] = useState(false);
  const [hostAOption, sethostAOption] = useState([]);
  const [hostBOption, sethostBOption] = useState([]); //it cont json clientId, name, optionClik
  const [hostCOption, sethostCOption] = useState([]);
  const [countClient, setcountClient] = useState(0);
  const [correctOption, setcorrectOption] = useState();
  const [showOption, setshowOption] = useState();
  const [hostPeer, sethostPeer] = useState();
  const [option, setoption] = useState(false);
  const [message, setmessage] = useState();
  const [courseName, setcourseName] = useState("");
  const [publicer, setpublic] = useState(false);
  const [name, setname] = useState();
  const [requestList, setrequestList] = useState([]); //json data 'clientId' and 'name'
  const [clik, setclik] = useState(false);
  const optionHandle = () => {
    setoption((user) => !user);
    sethostAOption([]);
    sethostBOption([]);
    sethostCOption([]);
    socketRef.current.emit("get option to client", { option: !option });
  };
  useEffect(() => {
    //http://localhost:5000/
    //https://app-streamapi.herokuapp.com/
    socketRef.current = io.connect("https://app-streamapi.herokuapp.com/");
    if (id2) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          myVideo.current.srcObject = stream;
          if (id2) {
            socketRef.current.emit("cheack have an already or new", {
              firstId: id,
              secondId: id2,
            });
            socketRef.current.on("send for signal", (payload) => {
              // console.log(payload);
              const peer = createPeer(
                payload.userId,
                socketRef.current.id,
                stream
              );
              peersRef.current.push({
                peerID: payload.userId,
                peer,
              });
              setcountClient((countPrev) => countPrev + 1);
            });
          }
        });
    }

    //host section

    socketRef.current.on("Send course name", (courseName) => {
      // console.log(courseName);
      setcourseName(courseName.courseName);
    });
    socketRef.current.on("required permission of host", (payload) => {
      const { clientId, name } = payload;
      const req = {
        clientId,
        name,
      };
      setrequestList((prev) => [...prev, req]);
    });
    socketRef.current.on("client is disconnected", (message) => {
      setmessage(message);
    });

    //client section

    socketRef.current.on("permission accept", (payload) => {
      socketRef.current.emit("after accept send signal to client", {
        hostID: payload.hostId,
      });
    });

    socketRef.current.on("permission reject", (message) => {
      setmessage(message);
    });
    socketRef.current.on("host not exit", (message) => {
      setmessage(message);
    });
    socketRef.current.on("user joined", (payload) => {
      // console.log(payload);
      const peer = addPeer(payload.hostSignal, payload.hostSelfId);
      sethostPeer({
        peerID: payload.hostSelfId,
        peer,
      });
      setcourseName(payload.courseName);
    });
    socketRef.current.on("receiving returned signal", (payload) => {
      setmessage();
      const item = peersRef.current.find((p) => p.peerID === payload.id);

      item.peer.signal(payload.signal);
    });
    socketRef.current.on("client side option", (payload) => {
      // console.log(payload);
      setshowOption(payload.cOption);
    });
    socketRef.current.on("send result to host", (payload) => {
      console.log(payload.optionData);
      const data = {
        optionClik: payload.optionData,
        name: payload.name,
        clientId: payload.clientId,
      };
      switch (payload.optionData) {
        case "A": {
          sethostAOption((user) => [...user, data]);
          break;
        }
        case "B": {
          sethostBOption((user) => [...user, data]);
          break;
        }
        case "C": {
          sethostCOption((user) => [...user, data]);
          break;
        }
        default: {
          console.log("data is corrupt.");
        }
      }
    });
    socketRef.current.on("result to client", (result) => {
      setcorrectOption(result.result);
    });
    //suddenly host leave clint get data
    socketRef.current.on("host leave suddenly", (leave) => {
      socketRef.current.emit("cheack this host is bloging or not", {
        hostLeaveID: leave.roomLeave,
        room: id,
      });
    });
    socketRef.current.on("clint belong", (payload) => {
      console.log(hostPeer);
      // hostPeer.peer.peer.destroy();
      sethostPeer();
      history.push("/");
    });
    socketRef.current.on("one client leave", (payload) => {
      console.log(payload.clientId);
      setcountClient((countPrev) => countPrev - 1);
      const findData = peersRef.current.find(
        (id) => id.peerID === payload.clientId
      );

      const afterDisconnectClient = peersRef.current.filter(
        (id) => id.peerID !== payload.clientId
      );
      peersRef.current = afterDisconnectClient;
      findData.peer.destroy();
      socketRef.current.emit("remove the client", {
        removeId: payload.clientId,
        room: id,
      });
    });
  }, []);
  function addPeer(incomingSignal, callerID) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }
  // host function

  const publicHandler = () => {
    setsideDraw(false);
    socketRef.current.emit("user public status", {
      public: publicer,
      roomId: id,
    });

    setpublic((pub) => !pub);
  };
  const acceptRequest = (index) => {
    const clientId = requestList[index].clientId;
    socketRef.current.emit("permission status", { clientId, permission: true });
    let temp = requestList;
    temp.splice(index, 1);
    temp = [...temp];
    setrequestList(temp);
  };
  const rejectRequest = (index) => {
    const clientId = requestList[index].clientId;
    socketRef.current.emit("permission status", {
      clientId,
      permission: false,
    });
    let temp = requestList;
    temp.splice(index, 1);
    temp = [...temp];
    setrequestList(temp);
  };
  const acceptAllRequest = () => {
    requestList.forEach((user) => {
      socketRef.current.emit("permission status", {
        clientId: user.clientId,
        permission: true,
      });
    });
    setrequestList([]);
  };
  const leaveMeeting = () => {
    if (id2) {
      socketRef.current.emit("host leave", "host");
      history.push("/");
    } else if (!id2 && id) {
      socketRef.current.emit("client leave", "client");
      history.push("/");
    }
  };
  //client function

  const handelClik = () => {
    if (name) {
      socketRef.current.emit("client name send", { name, roomId: id });
      setclik(true);
      setmessage();
    } else {
      alert("Fill all the field.");
    }
  };
  //
  const resultOption = (data) => {
    if (!id2) {
      socketRef.current.emit("send result from client", { data, room: id });
      setshowOption(false);
    } else if (id2) {
      socketRef.current.emit("send result from host", { data });
      setoption(false);
    }
  };
  const shareLink = () => {
    // setshowLink((prev) => !prev);
    setsideDraw(false);
    if (navigator.share) {
      navigator
        .share({
          title: "Example Page",
          url: `https://app-stream-video.herokuapp.com/video/${id}/`,
        })
        .then(() => {
          console.log("data succesfully send.");
        })
        .catch((err) => console.log(err));
    }
  };
  const sideDrawaHandel = () => {
    setsideDraw((prev) => !prev);
  };
  const classes = useStyles();
  const history = useHistory();
  return clik || id2 ? (
    <div className={classes.root}>
      {/* //appbar */}
      <AppBar position="static">
        <Toolbar variant="dense">
          <div className={classes.parentDivAppBarIconAndshare}>
            <div className={classes.menuBarAndSName}>
              {id2 && (
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={sideDrawaHandel}
                >
                  <MenuIcon />
                </IconButton>
              )}
              {courseName && id2 && (
                <Typography variant="h6" color="inherit">
                  {courseName}
                </Typography>
              )}
              {!id2 && (
                <Button
                  className={classes.leaveMeetingBtn}
                  onClick={leaveMeeting}
                >
                  Leave meeting
                </Button>
              )}
            </div>
            <div className={classes.shareIcoDivAppbar}>
              {id2 && (
                <IconButton
                  className={classes.sharebtnAppbar}
                  onClick={shareLink}
                >
                  <ShareIcon />
                </IconButton>
              )}
              {!id2 && courseName && (
                <h3 className={classes.courseNameClient}> {courseName}</h3>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {/* //end app bar */}

      {id2 && (
        <video
          muted
          className={classes.selfVideo}
          ref={myVideo}
          autoPlay
          playsInline
        />
      )}
      {/* </>
      )} */}

      {!id2 && hostPeer && (
        <PeerVideo key={hostPeer.peerID} peer={hostPeer.peer} />
      )}
      <div className={classes.optionAndNumPepleCont}>
        {id2 && (
          <div>
            {option ? (
              <Button className={classes.optionOn} onClick={optionHandle}>
                option on
              </Button>
            ) : (
              <Button className={classes.optionOff} onClick={optionHandle}>
                option off
              </Button>
            )}
          </div>
        )}
        {id2 && (
          <div className={classes.pepleConnect}>
            Number of people connected in{" "}
            <span className={classes.answer}>{countClient}</span>
          </div>
        )}
      </div>
      {(showOption || option) && (
        <div className={classes.btns}>
          <Button
            className={classes.optionItem}
            onClick={() => resultOption("A")}
          >
            A
          </Button>
          <Button
            className={classes.optionItem}
            onClick={() => resultOption("B")}
          >
            B
          </Button>
          <Button
            className={classes.optionItem}
            onClick={() => resultOption("C")}
          >
            C
          </Button>
        </div>
      )}
      {correctOption && (
        <div>
          <p>
            The correct option is
            <span className={classes.answer}> {correctOption}</span>
          </p>
          <Button
            className={classes.clearAnswer}
            onClick={() => {
              setcorrectOption();
            }}
          >
            Clear answer
          </Button>
        </div>
      )}
      {option && (
        <div className={classes.answerResult}>
          <p>
            a:
            {((hostAOption.length * 100) / countClient).toFixed(2)}%
          </p>
          <p>
            b:
            {((hostBOption.length * 100) / countClient).toFixed(2)}%
          </p>
          <p>
            c:
            {((hostCOption.length * 100) / countClient).toFixed(2)}%
          </p>
        </div>
      )}
      {requestList.length > 1 && (
        <div className={classes.acceptAllRequestDiv}>
          <Button className={classes.acceptAllreq} onClick={acceptAllRequest}>
            Accept all request
          </Button>
        </div>
      )}
      <div className={classes.requestList}>
        {requestList &&
          requestList.map((key, index) => (
            <div key={key.clientId} className={classes.oneByOneRequestDiv}>
              <p>{key.name} request to join</p>
              <Button
                className={classes.acceptBtn}
                onClick={() => acceptRequest(index)}
              >
                Accept
              </Button>
              <Button
                className={classes.rejectBtn}
                onClick={() => rejectRequest(index)}
              >
                Reject
              </Button>
            </div>
          ))}
      </div>
      {(hostAOption.length > 0 ||
        hostBOption.length > 0 ||
        hostCOption.length > 0) && (
        <Button
          onClick={() => {
            sethostAOption([]);
            sethostBOption([]);
            sethostCOption([]);
          }}
          className={classes.clearBtns}
        >
          Clear all
        </Button>
      )}
      {id2 &&
        (hostAOption.length > 0 ||
          hostBOption.length > 0 ||
          hostCOption.length > 0) && (
          <div className={classes.answerClient}>
            <div className={classes.clintNameOnAnswer}>
              <h3>A</h3>
              {hostAOption.map((client) => (
                <div key={client.clientId} className={classes.clientIdNameDiv}>
                  <p>{client.clientId}</p>
                  <p>{client.name}</p>
                </div>
              ))}
            </div>
            <div className={classes.clintNameOnAnswer}>
              <h3>B</h3>
              {hostBOption.map((client) => (
                <div key={client.clientId} className={classes.clientIdNameDiv}>
                  <p>{client.clientId}</p>
                  <p>{client.name}</p>
                </div>
              ))}
            </div>
            <div className={classes.clintNameOnAnswer}>
              <h3>C</h3>
              {hostCOption.map((client) => (
                <div key={client.clientId} className={classes.clientIdNameDiv}>
                  <p>{client.clientId}</p>
                  <p>{client.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      {message && message}
      {sideDraw && (
        <div className={classes.sideDrawPapear}>
          {id2 && (
            <>
              {publicer ? (
                <div
                  className={classes.pubAndPriInManu}
                  onClick={publicHandler}
                >
                  <h5>Go to Public</h5>
                </div>
              ) : (
                <div
                  className={classes.pubAndPriInManu}
                  onClick={publicHandler}
                >
                  <h5>Go to Private</h5>
                </div>
              )}
            </>
          )}
          {id2 && (
            <div className={classes.shareInManu} onClick={shareLink}>
              <h4 className={classes.shareText}>Share </h4>
              <ShareIcon />
            </div>
          )}
          <div className={classes.leaveMeetingManuBar} onClick={leaveMeeting}>
            <h4>Leave meeting</h4>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className={classes.nameDiv}>
      {/* <input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setname(e.target.value)}
      /> */}
      <TextField
        id="standard-basic"
        type="text"
        label="Enter your name"
        onChange={(e) => setname(e.target.value)}
      />
      <Button className={classes.subName} onClick={handelClik}>
        Clik
      </Button>
    </div>
  );
}

//host leave in broadcast system

import { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Button, makeStyles, TextField } from "@material-ui/core";
import PeerVideo from "./PeerVideo";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  optionAndNumPepleCont: {
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
  acceptAllRequest: {
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
  leaveMeetingBtn: {
    margin: "10px 0 20px 0",
    backgroundColor: "#e17055",
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
    [theme.breakpoints.down("md")]: {},
  },
  selfVideo: {
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
}));
export default function VideoStream() {
  const { id, id2 } = useParams();
  const socketRef = useRef();
  const myVideo = useRef();
  const peersRef = useRef([]);
  const [showLink, setshowLink] = useState(false);
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
  const classes = useStyles();
  const history = useHistory();
  return clik || id2 ? (
    <div className={classes.root}>
      {/* {id2 && (
        <Button className={classes.linkBtnOffOn} onClick={shareLink}>
          {!showLink ? "CLICK FOR FIND LINK FOR SHARE" : "close"}
        </Button>
      )} */}
      {id2 && (
        <Button className={classes.linkBtnOffOn} onClick={shareLink}>
          CLICK FOR FIND LINK FOR SHARE
        </Button>
      )}
      {/* {id2 && showLink && (
        <div className={classes.linksCode}>
          <p>share link:</p>
          <p>https://app-stream-video.herokuapp.com/video/{id}/</p>
          <p>OR</p>
          <p>CODE :{id}</p>
        </div>
      )} */}
      {id2 && (
        <>
          {courseName && <h3>Subject: {courseName}</h3>}
          {publicer ? (
            <Button className={classes.publicBtn} onClick={publicHandler}>
              Go to Public
            </Button>
          ) : (
            <Button className={classes.privateBtn} onClick={publicHandler}>
              Go to Private
            </Button>
          )}
          {id2 && (
            <video
              muted
              className={classes.selfVideo}
              ref={myVideo}
              autoPlay
              playsInline
            />
          )}
        </>
      )}

      <Button className={classes.leaveMeetingBtn} onClick={leaveMeeting}>
        Leave meeting
      </Button>

      {!id2 && hostPeer && (
        <PeerVideo width="50%" key={hostPeer.peerID} peer={hostPeer.peer} />
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
        <div className={classes.acceptAllRequest}>
          <button onClick={acceptAllRequest}>Accept all request</button>
        </div>
      )}
      <div className={classes.requestList}>
        {requestList &&
          requestList.map((key, index) => (
            <div key={key.clientId} className={classes.oneByOneRequestDiv}>
              <p>{key.name} request to join</p>
              <button onClick={() => acceptRequest(index)}>Accept</button>
              <button onClick={() => rejectRequest(index)}>Reject</button>
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

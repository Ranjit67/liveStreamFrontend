import { useEffect, useRef } from "react";

export default function PeerVideo(props) {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video width="50%" playsInline autoPlay ref={ref} />;
}

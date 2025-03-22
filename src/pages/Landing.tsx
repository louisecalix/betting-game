import Welcome from "../components/Welcome";
import { useSocket } from "../services/SocketContext";
import { useEffect } from "react";

const Landing = () => {
  // const socket = useSocket();
  // useEffect(() => {
  //   if (!socket) {
  //     console.error("Socket not initialized");
  //     return;
  //   }

  // }, [socket]);

  return (
    <div>
      <Welcome />
    </div>
  );
};

export default Landing;

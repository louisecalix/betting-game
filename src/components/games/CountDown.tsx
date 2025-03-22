import { useState, useEffect } from "react";
import { useSocket } from "../../services/SocketContext";

interface CountdownTimerProps {
  onCountDownEnd: () => void;
  roundID: string | null;
}

const CountdownTimer = ({ onCountDownEnd, roundID }: CountdownTimerProps) => {
  const { socket, isAuthenticated } = useSocket() || {};
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  useEffect(() => {
    if (socket && isAuthenticated) {
      const handleTimerUpdate = (timeRemaining: number) => {
        if (timeRemaining > 0) {
          const minutes = Math.floor(timeRemaining / 60000);
          const seconds = Math.floor((timeRemaining % 60000) / 1000);
          setMinutes(String(minutes).padStart(2, "0"));
          setSeconds(String(seconds).padStart(2, "0"));
        } else {
          onCountDownEnd();
        }
      };

      socket.on("timer-update", handleTimerUpdate);

      return () => {
        socket.off("timer-update", handleTimerUpdate);
      };
    }
  }, [socket, isAuthenticated, onCountDownEnd]);

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-4 pt-10 bg-black rounded-lg border-2 border-yellow-500 shadow-lg relative">
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg px-6 py-2 border-2 border-yellow-500 shadow-lg">
        <h2 className="text-sm font-semibold text-gray-200 text-center">Round</h2>
        <div className="text-xl font-bold text-yellow-400 text-center">
          {roundID || "Loading..."}
        </div>
      </div>

      <div className="text-yellow-500 font-bold text-xl mb-2 uppercase tracking-wider mt-4">
        Time Remaining
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="bg-black border-2 border-yellow-500 rounded-lg p-2 w-24 flex items-center justify-center shadow-lg">
            <span className="text-red-600 text-5xl font-bold font-mono">
              00
            </span>
          </div>
          <span className="text-yellow-500 text-sm mt-1 uppercase">Hours</span>
        </div>

        <div className="flex flex-col justify-center items-center mt-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-black border-2 border-yellow-500 rounded-lg p-2 w-24 flex items-center justify-center shadow-lg">
            <span className="text-red-600 text-5xl font-bold font-mono">
              {minutes}
            </span>
          </div>
          <span className="text-yellow-500 text-sm mt-1 uppercase">Minutes</span>
        </div>

        <div className="flex flex-col justify-center items-center mt-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-black border-2 border-yellow-500 rounded-lg p-2 w-24 flex items-center justify-center shadow-lg">
            <span className="text-red-600 text-5xl font-bold font-mono">
              {seconds}
            </span>
          </div>
          <span className="text-yellow-500 text-sm mt-1 uppercase">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
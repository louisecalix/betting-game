import "../../css/WP.css";
import { useState, useEffect } from "react";
import { useSocket } from "../../services/SocketContext";

// interface WinningPrizeProps {
// }

const WinningPrize = () => {
  const { socket, isAuthenticated } = useSocket() || {};
  const [ prize, setPrize] = useState<number>(0);

  useEffect(() => {
    if (socket && !isAuthenticated) {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      if (token && user_id) {
        socket.emit("request-authentication", { token, user_id});
      }
    }

    if (socket && isAuthenticated){
      const handlePrize = (data: { prize: number}) => {
        setPrize(data.prize);
      }

      socket.on("prize-update", handlePrize);

    }
  }, [socket, isAuthenticated]);


  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="inline-block text-center">
        <div className="bg-black text-yellow-400 font-bold text-center py-3 px-10 rounded-full 
          mb-1 text-lg sm:text-xl md:text-2xl lg:text-[1.5rem] tracking-wider w-auto inline-block 
          border-2 border-yellow-500 shadow-[0_0_12px_3px_rgba(255,215,0,0.5)]">
          WINNING PRIZE
        </div>
        
        {/* Prize Display */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg opacity-75"></div>
          
          <div className="relative bg-black rounded-lg px-6 sm:px-8 md:px-10 py-4 flex justify-center 
            border-2 border-yellow-500 shadow-[0px_8px_20px_rgba(255,215,0,0.5)]">
            
            <span className="text-yellow-500 text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold mr-2">₱</span>
            
            {/* PRIZE AMOUNT */}
            <div className="text-red-600 text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-widest"
                 style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>
              {prize.toLocaleString()}
            </div>
          </div>
          

          <div className="absolute -top-1 left-0 right-0 flex justify-between px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-yellow-300 shadow-md shadow-yellow-300"></div>
            ))}
          </div>
          <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-yellow-300 shadow-md shadow-yellow-300"></div>
            ))}
          </div>
        </div>
        
      </div>
      

    </div>
  );
};

export default WinningPrize;
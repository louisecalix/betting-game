import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/headers/Header";
import treasureIcon from "../assets/images/treasure.png";
import coinIcon from "../assets/images/coin.png";
import { useSocket } from "../services/SocketContext";
// import { getSocket } from "../services/socket";


const Main: React.FC = () => {
  const { socket, isAuthenticated } = useSocket() || {};
  const navigate = useNavigate();
  
  // console.log("user_id:", user_id);

  const [bonusState, setBonusState] = useState("unclaimed");
  const [coins, setCoins] = useState<number | null>(null);
  const [claimStatus, setClaimStatus] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");
  const [prize, setPrize] = useState<number>(0);
  const [prevWinners, setPrevWinners] = useState<any[]>([]);
  const [prizePerWinner, setPrizePerWinner] = useState(0);

  // const [latestWinners, setLatestWinners] = useState([
  //   { name: "Player123", amount: 15460, date: "Feb 28" },
  //   { name: "GoldHunter", amount: 8750, date: "Feb 27" },
  //   { name: "JackpotKing", amount: 23000, date: "Feb 27" },
  //   { name: "LuckyCharm", amount: 12300, date: "Feb 26" },
  // ]);

  
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {


    
    
    console.log("TOKEN", token);
    console.log("USER_ID", user_id);
    

    if (socket && !isAuthenticated) {

      if (token && user_id) {
        console.log("📩 Emitting 'request-authentication' event...");
        socket.emit("request-authentication", { token, user_id });

      }

      // if (!token || !user_id) {
      //   navigate("/login");
      //   window.location.reload();
      // }
    }

    if (socket && isAuthenticated) {
      console.log("🎧 Listening for claim event...");
      console.log("📩 Requesting prev winners...");
      socket.emit("pastWinners");

      const handleCoinsClaimed = (data: { coins: number; message: string }) => {
        console.log("✅ Coins successfully claimed:", data);
        setBonusState("claimed");
        setCoins(data.coins);
        setClaimStatus('✅ ${data.message}.');
      };

      const handleClaimCoinsError = (data: { message: string }) => {
        console.error("❌ Coins claim error:", data);
        setClaimStatus('❌ ${data.message}.');
      };

      const handleTimerUpdate = (timeRemaining: number) => {
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        setMinutes(String(minutes).padStart(2, '0'));
        setSeconds(String(seconds).padStart(2, '0'));
      };

      const HandlePrize = (data: { prize: number }) => {
        setPrize(data.prize);
      }

      const handlePrevWinners = (data: { data: any[] }) => {
        console.log("res prev winners", data);
        setPrevWinners(data.data);
      }

      const handlePrizePerWinner =(data: {data: any})=>{
        setPrizePerWinner(data.data.prizeperwinner);
        console.log("data: ", data.data.prizeperwinner);

      };
      
      socket.on("coinsClaimed", handleCoinsClaimed);
      socket.on("claimingError", handleClaimCoinsError);
      socket.on("timer-update", handleTimerUpdate);
      socket.on("prize-update", HandlePrize);
      socket.on("sendPrevWinners", handlePrevWinners);
      socket.on("sendPrevWinners", handlePrizePerWinner);


      return () => {
        console.log("🗑 Cleaning up socket listeners...");
        socket.off("coinsClaimed", handleCoinsClaimed);
        socket.off("claimingError", handleClaimCoinsError);
        socket.off("timer-update", handleTimerUpdate);
        socket.off("sendPrevWinners", handlePrevWinners);
        socket.off("sendPrevWinners", handlePrizePerWinner);
      };
    }
  }, [socket, isAuthenticated]);

  const handleClaimBonus = () => {
    setClaimStatus("Claiming bonus...");

    if (socket && socket.connected) {
      console.log("📩 Claiming coins...");
      console.log("🔍 Checking socket status:", socket.connected);
      console.log("🔗 Socket ID:", socket.id);

      if (!user_id) {
        setClaimStatus("❌ User ID not found. Please log in again.");
        return;
      }

      socket.emit("claimCoins");
      console.log("📨 Emitted 'claimCoins' event!");
    } else {
      console.error("❌ Socket not connected. Unable to claim coins.");
      setClaimStatus("❌ Not connected to server. Please refresh the page.");
    }
  };

  const handlePlayNow = () => {
    console.log("🎮 'Play Now' button clicked");
    navigate("/game");
  };




  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header title="Home" activePage="home" />

      <div className="flex mb-20 flex-1 overflow-hidden relative z-10 md:mx-6 lg:mx-20">
        <div className="flex-1 p-4 overflow-auto">
          {/* TOP PART */}
          <div className="relative mb-8 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 animate-pulse-slow"></div>
            <div className="relative p-6 bg-black bg-opacity-70 backdrop-blur-sm rounded-xl border-2 border-yellow-500 overflow-hidden">
              <div className="flex flex-col items-center justify-center py-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
                  <span className="text-yellow-400">LOTTERY</span>{" "}
                  <span className="text-red-500">JACKPOT</span>
                </h2>
                <div
                  className="text-5xl md:text-6xl font-bold mb-4 text-white"
                  style={{
                    textShadow:
                      "0 0 15px rgba(255, 215, 0, 0.8), 0 0 25px rgba(255, 0, 0, 0.6)",
                  }}
                >
                  ₱ {prize.toLocaleString()}
                </div>
                {/* <button 
                  onClick={handlePlayNow} 
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-10 rounded-full text-xl 
                    border-2 border-yellow-500 shadow-lg transition-all transform hover:scale-105 hover:shadow-red-500/50"
                >
                  PLAY NOW
                </button> */}
              </div>
            </div>
          </div>

          {/* CLAIM BONUS */}
          <div className="relative mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/50 to-red-600/50 blur-md"></div>
            <div className="relative border-2 border-yellow-500 rounded-xl p-6 bg-black bg-opacity-80 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-sm animate-pulse-slow"></div>
                    <img
                      src={treasureIcon}
                      alt="Bonus"
                      className="w-20 h-20 relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      className="text-yellow-500 text-2xl md:text-3xl font-bold"
                      style={{ textShadow: "0 0 10px rgba(234, 179, 8, 0.7)" }}
                    >
                      {bonusState === "unclaimed"
                        ? "WELCOME BONUS"
                        : "BONUS CLAIMED!"}
                    </h2>
                    <p className="text-white text-lg">
                      {bonusState === "unclaimed"
                        ? "New player? Claim your bonus now!"
                        : "Try your luck in our lottery game!"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <span
                      className="text-red-600 text-4xl font-bold font-mono mr-2"
                      style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.7)" }}
                    >
                     ₱20
                    </span>
                    <img
                      src={coinIcon}
                      alt="coins"
                      className="w-8 h-8 animate-bounce-slow"
                    />
                  </div>
                  {bonusState === "unclaimed" ? (
                    <button
                      onClick={handleClaimBonus}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg text-xl 
                        border-2 border-yellow-500 shadow-lg transition-all transform hover:scale-105 hover:shadow-yellow-500/50"
                    >
                      CLAIM NOW
                    </button>
                  ) : (
                    <button
                      onClick={handlePlayNow}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg text-xl 
                        border-2 border-yellow-600 shadow-lg transition-all transform hover:scale-105 hover:shadow-yellow-500/50"
                    >
                      PLAY NOW
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* HHOW TO PLAY */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500 border-b-2 border-yellow-500 pb-2">
              HOW TO PLAY
            </h2>
            <div className="border-2 border-yellow-500 rounded-xl bg-black bg-opacity-80 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center bg-gradient-to-b from-black to-red-900/30 p-4 rounded-lg border border-red-700/50 transform transition-transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-3xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-2">
                    Choose Numbers
                  </h3>
                  <p className="text-white">
                    Select your lucky numbers for the next lottery draw
                  </p>
                </div>
                <div className="flex flex-col items-center text-center bg-gradient-to-b from-black to-red-900/30 p-4 rounded-lg border border-red-700/50 transform transition-transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-3xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-2">
                    Buy Tickets
                  </h3>
                  <p className="text-white">
                    Purchase or claim coins
                  </p>
                </div>
                <div className="flex flex-col items-center text-center bg-gradient-to-b from-black to-red-900/30 p-4 rounded-lg border border-red-700/50 transform transition-transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-3xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-2">
                    Win Big
                  </h3>
                  <p className="text-white">
                    Match numbers and win amazing cash prizes!
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handlePlayNow}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-10 rounded-full text-xl 
                    border-2 border-red-600 shadow-lg transition-all transform hover:scale-105 hover:shadow-yellow-500/50"
                >
                  PLAY LOTTERY NOW
                </button>
              </div>
            </div>
          </div>

          {/* TIMER */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500 border-b-2 border-yellow-500 pb-2">
              NEXT DRAW
            </h2>
            <div className="border-2 border-yellow-500 rounded-xl bg-black bg-opacity-80 p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl md:text-2xl text-white mb-4">
                  Next lottery draw in:
                </div>
                <div className="flex space-x-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-red-600 to-red-800 rounded-lg flex items-center justify-center text-2xl font-bold text-white border-2 border-yellow-500">
                      00
                    </div>
                    <div className="text-yellow-500 mt-2">Hours</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-red-600 to-red-800 rounded-lg flex items-center justify-center text-2xl font-bold text-white border-2 border-yellow-500">
                      {minutes}
                    </div>
                    <div className="text-yellow-500 mt-2">Minutes</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-red-600 to-red-800 rounded-lg flex items-center justify-center text-2xl font-bold text-white border-2 border-yellow-500">
                      {seconds}
                    </div>
                    <div className="text-yellow-500 mt-2">Seconds</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-lg text-xl 
                    border-2 border-yellow-500 shadow-lg transition-all transform hover:scale-105 hover:shadow-red-500/50"
                >
                  BUY TICKETS NOW
                </button>
              </div>
            </div>
          </div>

          {/* LATEST WINNERS*/}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500 border-b-2 border-yellow-500 pb-2">
              LATEST WINNERS
            </h2>
            <div className="border-2 border-yellow-500 rounded-xl bg-black bg-opacity-80 p-4">
              {prevWinners.length === 0 ? (
                <div className="text-white text-center">
                  No previous winners yet. Be the first to win!
                </div>
              ) : (
              
              <div className="grid grid-cols-1 divide-y divide-yellow-500/30">
                {prevWinners.map((winner, index) => (
                  <div
                    key={index}
                    className="py-3 flex justify-between items-center hover:bg-yellow-900/20 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold mr-3 shadow-md">
                        {winner.user_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {winner.user_name}
                        </div>
                        <div className="text-yellow-500 text-sm">
                          Winning Numbers: {winner.winning_numbers}
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-red-600 font-bold font-mono text-lg"
                      style={{ textShadow: "0 0 5px rgba(220, 38, 38, 0.5)" }}
                    >
                      ₱{winner.prize_amount.toLocaleString() || 0}
                    </div>
                    
                
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

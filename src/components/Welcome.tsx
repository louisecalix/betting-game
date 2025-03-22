import { useState } from "react";
import { PiSpeakerHighFill } from "react-icons/pi";
import { FaCoins, FaUserCircle } from "react-icons/fa";
import LotteryTicker from "./LotteryTicker";
import { useNavigate } from "react-router-dom";
import coindrop from "../assets/images/coindrop.png";
import l from "../assets/images/2.png";

import WinningPrize from "./games/WinningPrize";

const Welcome = () => {
  const navigate = useNavigate();
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col bg-gradient-to-b from-black to-red-900/30">
      <header className="py-4 px-6 flex justify-between items-center border-b border-yellow-500/30">
        <div className="flex items-center">
          <img src={l} alt="logo" className="w-12 h-12 mr-2"></img>
          <h1 className="text-2xl font-bold text-yellow-400">LottoMoto</h1>
        </div>
        <div className="flex items-center gap-4">
          <a className="text-yellow-400 hover:text-yellow-300 transition-colors px-4 py-2 flex items-center cursor-pointer"
            onClick={() => navigate("/login")}>
            <FaUserCircle className="mr-2" />
            Login
          </a>
          <a className="bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 cursor-pointer hover:to-yellow-300 text-black font-bold px-4 py-2 rounded-md shadow-lg transition-all"
            onClick={() => navigate("/register")}>
            Register
          </a>
        </div>
      </header>

        {/* MAIN */}
      <main className="relative flex-1 flex flex-col px-6 py-6 md:px-[10%] before:absolute before:inset-0 before:bg-black/65 before:z-0"
            style={{
              backgroundImage: `url(${coindrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
>
  <div className="relative z-10 flex flex-col items-center space-y-12">

      < WinningPrize prize={1000000} />
    {/* <div className="text-center">
      <h2 className="text-xl text-yellow-400 drop-shadow-md">CURRENT JACKPOT</h2>
      <div className="mt-2 bg-black/70 border-2 border-yellow-500 rounded-lg p-4 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
        <div className="text-4xl md:text-6xl font-bold tracking-widest bg-gradient-to-b from-yellow-300 to-yellow-600 text-transparent bg-clip-text">
          $1,000,000
        </div>
      </div>
    </div> */}

    <div className="relative w-full max-w-3xl bg-black/70 border-2 border-yellow-500 rounded-2xl p-8 shadow-[0_0_20px_rgba(255,215,0,0.4)] overflow-hidden flex flex-col items-center">
      
      <div className="text-center">
        <div className="relative inline-block">
          <div className="text-7xl md:text-8xl font-bold text-yellow-400 drop-shadow-lg relative z-10">
            LOTTO
          </div>
          <div className="text-3xl md:text-4xl font-bold text-yellow-300 drop-shadow-lg relative z-10">
            MOTO
          </div>
          <div className="absolute w-full h-full left-0 top-0 rounded-full bg-red-600/20 filter blur-xl z-0"></div>
        </div>
      </div>

      {/* START BUTTON */}
      <div className="mt-8">
        <button 
          className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-xl font-bold text-white rounded-lg 
                    border-2 border-yellow-500
                    shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,0,0,0.7)] 
                    transform hover:scale-105 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/login")}
        >
          START
        </button>
      </div>
    </div>

    {/* TEXT TICKER  */}
    <div className="w-full max-w-3xl bg-black/70 border border-yellow-500/50 rounded-lg p-3 flex items-center shadow-md">
      <button 
        className={`text-2xl ${audioEnabled ? 'text-yellow-400' : 'text-yellow-400/30'}`}
        onClick={() => setAudioEnabled(!audioEnabled)}
      >
        <PiSpeakerHighFill />
      </button>
      <div className="flex-1 overflow-hidden">
        <LotteryTicker />
      </div>
    </div>

  </div>
</main>

      
    </div>
  );
};

export default Welcome;
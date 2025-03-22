import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/SocketContext";
import lm from "../../assets/images/2.png";
import coin from "../../assets/images/coin.png";

interface HeaderProps {
  title: string;
  // balance: number;
  activePage: "home" | "game" | "history" | "profile" | "shop";
  onBalanceUpdate?: (balance: number) => void;
}

const Header = ({
  title,
  // balance,
  activePage,
  onBalanceUpdate,
}: HeaderProps) => {
  const { socket, isAuthenticated } = useSocket() || {};
  const [balance, setBalance] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && isAuthenticated) {
      console.log("📩 Requesting user coins...");
      socket.emit("userCoins");

      socket.on("sendUserCoins", (data) => {
        // console.log("✅ Coins received:", data.coins);
        setBalance(data.coins);

        if (onBalanceUpdate) {
          onBalanceUpdate(data.coins);
        }
      });

      socket.on("getCoinsError", (data) => {
        console.error("❌ Error getting coins:", data.message);
      });

      return () => {
        socket.off("sendUserCoins");
        socket.off("getCoinsError");
      };
    }
  }, [socket, isAuthenticated, onBalanceUpdate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (
    page: "home" | "game" | "history" | "profile" | "shop"
  ) => {
    navigate(`/${page}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    if (socket) {
      socket.disconnect();  
    }
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-black border-b border-yellow-500/50 relative">
      {/* LOGO */}
      <div className="hidden md:flex items-center">
        <img src={lm} alt="logo" className="w-12 h-12 mr-2"></img>
        <span className="ml-1 text-2xl font-bold text-yellow-500">
          LottoMoto
        </span>
      </div>

      {/* MOBILE VIEW MENU */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-yellow-500 focus:outline-none hover:text-yellow-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* TITLE */}
      <div className="flex-grow flex justify-center">
        <div className="px-6 py-1 text-yellow-500 text-xl font-bold">
          {title}
        </div>
      </div>

      {/* BALNCE&DEPO */}
      <div className="flex items-center">
        <div className="flex items-center mr-3 bg-black rounded-full px-3 py-1 md:py-2 border border-yellow-500/50">
          <img src={coin} alt="coin" className="w-6 h-6"></img>
          <span className="ml-2 text-yellow-400 font-semibold">
          ₱ {balance.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => handleNavigation("shop")}
          className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md text-white font-semibold 
             transition-all duration-300 ease-in-out 
             shadow-lg hover:shadow-yellow-500/30
             transform hover:scale-105 cursor-pointer"
        >
          Deposit
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={toggleMenu}
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-black z-50 shadow-lg overflow-auto border-r border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={lm} alt="logo" className="w-12 h-12 mr-2"></img>
                    <span className="ml-1 text-xl font-bold text-yellow-500">
                      LottoMoto
                    </span>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow">
                <nav className="space-y-4">
                  <div
                    className="py-3 flex items-center cursor-pointer hover:bg-yellow-900/30 px-2 rounded-md transition-colors"
                    onClick={() => handleNavigation("profile")}
                  >
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full border border-yellow-500 flex items-center justify-center text-yellow-500">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                    <span className="ml-3 text-yellow-400">Profile</span>
                  </div>

                  {/* NAV BUTTONS */}
                  <div className="py-2 text-white border-t border-yellow-500/30 flex flex-col gap-3 mt-4">
                    <button
                      onClick={() => handleNavigation("home")}
                      className={`py-3 text-center font-bold border border-yellow-500/50 rounded-md ${
                        activePage === "home"
                          ? "bg-yellow-900/30 text-yellow-400 shadow-yellow-500/20 shadow-md"
                          : "text-yellow-400 hover:bg-yellow-900/20 transition-colors"
                      }`}
                    >
                      HOME
                    </button>

                    <button
                      onClick={() => handleNavigation("game")}
                      className={`py-3 text-center font-bold border border-yellow-500/50 rounded-md ${
                        activePage === "game"
                          ? "bg-yellow-900/30 text-yellow-500 shadow-yellow-500/20 shadow-md"
                          : "text-yellow-400 hover:bg-yellow-900/20 transition-colors"
                      }`}
                    >
                      GAME
                    </button>

                    <button
                      onClick={() => handleNavigation("history")}
                      className={`py-3 text-center font-bold border border-yellow-500/50 rounded-md ${
                        activePage === "history"
                          ? "bg-yellow-900/30 text-yellow-500 shadow-yellow-500/20 shadow-md"
                          : "text-yellow-400 hover:bg-yellow-900/20 transition-colors"
                      }`}
                    >
                      HISTORY
                    </button>
                  </div>
                </nav>
              </div>

              {/* LOGOUT */}
              <div className="p-4 border-t border-yellow-500/30">
                <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-semibold transition-colors"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP NAV */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 justify-center py-4 bg-black border-t border-yellow-500/30 z-20">
        <div className="flex gap-6">
          <button
            onClick={() => handleNavigation("home")}
            className={`px-6 py-3 text-center font-bold rounded-md transition-all ${
              activePage === "home"
                ? "bg-yellow-900/40 text-yellow-400 shadow-yellow-500/30 shadow-md"
                : "text-yellow-400 hover:bg-yellow-900/20"
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => handleNavigation("game")}
            className={`px-6 py-3 text-center font-bold rounded-md transition-all ${
              activePage === "game"
                ? "bg-yellow-900/40 text-yellow-500 shadow-yellow-500/30 shadow-md"
                : "text-yellow-400 hover:bg-yellow-900/20"
            }`}
          >
            GAME
          </button>

          <button
            onClick={() => handleNavigation("history")}
            className={`px-6 py-3 text-center font-bold rounded-md transition-all ${
              activePage === "history"
                ? "bg-yellow-900/40 text-yellow-500 shadow-yellow-500/30 shadow-md"
                : "text-yellow-400 hover:bg-yellow-900/20"
            }`}
          >
            HISTORY
          </button>

          <button
            onClick={() => handleNavigation("profile")}
            className={`px-6 py-3 text-center font-bold rounded-md transition-all ${
              activePage === "profile"
                ? "bg-yellow-900/40 text-yellow-500 shadow-yellow-500/30 shadow-md"
                : "text-yellow-400 hover:bg-yellow-900/20"
            }`}
          >
            PROFILE
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

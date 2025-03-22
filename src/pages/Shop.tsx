import Header from "../components/headers/Header";
import DepositItem from "../components/DepositCard";
import { useSocket } from "../services/SocketContext";
import { useState, useEffect } from "react";

const Shop = () => {
  const { socket } = useSocket() || {};
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    return () => {
      if (socket) {
        socket.off("coinsBought");
        socket.off("buyingError");
      }
    };
  }, [socket]);

  const handleDeposit = (amount: number) => {
    if (!socket || !socket.connected) {
      setStatusMessage(
        "❌ Not connected to the server. Please try again later."
      );
      return;
    }

    // remove previous listener
    socket.off("coinsBought");
    socket.off("buyingError");

    console.log(`Depositing ${amount} coins`);
    setStatusMessage(`⏳ Processing your purchase of ${amount} coins...`);

    // create new listeners
    socket.on("coinsBought", (data: { message: string; coins: number }) => {
      console.log("✅ Coins purchased successfully:", data);
      setStatusMessage(`✅ ${data.message}. You now have ${data.coins} coins.`);
    });

    socket.on("buyingError", (data: { message: string }) => {
      console.error("❌ Error purchasing coins:", data);
      setStatusMessage(`❌ ${data.message}`);
    });

    // send request 
    socket.emit("buyCoins", { amount });
  };

  const depositOptions = [
    { amount: 50, price: 50.0 },
    { amount: 100, price: 95.0 },
    { amount: 200, price: 180.0 },
    { amount: 500, price: 425.0 },
    { amount: 1000, price: 800.0 },
    { amount: 2000, price: 1500.0 },
    { amount: 5000, price: 3000.0 },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header title="Shop" activePage="shop" />

      <div className="flex flex-1 overflow-hidden bg-gray-900">
        <div className="mb-20 flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4">Buy Game Coins</h1> */}

            {/* {statusMessage && (
              <div className="mb-6 text-center text-white bg-gray-800/80 py-3 px-4 rounded-lg mx-4 backdrop-blur-sm border border-gray-700 shadow-lg">
                {statusMessage}
              </div>
            )} */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4">
              {depositOptions.map((option) => (
                <div key={option.amount} className="flex justify-center">
                  <DepositItem
                    amount={option.amount}
                    price={option.price}
                    onClick={() => handleDeposit(option.amount)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
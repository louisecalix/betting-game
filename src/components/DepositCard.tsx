import React from 'react';
import treasureIcon from "../assets/images/treasure.png";
import coinIcon from "../assets/images/coin.png";

interface DepositItemProps {
  amount: number;
  price: number;
  currency?: string;
  onClick?: () => void;
}

const DepositItem: React.FC<DepositItemProps> = ({
  amount,
  price,
  currency = '₱',
  onClick
}) => {
  return (
    <div className="relative w-80">
      <div className="absolute inset-x-0 bottom-0 h-5 bg-yellow-500 translate-y-3 blur-md rounded-b-xl opacity-70"></div>
      
      {/* Main container */}
      <div className="border bg-black border-2 border-yellow-500 rounded-xl overflow-hidden shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col items-center p-6 relative z-10">
          {/* TREASURE ICON */}
          <div className="mb-4 w-24 h-24 relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md"></div>
            <img src={treasureIcon} alt="treasure-icon" className="relative z-10 w-full h-full"></img>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <span className="text-red-600 text-4xl font-bold mr-3 font-mono" 
              style={{textShadow: "0 0 10px rgba(220, 38, 38, 0.7)"}}>
              {amount}
            </span>
            <img src={coinIcon} alt="coin icon" className="w-8 h-8"></img>
          </div>
          
          {/* PRICE BUTTON */}
          <button 
            onClick={onClick}
            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg 
              hover:from-yellow-500 hover:to-yellow-400 transition-all border border-yellow-700 shadow-lg"
          >
            <span className="flex items-center justify-center">
              <span className="text-xl">{currency} {price.toFixed(2)}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositItem;
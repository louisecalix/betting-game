import { useState } from 'react';

interface NumberSelectorProps {
  onSelectNumber: (number: number | null) => void;
  selectedNumber?: number;
}

const NumberSelector = ({ onSelectNumber, selectedNumber }: NumberSelectorProps) => {
  const [selected, setSelected] = useState<number | null>(selectedNumber || null);
  
  const handleNumberClick = (number: number) => {
    if (selected === number) {
      setSelected(null);
      onSelectNumber(null);
    } else {
      setSelected(number);
      onSelectNumber(number);
    }
  };
  
  const numbers = Array.from({ length: 10 }, (_, i) => i); // CREATE NUMBER ARRAY FROM 0 TO 9
  
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="absolute inset-x-0 bottom-0 h-2 md:h-4 bg-yellow-500 rounded-b-2xl translate-y-1 md:translate-y-2 blur-md opacity-70"></div>
      
      {/* MAIN CONTAINER */}
      <div className="bg-black border-2 border-yellow-500 rounded-2xl py-2 md:py-4 px-4 md:px-6 shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-2xl"></div>
        
        {/* BUTTONS CONTAINER */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between gap-2 md:gap-3">
          {numbers.map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className={`
                w-12 h-12
                sm:w-12 sm:h-12 
                md:w-12 md:h-12 
                lg:w-15 lg:h-15
                rounded-full flex items-center justify-center 
                text-xl sm:text-2xl md:text-2xl lg:text-3xl 
                font-bold transition-all duration-200 
                border-2 relative overflow-hidden m-1
                ${selected === number 
                  ? 'border-yellow-500 bg-black text-red-600 scale-110 shadow-lg' 
                  : 'border-yellow-600 bg-black/80 text-yellow-500 hover:bg-black hover:text-red-500 hover:border-yellow-400'}
              `}
            >
              {selected === number && (
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full"></div>
              )}
              
              <span className={`relative z-10 ${selected === number ? 'font-mono' : ''}`}>
                {number}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberSelector;
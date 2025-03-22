import { useState, useEffect } from 'react';

interface WinningNumbersProps {
  numbers: number[] | null;
  maxNumbers?: number;
  isLoading?: boolean;
  onSpinComplete?: () => void;
}

const WinningNumbers = ({ 
  numbers, 
  maxNumbers = 3, 
  isLoading = false,
  onSpinComplete
}: WinningNumbersProps) => {
  const [spinning, setSpinning] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState<(number | null)[]>(
    Array(maxNumbers).fill(null)
  );
  const [animationCompleted, setAnimationCompleted] = useState<boolean[]>(
    Array(maxNumbers).fill(false)
  );
  

  useEffect(() => {
    if (numbers && !isLoading) {
      startSpinAnimation();
    }
  }, [numbers, isLoading]);
  
  const startSpinAnimation = () => {
    setSpinning(true);
    setAnimationCompleted(Array(maxNumbers).fill(false));
    
    
    const finalNumbers = numbers || Array(maxNumbers).fill(null); // 
    
    finalNumbers.forEach((number, index) => {
      const spinDuration = 1000 + (index * 500);
      
      setTimeout(() => {
        setDisplayNumbers(prev => {
          const newDisplay = [...prev];
          newDisplay[index] = number;
          return newDisplay;
        });
        
        setAnimationCompleted(prev => {
          const newState = [...prev];
          newState[index] = true;
          
          if (newState.every(val => val === true)) {
            setSpinning(false);
            if (onSpinComplete) onSpinComplete();
          }
          
          return newState;
        });
      }, spinDuration);
    });
  };
  
  const getRandomNumber = () => Math.floor(Math.random() * 10);
  
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="relative">
        {/* TITLE*/}
        <div className="absolute -top-12 left-0 right-0 flex justify-center">
          <div className="font-bold text-yellow-400 text-2xl" style={{
            textShadow: '0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,0,0,0.4)'
          }}>
          </div>
        </div>
        
        {/* FRAME */}
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-400 p-3 rounded-xl shadow-lg relative">
          <div className="absolute -top-1 left-0 right-0 flex justify-between px-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-yellow-300 shadow-md shadow-yellow-300"></div>
            ))}
          </div>
          <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-yellow-300 shadow-md shadow-yellow-300"></div>
            ))}
          </div>
          
          <div className="flex bg-gray-100 p-2 rounded-lg shadow-inner">
            {Array.from({ length: maxNumbers }).map((_, index) => (
              <div 
                key={index}
                className="relative w-20 h-24 mx-1 overflow-hidden bg-white rounded-sm flex items-center justify-center border-b-2 border-gray-200"
              >
                {/* NUMBER DISPLAY*/}
                <div 
                  className={`text-5xl font-bold ${spinning && !animationCompleted[index] ? 'animate-spin-slow' : ''}`}
                  style={{
                    color: 'red',
                    textShadow: '0px 0px 1px black',
                    transition: 'transform 0.5s ease-out'
                  }}
                >
                  {spinning && !animationCompleted[index] 
                    ? getRandomNumber() 
                    : displayNumbers[index] !== null 
                      ? displayNumbers[index] 
                      : '?'}
                </div>
                
                <div className="absolute inset-0 border-4 rounded-sm border-red-600 pointer-events-none" style={{
                  background: 'radial-gradient(circle at center, transparent 80%, rgba(255,0,0,0.2) 100%)'
                }}></div>
                
                {/* {index === 1 && (
                  <div className="absolute h-3 w-3 rounded-full bg-red-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )} */}
              </div>
            ))}
          </div>
        </div>
        
        {/* Side decorations */}
        <div className="absolute left-0 top-1/2 transform -translate-x-4 -translate-y-1/2 w-4 h-16 rounded-l-full bg-gradient-to-b from-yellow-500 to-yellow-700"></div>
        <div className="absolute right-0 top-1/2 transform translate-x-4 -translate-y-1/2 w-4 h-16 rounded-r-full bg-gradient-to-b from-yellow-500 to-yellow-700"></div>
      </div>
      
      {/* BG EFFECT */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-red-800 to-blue-900 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-red-500 opacity-20"
            style={{
              width: '2px',
              height: '100%',
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              filter: 'blur(1px)'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WinningNumbers;
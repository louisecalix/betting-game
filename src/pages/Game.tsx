import { useState, useEffect, useCallback, useRef } from "react";
import CountdownTimer from "../components/games/CountDown";
import WinningNumbersDisplay from "../components/games/WinningNumber";
import WinningPrize from "../components/games/WinningPrize";
import Header from "../components/headers/Header";
import NumberSelector from "../components/games/NumberSelector";
import SubmitNumbers from "../components/games/SubmitNumbers";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../services/SocketContext";

const Game = () => {
  const { socket, isAuthenticated } = useSocket() || {};
  const navigate = useNavigate();

  // STATE FOR SELECTED NUMBERS
  const [firstNumber, setFirstNumber] = useState<number | undefined>();
  const [secondNumber, setSecondNumber] = useState<number | undefined>();
  const [thirdNumber, setThirdNumber] = useState<number | undefined>();
  
  // WINNING NUMBERS
  const [winningNumbers, setWinningNumbers] = useState<number[] | null>(null);
  const [isLoadingWinningNum, setIsLoadingWinningNum] = useState(true);

  const [roundID, setRoundID] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [balance, setBalance] = useState<number>(0);

  const handleBalanceUpdate = useCallback((newBalance: number) => {
    setBalance(newBalance);
  }, []);




  useEffect(() => {
    if (!socket) return;
    socket.emit("setTimer");

    const handleWinningNumbers = (numbers: any) => {
        try {
            if (typeof numbers === "string") numbers = JSON.parse(numbers);
            console.log("Winning Numbers:", numbers);
            setWinningNumbers(numbers);
        } catch (error) {
            console.error("Error parsing winning numbers:", error);
        }
        setIsLoadingWinningNum(false);
    };

    const handleRoundID = (roundId: string) => {
        console.log("ROUND ID:", roundId);
        setRoundID(roundId);
        
    };

    socket.off("winning-numbers", handleWinningNumbers);
    socket.off("roundNumber", handleRoundID);

    socket.on("winning-numbers", handleWinningNumbers);
    socket.on("roundNumber", handleRoundID);
  

    return () => {
        socket.off("winning-numbers", handleWinningNumbers);
        socket.off("roundNumber", handleRoundID);
    };
}, [socket]);






  const handleCountdownEnd = () => {
    console.log("Countdown ended!");
  }


  const isSubmittingRef = useRef(false);

  const handleSubmit = useCallback(() => {
    console.log("Submit button clicked...");
    if (isSubmittingRef.current) return; 
    if (balance < 20) return alert("Insufficient balance to play. Please deposit more coins.");

    // setIsSubmitting(true);
    isSubmittingRef.current = true;

    const payload = {
        num_one: firstNumber,
        num_two: secondNumber,
        num_three: thirdNumber,
        round_id: roundID,
    };

    console.log("Submitting payload:", payload);

    if (socket) {
        socket.emit("getNumbers", payload, (response: any) => {
            console.log("Server response:", response);
            if (response.success) {
                console.log("Bet placed successfully.");
            } else {
                console.error("Bet submission failed:", response.error);
            }
        });
    }

    setFirstNumber(undefined);
    setSecondNumber(undefined);
    setThirdNumber(undefined);

    setTimeout(() => {isSubmittingRef.current = false}, 2000);
  }, [firstNumber, secondNumber, thirdNumber, roundID, socket, balance]);

  const handleCancel = () => {
    // RESET SELECTED NUMBERS
    setFirstNumber(undefined);
    setSecondNumber(undefined);
    setThirdNumber(undefined);
  };

  const selectedNumbers = [firstNumber, secondNumber, thirdNumber].filter(
    (num): num is number => num !== undefined
  );

  return (
    <div className="flex flex-col h-screen">
      <Header 
        title="Game" 
        activePage="game"
        onBalanceUpdate={handleBalanceUpdate}
      />
      
      <div className="flex flex-1 overflow-hidden bg-gray-900">
        <div className="flex-1 p-4 overflow-auto pb-25">
          <WinningPrize />
          

          <CountdownTimer onCountDownEnd={handleCountdownEnd} roundID={roundID} />
          
          <div className="flex justify-center mb-6">
            <div className="w-64 md:w-80">
              <WinningNumbersDisplay numbers={winningNumbers} isLoading={isLoadingWinningNum} />
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 md:space-y-6 mt-12 md:mx-10">
            <div className="flex items-center gap-2 md:gap-4 mb-10">
              <div className="flex-1">
                <NumberSelector onSelectNumber={(number) => setFirstNumber(number ?? undefined)} selectedNumber={firstNumber} />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 mb-10">
              <div className="flex-1">
                <NumberSelector onSelectNumber={(number) => setSecondNumber(number ?? undefined)} selectedNumber={secondNumber} />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 mb-10">
              <div className="flex-1">
                <NumberSelector onSelectNumber={(number) => setThirdNumber(number ?? undefined)} selectedNumber={thirdNumber} />
              </div>
            </div>
          </div>

          <SubmitNumbers 
            selectedNumbers={selectedNumbers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            amount={20.00}
            currency="PHP"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
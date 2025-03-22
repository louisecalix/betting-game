import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id"),
  },
});

export default function BettingSystem() {
  const [coins, setCoins] = useState("Loading...");
  const [round, setRound] = useState("Loading...");
  const [timer, setTimer] = useState("00:00");
  const [winningNumbers, setWinningNumbers] = useState("Waiting...");
  const [prize, setPrize] = useState("Loading...");
  const [selectedNumbers, setSelectedNumbers] = useState({ num_one: null, num_two: null, num_three: null });
  const [betStatus, setBetStatus] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("sendUserCoins", (data) => setCoins(data.coins));
    socket.on("roundNumber", (round) => setRound(round));
    socket.on("timer-update", (timeRemaining) => {
      const minutes = Math.floor(timeRemaining / 60000);
      const seconds = Math.floor((timeRemaining % 60000) / 1000);
      setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    });
    socket.on("winning-numbers", (numbers) => setWinningNumbers(numbers.join(", ")));
    socket.on("prize-update", (data) => setPrize(`${data.prize} coins`));
    socket.on("bettingSuccessful", (data) => setBetStatus(`✅ ${data.message}`));
    socket.on("bettingError", (data) => setBetStatus(`❌ ${data.message}`));
    socket.on("sendBetHistory", (data) => setHistory(data.data || []));
  }, []);

  const placeBet = () => {
    if (!selectedNumbers.num_one || !selectedNumbers.num_two || !selectedNumbers.num_three) {
      setBetStatus("❌ Please select all three numbers!");
      return;
    }
    socket.emit("getNumbers", { ...selectedNumbers, round_id: round });
  };

  const claimCoins = () => {
    socket.emit("claimCoins");
  };

  const selectNumber = (numKey, number) => {
    setSelectedNumbers((prev) => ({ ...prev, [numKey]: number }));
  };

  return (
    <div>
      <h1>Betting System</h1>
      <h2>Your Coins</h2>
      <p>Coins: {coins}</p>

      <h2>Round Number</h2>
      <p>Round: {round}</p>

      <h2>Timer</h2>
      <p>{timer}</p>

      <h2>Winning Numbers</h2>
      <p>{winningNumbers}</p>

      <h2>Prize</h2>
      <p>Prize: {prize}</p>

      <div>
        <h2>Pick Your Numbers</h2>
        {["num_one", "num_two", "num_three"].map((numKey, index) => (
          <div key={numKey}>
            <p>Num {index + 1}: <span>{selectedNumbers[numKey] ?? "_"}</span></p>
            <div>
              {[...Array(10).keys()].map((num) => (
                <button
                  key={num}
                  onClick={() => selectNumber(numKey, num)}
                  style={{ margin: "5px", padding: "10px", fontSize: "18px" }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={placeBet}>Place Bet</button>
        <p>{betStatus}</p>
      </div>

      <button onClick={claimCoins}>Claim Coins</button>

      <h2>Bet History</h2>
      <ul>
        {history.length > 0 ? (
          history.map((bet, index) => (
            <li key={index}>Round {bet.round_id}: Numbers - {bet.numbers.join(", ")}, Prize: {bet.prize_amount} coins</li>
          ))
        ) : (
          <li>No bet history found.</li>
        )}
      </ul>
    </div>
  );
}


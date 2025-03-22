import { useState, useEffect } from "react";
import Header from "../components/headers/Header";
import { useSocket } from "../services/SocketContext";

const History = () => {
  const { socket } = useSocket() || {};
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  useEffect(() => {
    if (socket && socket.connected) {
      const handleBetHistory = (data: { data: any[] }) => {
        console.log("📩 Received Bet History:", data);

        const formattedHistory = (data.data || []).map((item, index) => ({
          id: index + 1,
          round: item.round_id ? `Round #${item.round_id}` : "No Round ID",
          betNumbers:
            typeof item.numbers === "string"
              ? item.numbers.replace(/\[|\]/g, "").split(",").map(Number)
              : [],
          amount: item.bet_amount || 0,
          status: item.status || "Unknown",
        }));

        console.log("✅ Formatted History:", formattedHistory);
        setHistoryItems(formattedHistory);
      };

      console.log("Requesting Bet History...");
      socket.emit("userBetHistory");

      socket.on("sendBetHistory", handleBetHistory);

      return () => {
        socket.off("sendBetHistory", handleBetHistory);
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header title="History" activePage="history" />

      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
            LOTTERY HISTORY
          </h2>

          {historyItems.length === 0 ? (
            <div className="text-center text-gray-500">
              No bet history available.
            </div>
          ) : (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HistoryItem = ({ item }: { item: any }) => {
  const { round, betNumbers, amount, status } = item;

  return (
    <div className="relative border-2 rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 border-2 border-yellow-500 rounded-lg opacity-70 shadow-lg shadow-yellow-500/50"></div>

      <div className="bg-black p-4 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="text-yellow-500 font-bold">{round}</h3>
            <p className="text-gray-400 text-sm">Bet Amount: ₱{amount}</p>
          </div>

          <div className="flex items-center mt-1">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="mt-4 border-t border-gray-800 pt-3">
          <div>
            <p className="text-gray-400 text-sm mb-1">Your Numbers:</p>
            <div className="flex space-x-2">
              {betNumbers.map((num: number, index: number) => (
                <NumberBall key={index} number={num} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NumberBall = ({ number }: { number: number }) => (
  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white border-2 border-gray-600 font-bold">
    {number}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <div
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      status === "Won"
        ? "bg-green-900 text-green-400"
        : "bg-red-900 text-red-400"
    }`}
  >
    {status.toUpperCase()}
  </div>
);

export default History;

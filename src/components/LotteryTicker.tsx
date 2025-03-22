import "../css/LotteryTicker.css";

const lotteryInfo = [
  "🎉 Free Coins for New Users! ",
  "🔥 Sign Up Today for Exclusive Bonuses! ",
  "🎡 New User? Sign up now and big win ",
  "🏆 Play Now & Climb the Leaderboards! ",
  "🎯 Exclusive Offers Available! ",
  "🚀 Fast Payouts & Secure Transactions! ",
  "🎲 Place a bet & Test Your Luck! ",
  "💸 Cash Prizes Await You! ",
];

const LotteryTicker = () => {
  return (
    <div className="ticker-wrapper">
      <div className="ticker-content">
        <div className="ticker-text">
          {lotteryInfo.map((message, index) => (
            <span key={index}>{message}</span>
          ))}
        </div>
        <div className="ticker-text">
          {lotteryInfo.map((message, index) => (
            <span key={index + lotteryInfo.length}>{message}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LotteryTicker;

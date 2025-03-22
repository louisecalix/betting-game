interface SubmitNumbersProps {
  selectedNumbers: (number | null | undefined)[];
  onSubmit: () => void;
  onCancel: () => void;
  amount?: number;
  currency?: string;
  isSubmitting?: boolean;
}

const SubmitNumbers = ({
  selectedNumbers, onSubmit, onCancel, amount = 20.00, currency = 'PHP'
}: SubmitNumbersProps) => {
  const allNumbersSelected = selectedNumbers.length === 3 && 
    selectedNumbers.every(num => num !== undefined && num !== null);

  if (!allNumbersSelected) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20" />
      
      <div className="fixed bottom-0 left-0 right-0 bg-black border-2 border-yellow-500 rounded-t-3xl p-6 z-50 shadow-lg mx-[10%]">
        <div className="flex flex-col">
          <div className="text-center mb-4">
            <h3 className="text-yellow-500 text-xl font-bold">CONFIRM YOUR BET</h3>
            <div className="flex justify-center gap-4 my-3">
              {selectedNumbers.map((num, index) => (
                <div key={index} className="w-12 h-12 bg-black rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-md">
                  <span className="text-red-600 text-xl font-bold">{num}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-black/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">Bet Amount:</span>
              <span className="text-white font-bold">{currency} {amount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={onCancel}
              className="bg-black/80 border-2 border-red-600 rounded-lg py-3 px-6 text-red-600 font-bold hover:bg-red-600/20 transition-all"
            >
              CANCEL
            </button>
            
            <button 
              onClick={onSubmit}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg py-3 px-6 text-black font-bold shadow-lg hover:from-yellow-500 hover:to-yellow-400 transition-all"
            >
              PLACE BET
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitNumbers;
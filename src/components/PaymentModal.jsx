import { IoMdClose } from "react-icons/io";
import { useState, useMemo } from "react";

export default function PaymentModal({ total, closePaymentModal, setPaymentDetails, openReceiptModal }) {
  const totalAmount = parseFloat(total) || 0;

  const [payment, setPayment] = useState({ credit: "", debit: "", cash: "" });
  const [showCreditInputs, setShowCreditInputs] = useState(false);
  const [showDebitInputs, setShowDebitInputs] = useState(false);
  const [creditInputs, setCreditInputs] = useState({});
  const [debitInputs, setDebitInputs] = useState({});
  const [validationError, setValidationError] = useState("");

  const parseValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const twoPercentIncrease = (amount)=> {
    return (amount*0.02) +amount;
  }

  // Calculate the total amount paid and the remaining balance
  const { totalPaid, remaining } = useMemo(() => {
    const creditPaid = parseValue(payment.credit);
    const debitPaid = parseValue(payment.debit);
    const cashPaid = parseValue(payment.cash);

    const paid = creditPaid + debitPaid + cashPaid;
    const remainingBalance = totalAmount - paid;
    const paidWithInterest = twoPercentIncrease(creditPaid) + twoPercentIncrease(debitPaid) +cashPaid

    return {
      totalPaid: paidWithInterest,
      remaining: remainingBalance > 0 ? remainingBalance : 0, 
    };
  }, [payment, totalAmount]);

  // Handler for credit amount input
  const handleCreditChange = (e) => {
    const value = e.target.value;
    setPayment({ ...payment, credit: value });
    setShowCreditInputs(value.trim().length > 0 && parseValue(value) > 0);
    setValidationError(""); // Clear error on input change
  };

  // Handler for debit amount input
  const handleDebitChange = (e) => {
    const value = e.target.value;
    setPayment({ ...payment, debit: value });
    // Update visibility immediately based on a non-empty string or a value > 0
    setShowDebitInputs(value.trim().length > 0 && parseValue(value) > 0);
    setValidationError(""); // Clear error on input change
  };

  // Handler for cash amount input
  const handleCashChange = (e) => {
    setPayment({ ...payment, cash: e.target.value });
    setValidationError(""); // Clear error on input change
  };

  // Core Validation Logic
  const validatePayment = () => {
    // 1. Check if the total amount paid covers the total
    if (totalPaid < totalAmount) {
      return "Payment is incomplete. Remaining: $" + remaining.toFixed(2);
    }

    if (parseValue(payment.credit) > 0) {
      if (!creditInputs.cardNumber || !creditInputs.expiry || !creditInputs.securityCode) {
        return "Please complete the Credit Card details.";
      }

      if(!/^(?:\d[ -]*?){13,16}$/.test(creditInputs.cardNumber)){
        return "Invalid Credit Card Number.";
      }

      if(!/^(0[1-9]|1[0-2])-(19|20)\d{2}$/.test(creditInputs.expiry)){
        return "Invalid Expiry Date."
      }

      if(!/^\d{3,4}$/.test(creditInputs.securityCode)){
        return "Invalid Security Code.";
      }

    }

    if (parseValue(payment.debit) > 0) {
      if (!debitInputs.cardNumber || !debitInputs.expiry || !debitInputs.securityCode) {
        return "Please complete the Debit Card details.";
      }
      if(!/^(?:\d[ -]*?){13,16}$/.test(debitInputs.cardNumber)){
        return "Invalid Credit Card Number.";
      }

      if(!/^(0[1-9]|1[0-2])-(19|20)\d{2}$/.test(debitInputs.expiry)){
        return "Invalid Expiry Date."
      }

      if(!/^\d{3,4}$/.test(debitInputs.securityCode)){
        return "Invalid Security Code.";
      }
    }

    return null; 
  };

  const handlePayment = () => {
    setValidationError(""); // Clear previous errors

    const error = validatePayment();
    if (error) {
      setValidationError(error);
      return;
    }

    const finalPaymentData = {
      ...payment, 
      creditDetails: parseValue(payment.credit) > 0 ? creditInputs : null,
      debitDetails: parseValue(payment.debit) > 0 ? debitInputs : null,
      change: parseValue(payment.cash) > (totalAmount - parseValue(payment.credit) - parseValue(payment.debit)), 
    };

    setPaymentDetails(finalPaymentData);
    closePaymentModal();
    openReceiptModal();
    
  };

  const isPayButtonDisabled = totalPaid < totalAmount;

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 opacity-50 z-50 w-full h-full"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="min-w-1/4 max-h-full overflow-y-scroll bg-blue-500 p-10 text-white rounded-xl shadow-lg">
          
          <div className="flex justify-between items-center text-white border-b p-1">
            <h2 className="text-2xl">Payment Methods</h2>
            <button
              type="button" 
              className="text-xl bg-gray-500 px-3 py-2 rounded-xl"
              onClick={() => closePaymentModal()}
            >
              <IoMdClose />
            </button>
          </div>
          <div className="flex flex-col w-full ">
            
            {/* Total and Remaining Display */}
            <div className="flex items-center justify-between my-[3px] text-lg font-bold">
              <span>Total Due:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className={`flex items-center justify-between my-[3px] text-lg font-bold ${remaining === 0 ? 'text-green-300' : 'text-yellow-300'}`}>
              <span>Remaining:</span>
              <span>${remaining.toFixed(2)}</span>
            </div>
            
            <hr className="my-2 border-t border-blue-400" />

            {/* Credit Card Input */}
            <div className="flex items-center justify-between my-[3px]">
              <label htmlFor="">Credit Card:</label>
              <input
                type="number"
                placeholder="0"
                className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                value={payment.credit}
                onChange={handleCreditChange}
                min="0"
              />
            </div>
            {showCreditInputs && (
              <div className="flex flex-col my-[3px] p-3 border border-blue-400 rounded-lg">
                <h3 className="text-xl mb-2">Credit Card Details:</h3>
                <div className="flex flex-col justify-center w-full mb-2">
                  <label htmlFor="">Card Number</label>
                  <input
                    type="text"
                    className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                    value={creditInputs.cardNumber || ""}
                    onChange={(e) =>
                      setCreditInputs({ ...creditInputs, cardNumber: e.target.value })
                    }
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col w-5/12">
                    <label htmlFor="">Expiry Date</label>
                    <input
                      type="text"
                      className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                      value={creditInputs.expiry || ""}
                      onChange={(e) =>
                        setCreditInputs({ ...creditInputs, expiry: e.target.value })
                      }
                      placeholder="MM-YYYY"
                    />
                  </div>
                  <div className="flex flex-col w-5/12">
                    <label htmlFor="">CVV</label>
                    <input
                      type="number"
                      className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                      value={creditInputs.securityCode || ""}
                      onChange={(e) =>
                        setCreditInputs({ ...creditInputs, securityCode: e.target.value })
                      }
                      max={3}
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Debit Card Input */}
            <div className="flex items-center justify-between my-[3px]">
              <label htmlFor="">Debit Card:</label>
              <input
                type="number"
                placeholder="0"
                className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                value={payment.debit}
                onChange={handleDebitChange}
                min="0"
              />
            </div>
            {showDebitInputs && (
              <div className="flex flex-col my-[3px] p-3 border border-blue-400 rounded-lg">
                <h3 className="text-xl mb-2">Debit Card Details:</h3>
                <div className="flex flex-col justify-center w-full mb-2">
                  <label htmlFor="">Card Number</label>
                  <input
                    type="text"
                    className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                    value={debitInputs.cardNumber || ""}
                    onChange={(e) =>
                      setDebitInputs({ ...debitInputs, cardNumber: e.target.value })
                    }
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col w-5/12">
                    <label htmlFor="">Expiry Date</label>
                    <input
                      type="text"
                      className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                      value={debitInputs.expiry || ""}
                      onChange={(e) =>
                        setDebitInputs({ ...debitInputs, expiry: e.target.value })
                      }
                      placeholder="MM-YYYY"
                    />
                  </div>
                  <div className="flex flex-col w-5/12">
                    <label htmlFor="">CVV</label>
                    <input
                      type="text"
                      className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                      value={debitInputs.securityCode || ""}
                      onChange={(e) =>
                        setDebitInputs({ ...debitInputs, securityCode: e.target.value })
                      }
                       max={3}
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cash Input */}
            <div className="flex items-center justify-between my-[3px]">
              <label htmlFor="">Cash:</label>
              <input
                type="number"
                placeholder="0"
                className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                value={payment.cash}
                onChange={handleCashChange}
                min="0"
              />
            </div>

            {/* Total Paid and Change */}
            <hr className="my-2 border-t border-blue-400" />
            <div className="flex items-center justify-between my-[3px] text-lg font-bold">
              <span>Total Paid:</span>
              <span>${totalPaid.toFixed(2)}</span>
            </div>
            {payment.cash && parseValue(payment.cash) > (totalAmount - parseValue(payment.credit) - parseValue(payment.debit)) && (
                <div className="flex items-center justify-between my-[3px] text-lg font-bold text-green-300">
                    <span>Change:</span>
                    <span>${(parseValue(payment.cash) - (totalAmount - parseValue(payment.credit) - parseValue(payment.debit))).toFixed(2)}</span>
                </div>
            )}

          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="text-red-300 text-center mt-3 font-semibold">
              {validationError}
            </div>
          )}

          <p>All cards will be charged 2% more as a handling fee.</p>

          <div className="flex justify-center items-center mt-4">
            <button
              onClick={handlePayment}
              disabled={isPayButtonDisabled}
              className={`py-3 px-8 rounded-xl text-xl font-bold ${
                isPayButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 transition duration-150"
              }`}
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
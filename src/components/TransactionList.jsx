import PaymentModal from "./PaymentModal";
import ReceiptModal from "./ReceiptModal";
import { useState } from "react";
export default function TransactionList({
  selectedTransactions,
  clearSelectedTransactions,
}) {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const closePaymentModal = () => setOpenPaymentModal(false);
  const completeTransaction = () => {};

  return (
    <>
      <div className="min-w-[310px]">
        <h2 className="text-xl mb-1">Transaction List</h2>
        <div className="border border-blue-500 p-4 rounded-xl">
          <ul className="flex flex-col">
            {selectedTransactions.length > 0 ? (
              selectedTransactions
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((t, index) => (
                  <li key={index} className="flex justify-between my-[3px]">
                    <span>{t.name}</span>
                    {t.quantity > 1 && <span>Qty: {t.quantity}</span>}
                    <span>${parseFloat(t.amount) * parseInt(t.quantity)}</span>
                  </li>
                ))
            ) : (
              <li className="my-[3px]">No transactions selected.</li>
            )}
          </ul>
          <div className="flex flex-col border-t border-blue-500">
            <div className="flex items-center justify-between my-[3px]">
              <span>Total:</span>
              <span>
                $
                {selectedTransactions.reduce(
                  (sum, t) => sum + parseFloat(t.amount) * parseInt(t.quantity),
                  0
                )}
              </span>
            </div>
            <div className="flex items-center justify-between my-[3px]">
              <span>Total Fees:</span>
              <span>
                $
                {selectedTransactions.reduce(
                  (sum, t) => sum + parseFloat(t.fees) * parseInt(t.quantity),
                  0
                )}
              </span>
            </div>
            <div className="flex items-center justify-between my-[3px] border-t border-blue-500">
              <span>Grand Total:</span>
              <span>
                $
                {selectedTransactions.reduce(
                  (sum, t) =>
                    sum +
                    parseFloat(t.amount) * parseInt(t.quantity) +
                    parseFloat(t.fees) * parseInt(t.quantity),
                  0
                )}
              </span>
            </div>
            <div className="flex items-center justify-between my-[3px]">
              <button
                className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-100"
                onClick={() => clearSelectedTransactions()}
              >
                Clear
              </button>
              <button
                className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-100"
                onClick={() =>
                  selectedTransactions.length > 0
                    ? setOpenPaymentModal(true)
                    : setOpenPaymentModal(false)
                }
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
      {openPaymentModal && (
        <PaymentModal
          total={selectedTransactions.reduce(
            (sum, t) =>
              sum +
              parseFloat(t.amount) * parseInt(t.quantity) +
              parseFloat(t.fees) * parseInt(t.quantity),
            0
          )}
          closePaymentModal={closePaymentModal}
          setPaymentDetails={setPaymentDetails}
          openReceiptModal = {()=>setOpenReceiptModal(true)}
        />
      )}
      {openReceiptModal && (
        <ReceiptModal
          closeReceiptModal={()=>{setOpenReceiptModal(false); setPaymentDetails(null); clearSelectedTransactions();}}
          selectedTransactions={selectedTransactions}
          paymentDetails={paymentDetails}
        />
      )}
    </>
  );
}

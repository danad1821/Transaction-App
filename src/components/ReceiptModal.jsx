import { IoMdClose } from "react-icons/io";
import React from "react";
// Changed import from generatePDF to usePDF hook
import { usePDF } from "react-to-pdf"; 

export default function ReceiptModal({
  closeReceiptModal,
  selectedTransactions,
  paymentDetails,
}) {
  // Use the usePDF hook to get the ref and the download function
  const { toPDF, targetRef } = usePDF({
    filename: `receipt-${new Date().toISOString()}.pdf`,
  });

  // Utility function to safely parse and fix float amounts
  const parseValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  // Calculate the Grand Total for the receipt
  const grandTotal = selectedTransactions.reduce(
    (sum, t) =>
      sum +
      parseValue(t.amount) * parseInt(t.quantity) +
      parseValue(t.fees) * parseInt(t.quantity),
    0
  );

  // Calculate the total paid by the customer (including card fees from PaymentModal)
  const totalPaid =
    parseValue(paymentDetails.credit) * 1.02 +
    parseValue(paymentDetails.debit) * 1.02 +
    parseValue(paymentDetails.cash);

  // Calculate Change
  const changeAmount = totalPaid > grandTotal ? totalPaid - grandTotal : 0;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gray-900 opacity-75 z-50 w-full h-full"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/*
          COLOR FIX: Use style prop instead of 'bg-white' and 'text-gray-800'
          to avoid the 'oklch' parsing error.
        */}
        <div
          ref={targetRef}
          style={{ backgroundColor: '#ffffff', color: '#1f2937' }} // Standard hex codes
          className="w-full max-w-sm max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl"
        >
          {/* Header and Close Button */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-3xl font-bold text-blue-600">RECEIPT</h2>
            <button
              type="button"
              className="text-2xl text-gray-600 hover:text-red-500 transition"
              onClick={() => closeReceiptModal()}
              aria-label="Close Receipt"
            >
              <IoMdClose />
            </button>
          </div>

          <p className="text-center text-sm mb-4">
            Thank you for your business!
          </p>

          {/* Transaction List */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold border-b pb-2 mb-2 text-gray-700">
              Items
            </h3>
            <ul className="flex flex-col space-y-2">
              {selectedTransactions.length > 0 ? (
                selectedTransactions
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((t, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="flex-1 pr-2 truncate">{t.name}</span>
                      {t.quantity > 1 && (
                        <span className="w-1/6 text-right">
                          Qty: {t.quantity}
                        </span>
                      )}
                      <span className="w-1/4 text-right font-medium">
                        $
                        {(parseValue(t.amount) * parseInt(t.quantity)).toFixed(
                          2
                        )}
                      </span>
                    </li>
                  ))
              ) : (
                <li className="text-center text-gray-500">
                  No transactions selected.
                </li>
              )}
            </ul>
          </div>

          {/* Grand Totals */}
          <div className="flex flex-col pt-4 border-t border-gray-300">
            <div className="flex items-center justify-between my-1 text-base">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold text-right">
                $
                {selectedTransactions
                  .reduce(
                    (sum, t) =>
                      sum + parseValue(t.amount) * parseInt(t.quantity),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between my-1 text-base">
              <span className="font-medium">Total Fees:</span>
              <span className="font-semibold text-right">
                $
                {selectedTransactions
                  .reduce(
                    (sum, t) => sum + parseValue(t.fees) * parseInt(t.quantity),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between my-2 pt-2 border-t border-gray-400 text-xl font-bold text-green-700">
              <span>Grand Total:</span>
              <span className="text-right">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="flex flex-col pt-4 mt-4 border-t border-gray-300">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              Payment Summary
            </h3>

            {parseValue(paymentDetails.credit) > 0 && (
              <div className="flex justify-between items-center my-1">
                <span>Credit (Incl. 2% Fee):</span>
                <span className="font-medium text-right">
                  ${(parseValue(paymentDetails.credit) * 1.02).toFixed(2)}
                </span>
              </div>
            )}

            {parseValue(paymentDetails.debit) > 0 && (
              <div className="flex justify-between items-center my-1">
                <span>Debit (Incl. 2% Fee):</span>
                <span className="font-medium text-right">
                  ${(parseValue(paymentDetails.debit) * 1.02).toFixed(2)}
                </span>
              </div>
            )}

            {parseValue(paymentDetails.cash) > 0 && (
              <div className="flex justify-between items-center my-1">
                <span>Cash:</span>
                <span className="font-medium text-right">
                  ${parseValue(paymentDetails.cash).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center my-2 pt-2 border-t border-gray-400 text-lg font-bold">
              <span>Amount Paid:</span>
              <span className="text-right">${totalPaid.toFixed(2)}</span>
            </div>
            
            {/* Display Change Due */}
            {changeAmount > 0 && (
                <div className="flex justify-between items-center my-2 pt-2 border-t border-gray-400 text-xl font-bold text-blue-600">
                    <span>Change Due:</span>
                    <span className="text-right">${changeAmount.toFixed(2)}</span>
                </div>
            )}
          </div>

          {/* Download Button */}
          <div className="flex justify-center">
            <button
              className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => toPDF()} // Call the toPDF function
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import { IoMdClose } from "react-icons/io";
import React, { useRef } from "react";
// Import the low-level libraries for maximum control
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReceiptModal({
  closeReceiptModal,
  selectedTransactions,
  paymentDetails,
}) {
  // Use a standard useRef hook
  const targetRef = useRef(null);

  // Utility function to safely parse and fix float amounts
  const parseValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  // Calculate the totals
  const grandTotal = selectedTransactions.reduce(
    (sum, t) =>
      sum +
      parseValue(t.amount) * parseInt(t.quantity) +
      parseValue(t.fees) * parseInt(t.quantity),
    0
  );

  const totalPaid =
    parseValue(paymentDetails.credit) * 1.02 +
    parseValue(paymentDetails.debit) * 1.02 +
    parseValue(paymentDetails.cash);

  const changeAmount = totalPaid > grandTotal ? totalPaid - grandTotal : 0;

  // NEW, Robust PDF Download Handler
  const handleDownloadPdf = () => {
    const input = targetRef.current;
    if (input) {
      html2canvas(input, {
        scale: 3, // High scale for better image quality
        useCORS: true,
        // CRITICAL: Ignore the close button element to prevent its styles from causing the error
        ignoreElements: (element) => {
          // Give the close button a unique ID or class to ignore it
          return element.id === "close-button-pdf-ignore";
        },
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`receipt-${new Date().getTime()}.pdf`);
      });
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gray-900 opacity-75 z-50 w-full h-full"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Printable Area: Use safe inline styles as a fallback */}
        <div
          ref={targetRef}
          // Replaced colors with safe inline styles one last time
          style={{ backgroundColor: "#ffffff", color: "#1f2937" }}
          className="w-full max-w-sm max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl"
        >
          {/* Header and Close Button */}
          <div
            className="flex justify-between items-center border-b pb-3 mb-4"
            style={{ borderColor: "#d1d5db" }}
          >
            <h2 className="text-3xl font-bold text-blue-600">RECEIPT</h2>
            <button
              type="button"
              id="close-button-pdf-ignore" // CRITICAL: ID to ignore this button during canvas generation
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

          {/* Transaction List (using safe colors) */}
          <div className="mb-4">
            <h3
              className="text-xl font-semibold border-b pb-2 mb-2 text-gray-700"
              style={{ borderColor: "#d1d5db" }}
            >
              Items
            </h3>
            {/* ... rest of the transaction list structure ... */}
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

          {/* Totals Section (using safe colors) */}
          <div
            className="flex flex-col pt-4"
            style={{ borderTop: "1px solid #d1d5db" }}
          >
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

            <div
              className="flex items-center justify-between my-2 pt-2 text-xl font-bold text-green-700"
              style={{ borderTop: "1px solid #9ca3af" }}
            >
              <span>Grand Total:</span>
              <span className="text-right">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details Section (using safe colors) */}
          <div
            className="flex flex-col pt-4 mt-4"
            style={{ borderTop: "1px solid #d1d5db" }}
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              Payment Summary
            </h3>

            {/* Credit, Debit, Cash details here... (Omitted for brevity, but keep your original content) */}
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

            <div
              className="flex justify-between items-center my-2 pt-2 text-lg font-bold"
              style={{ borderTop: "1px solid #9ca3af" }}
            >
              <span>Amount Paid:</span>
              <span className="text-right">${totalPaid.toFixed(2)}</span>
            </div>
            
          </div>
          <div className="flex justify-center w-full">
            <button
              className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={handleDownloadPdf}
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Download Button (Placed outside the printable div) */}
    </>
  );
}

import { useState } from "react";
import NewTransactionModal from "./NewTransactionModal";
export default function AddTransactionButton({ addToAllTransactions }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const closeModal = () => setShowAddModal(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="rounded-lg bg-blue-500 text-white px-2 py-3 hover:bg-blue-200 h-[50px]"
      >
        Add Transaction
      </button>
      {showAddModal && (
        <NewTransactionModal
          addToAllTransactions={addToAllTransactions}
          closeModal={closeModal}
        />
      )}
    </>
  );
}

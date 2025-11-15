import { IoMdClose } from "react-icons/io";
import { useState } from "react";

export default function NewTransactionModal({
  addToAllTransactions,
  closeModal,
}) {
  const [formData, setFormData] = useState({ name: "", amount: 0, fees: 0 });
  const [error, setError] = useState(null);

  const resetError = ()=>{
    setTimeout(()=>{
      setError(null);
    }, 5000)
  }

  const formSubmission = (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Please enter a name for the transaction.");
      resetError();
      return;
    }
    if (formData.amount === 0) {
      setError("An amount must be set for the transaction.");
      resetError();
      return;
    }
    addToAllTransactions(formData);
    closeModal();
  };
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 opacity-50 z-50 w-full h-full"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-1/4 bg-blue-500 p-10 text-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center text-white border-b p-1">
            <h2 className="text-2xl">Add new transaction:</h2>
            <button
              button="button"
              onClick={() => closeModal()}
              className="text-xl bg-gray-500 px-3 py-2 rounded-xl"
            >
              <IoMdClose />
            </button>
          </div>
          <form
            action=""
            className="flex flex-col items-center justify-center"
            onSubmit={formSubmission}
          >
            <div className="flex flex-col w-full">
              <label htmlFor="" className="text-lg mt-2 mb-1">Name</label>
              <input
                className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                type="text"
                value={formData?.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="text-lg mt-2 mb-1">Amount</label>
              <input
                className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                type="text"
                value={formData?.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="text-lg mt-2 mb-1">Fees</label>
              <input
                className="bg-white border border-black rounded-xl p-2 outline-yellow text-black"
                type="text"
                value={formData?.fees}
                onChange={(e) =>
                  setFormData({ ...formData, fees: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="bg-gray-500 px-2 py-1 rounded-xl m-2"
            >
              Add
            </button>
            {error && <p className="text-red-500 m-2 bg-white border border-red p-2 rounded-xl w-full text-center">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

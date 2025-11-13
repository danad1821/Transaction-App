import { IoMdClose } from "react-icons/io";
import { useState } from "react";

export default function NewTransactionModal({
  addToAllTransactions,
  closeModal,
}) {
  const [formData, setFormData] = useState({ name: "", amount: 0, fees: 0 });
  const formSubmission = (e)=>{
    e.preventDefault();
    addToAllTransactions(formData);
    closeModal();
  }
  return (
    <>
      <div className="absolute inset-0 bg-gray-500 opacity-50 z-5 w-full h-full"></div>
      <div className="absolute inset-0 w-1/4 z-20 bg-blue-500 left-1/3 h-1/2 top-50 p-10 text-white rounded-xl">
        <div className="flex justify-between items-center text-white border-b p-1">
          <h2 className="text-xl">Add new transaction:</h2>
          <button
            button="button"
            onClick={() => closeModal()}
            className="text-xl bg-gray-500 px-3 py-2 rounded-xl"
          >
            <IoMdClose />
          </button>
        </div>
        <form action="" className="flex flex-col items-center justify-center" onSubmit={formSubmission}>
          <div className="flex flex-col w-full">
            <label htmlFor="">Name</label>
            <input
              className="bg-white border border-black rounded-xl px-1 outline-yellow text-black"
              type="text"
              value={formData?.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="">Amount</label>
            <input
              className="bg-white border border-black rounded-xl px-1 outline-yellow text-black"
              type="text"
              value={formData?.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="">Fees</label>
            <input
              className="bg-white border border-black rounded-xl px-1 outline-yellow text-black"
              type="text"
              value={formData?.fees}
              onChange={(e) =>
                setFormData({ ...formData, fees: e.target.value })
              }
            />
          </div>
          <button type="submit" className="bg-gray-500 px-2 py-1 rounded-xl m-2">Add</button>
        </form>
      </div>
    </>
  );
}

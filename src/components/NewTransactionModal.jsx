export default function NewTransactionModal({addToAllTransactions, showAddModal}) {
  return (
    <div>
        <div></div>
        <div className="">
          <h2>Add new transaction:</h2>
          <form action="">
            <div>
              <label htmlFor="">Name</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Amount</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Fees</label>
              <input type="text" />
            </div>
          </form>
        </div>
    </div>
  );
}

export default function POSMenu({ allTransactions, selectTransaction }) {
  return (
    <div className="w-lg-1/2 ">
        <h2 className="text-xl mb-1">Transaction POS Menu</h2>
        <ul className="border border-blue-500 min-w-1/3 min-h-1/2 rounded-xl list-none flex p-2 flex-wrap">
          {allTransactions.map((t, index) => (
            <li
              key={index}
              className="m-2 border border-gray rounded-xl p-5 cursor-pointer h-1/2 flex flex-col w-[180px]"
              onClick={()=>selectTransaction(t)}
            >
              <span>{t.name}</span>
              <span>Amount: ${t.amount}</span>
              <span>Fees: ${t.fees}</span>
            </li>
          ))}
        </ul>
    </div>
  );
}

export default function POSMenu({ allTransactions, selectTransaction }) {
  return (
    <div className="w-1/2 h-100">
        <h2 className="text-xl mb-1">Transaction POS Menu</h2>
        <ul className="border border-blue-500 min-w-1/3 min-h-1/2 rounded-xl list-none flex p-2">
          {allTransactions.map((t, index) => (
            <li
              key={index}
              className="m-2 border border-gray rounded-xl p-5 cursor-pointer h-1/2"
              onClick={()=>selectTransaction(t)}
            >
              {t.name}
            </li>
          ))}
        </ul>
    </div>
  );
}

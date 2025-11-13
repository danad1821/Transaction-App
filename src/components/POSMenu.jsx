export default function POSMenu({ allTransactions }) {
  return (
    <ul className="border border-blue min-w-1/3 min-h-1/3 rounded-xl list-none flex p-2">
      {allTransactions.map((t, index) => (
        <li
          key={index}
          className="m-2 border border-gray rounded-xl p-5 cursor-pointer"
        >
          {t.name}
        </li>
      ))}
    </ul>
  );
}

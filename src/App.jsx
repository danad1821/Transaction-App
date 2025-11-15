import "./App.css";
import AddTransactionButton from "./components/AddTransactionButton";
import POSMenu from "./components/POSMenu";
import Header from "./components/Header";
import TransactionList from "./components/TransactionList";
import { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [allTransactions, setAllTransactions] = useLocalStorage(
    "allTransactions",
    []
  );
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const addToAllTransactions = (transaction) =>
    setAllTransactions([...allTransactions, transaction]);

  const selectTransaction = (transaction) =>{
    if(!selectedTransactions.includes(transaction)){
      transaction.quantity=1;
      setSelectedTransactions([...selectedTransactions, transaction]);
    }else{
      let changedTransaction = selectedTransactions.find((t)=>t.name === transaction.name);
      changedTransaction.quantity+=1;
      let filteredTransactions = selectedTransactions.filter((t)=>t.name !== transaction.name)
      setSelectedTransactions([...filteredTransactions, changedTransaction]);
    }
  }

  const clearSelectedTransactions = ()=>{
    setSelectedTransactions([]);
  }

  return (
    <>
      <Header/>
      <div className="m-5 flex justify-around">
        <AddTransactionButton addToAllTransactions={addToAllTransactions} />
        <POSMenu allTransactions={allTransactions} selectTransaction={selectTransaction} />
        <TransactionList selectedTransactions={selectedTransactions} clearSelectedTransactions={clearSelectedTransactions} />
      </div>
    </>
  );
}

export default App;

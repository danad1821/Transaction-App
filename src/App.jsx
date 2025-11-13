import './App.css'
import AddTransactionButton from './components/AddTransactionButton';
import POSMenu from './components/POSMenu';
import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [allTransactions, setAllTransactions] = useLocalStorage("allTransactions", []);

  const addToAllTransactions = (transaction) => setAllTransactions([...allTransactions, transaction]);


  return (
    <div className='m-5 flex justify-around'>
      <AddTransactionButton addToAllTransactions={addToAllTransactions} />
      <POSMenu allTransactions={allTransactions} />
    </div>
  )
}

export default App

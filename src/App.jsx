import './App.css'
import AddTransactionButton from './components/AddTransactionButton';
import { useState } from 'react';

function App() {
  const [allTransactions, setAllTransactions] = useState([]);

  const addToAllTransactions = (transaction) => setAllTransactions([...allTransactions, transaction])

  return (
    <>
      <AddTransactionButton addToAllTransactions={addToAllTransactions} />
    </>
  )
}

export default App

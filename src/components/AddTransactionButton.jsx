import { useState } from "react";
import NewTransactionModal from "./NewTransactionModal";
export default function AddTransactionButton({addToAllTransactions}){
    const [showAddModal, setShowAddModal] = useState(false);
    return(
        <>
        <button type="button" onClick={()=>setShowAddModal(true)}>Add Transaction</button>
        <NewTransactionModal addToAllTransactions={addToAllTransactions} showAddModal={showAddModal}/>
        </>
    );
}
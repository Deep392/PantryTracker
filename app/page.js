'use client'
import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: 0, qty: 0 });
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({ price: "", qty: "" });
  const [error, setError] = useState("");

  // Adding items
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.price > 0 && newItem.qty > 0) {
      await addDoc(collection(db, 'items'), {
        name: newItem.name,
        price: parseFloat(newItem.price),
        qty: parseInt(newItem.qty, 10)
      });
      setNewItem({ name: "", price: 0, qty: 0 });
      setError("");
    } else {
      setError("Name cannot be empty and Price and Qty must be greater than 0");
    }
  };

  // Delete Item 
  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Update Item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const price = editValues.price === "" ? 0 : parseFloat(editValues.price);
    const qty = editValues.qty === "" ? 0 : parseInt(editValues.qty, 10);
    if (price > 0 && qty > 0) {
      await updateDoc(doc(db, 'items', editingItem), {
        price,
        qty
      });
      setEditingItem(null);
      setEditValues({ price: "", qty: "" });
      setError("");
    } else {
      setError("Price and Qty must be greater than 0");
    }
  };

  // Read items from database
  useEffect(() => {
    const getItems = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(getItems, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    return () => unsubscribe();
  }, []);

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditValues({ price: item.price.toString(), qty: item.qty.toString() });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold p-4 text-center text-gray-800">Pantry Tracker</h1>
        <div className="bg-slate-800 p-6 rounded-lg">
          <form className="grid grid-cols-12 gap-4 items-center text-black">
            <input
              className="col-span-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Enter Name" />
            <input
              className="col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="number"
              value={newItem.qty}
              onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
              placeholder="Enter Qty" />
            <input
              className="col-span-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              placeholder="Enter Price per Item" />
            <button
              onClick={handleAddItem}
              className="col-span-3 text-white bg-slate-950 hover:bg-slate-900 p-3 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105">+</button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <ul className="mt-6">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-3 border rounded-lg mb-2">
                {editingItem === item.id ? (
                  <form className="flex-1 flex" onSubmit={handleUpdateItem}>
                    <span className="flex-1 p-2">{item.name}</span>
                    <input
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
                      type="number"
                      value={editValues.qty}
                      onChange={(e) => setEditValues({ ...editValues, qty: e.target.value })}
                    />
                    <input
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-black"
                      type="number"
                      step="0.01"
                      value={editValues.price}
                      onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                    />
                    <button
                      type="submit"
                      className="text-white bg-slate-950 hover:bg-slate-900 p-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ml-2">Save</button>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="capitalize">{item.name}</span> | 
                      <span> Qty: {item.qty}</span> | 
                      <span> ${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-white bg-slate-950 hover:bg-slate-900 p-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ml-2">Update</button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-white bg-slate-950 hover:bg-slate-900 p-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ml-2">Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

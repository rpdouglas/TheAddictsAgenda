import React, { useState, useEffect, useCallback } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner, DebouncedTextarea } from './common.jsx';
import { EditIcon, TrashIcon, CheckIcon } from '../utils/icons.jsx';

export const Goals = () => {
    const config = { collectionName: 'goals', title: 'My Goals', prompt: 'Set small, achievable goals for your recovery.', placeholder: 'e.g., Attend a meeting or Call my sponsor tonight', emptyState: 'No goals set yet.', hasCompleted: true };
    const storageKey = LocalDataStore.KEYS.GOALS;
    
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [editingItem, setEditingItem] = useState(null); 
    const [editedText, setEditedText] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);

    // --- Persistence & Loading ---
    const saveItemsToLocal = useCallback((updatedItems) => {
        const sortAndSet = updatedItems.sort((a, b) => (b.timestamp.getTime()) - (a.timestamp.getTime()));
        setItems(sortAndSet);
        const serializableItems = sortAndSet.map(item => ({
            ...item,
            timestamp: item.timestamp.toISOString()
        }));
        LocalDataStore.save(storageKey, serializableItems);
    }, [storageKey]);

    useEffect(() => {
        const loadedItems = LocalDataStore.load(storageKey);
        const formattedItems = loadedItems.map(item => ({
            ...item,
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date(0)
        })).sort((a, b) => (b.timestamp.getTime()) - (a.timestamp.getTime()));

        setItems(formattedItems);
        setIsLoading(false);
    }, [storageKey]);
    
    // --- CRUD Handlers ---

    const handleSaveNewEntry = (e) => {
        e.preventDefault();
        if (newItem.trim() === '') return;
        
        const newItemObject = { 
            id: LocalDataStore.generateId(), 
            text: newItem, 
            timestamp: new Date(),
            completed: false
        };
        
        saveItemsToLocal([newItemObject, ...items]);
        setNewItem('');
    };
    
    const handleToggleCompleted = (item) => {
        const updatedItems = items.map(i => 
            i.id === item.id ? { ...i, completed: !i.completed } : i
        );
        saveItemsToLocal(updatedItems);
    };

    const handleDeleteItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        saveItemsToLocal(updatedItems);
    };
    
    const handleEditGoals = (item) => { 
        setEditingItem(item);
        setEditedText(item.text);
    };

    const handleUpdateGoals = (e) => { 
        e.preventDefault();
        if (!editingItem || editedText.trim() === '') return;

        const updatedItems = items.map(item => 
            item.id === editingItem.id ? { ...item, text: editedText, timestamp: new Date() } : item
        );
        
        saveItemsToLocal(updatedItems);
        setEditingItem(null);
        setEditedText('');
    };

    // --- Render Functions ---
    const GoalsForm = () => (
        <form onSubmit={handleSaveNewEntry} className="flex gap-2 mb-6">
             <DebouncedTextarea
                value={newItem}
                onChange={setNewItem}
                placeholder={config.placeholder}
                isInput={false} 
                rows="2"
            />
            <button type="submit" className="flex-shrink-0 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors">Add</button>
        </form>
    );

    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col"> 
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{config.title}</h2> 
            <p className="text-gray-600 mb-6">{config.prompt}</p> 
            
            {GoalsForm()}
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 mt-4"> 
                {isLoading ? <Spinner /> : (items.length > 0 ? ( 
                    <ul className="space-y-3"> 
                        {items.map(item => ( 
                            <li key={item.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                {editingItem?.id === item.id ? (
                                    <form onSubmit={handleUpdateGoals} className="space-y-2">
                                        <textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            className="w-full p-2 border border-teal-500 rounded-lg resize-none"
                                            rows={2}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700 text-sm font-semibold">Cancel</button>
                                            <button type="submit" className="bg-teal-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-600 font-semibold">Save Changes</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col">
                                        <div className="flex items-start justify-between w-full">
                                            <input type="checkbox" checked={item.completed} onChange={() => handleToggleCompleted(item)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-4 flex-shrink-0 mt-1"/>
                                            <div className="flex-grow">
                                                <p className={`text-gray-800 whitespace-pre-wrap ${item.completed ? 'line-through text-gray-400' : ''}`}>{item.text}</p>
                                                <p className="text-xs text-gray-400 mt-1">{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-2 space-x-2">
                                            <button onClick={() => handleEditGoals(item)} className="text-gray-500 hover:text-blue-600 text-xs font-semibold flex items-center gap-1">
                                                <EditIcon className="w-4 h-4"/> Edit
                                            </button>
                                            <button onClick={() => handleDeleteItem(item.id)} className="text-gray-500 hover:text-red-500 text-xs font-semibold flex items-center gap-1">
                                                <TrashIcon className="w-4 h-4"/> Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li> 
                        ))} 
                    </ul> 
                ) : ( <div className="text-center py-10"><p className="text-gray-500">{config.emptyState}</p></div> ))} 
            </div> 
        </div> 
    );
};

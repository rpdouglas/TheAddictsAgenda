import React, { useState, useEffect, useCallback } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, TrashIcon, EditIcon } from '../utils/icons.jsx';

const STORAGE_KEY = LocalDataStore.KEYS.HOMEGROUP_MEMBERS;

const trustedServantRoles = [
    "Group Member",
    "Secretary",
    "Treasurer",
    "GSR (General Service Representative)",
    "Chairperson",
    "Coffee Maker",
    "Literature Person",
    "Greeter",
];

const GroupMembers = ({ onBack }) => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState({
        id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member'
    });

    useEffect(() => {
        const loadedMembers = LocalDataStore.load(STORAGE_KEY) || [];
        setMembers(loadedMembers);
        setIsLoading(false);
    }, []);

    const saveMembers = (updatedMembers) => {
        setMembers(updatedMembers);
        LocalDataStore.save(STORAGE_KEY, updatedMembers);
    };

    const resetForm = () => {
        setFormState({ id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member' });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formState.name.trim()) return;

        let updatedMembers;
        if (isEditing) {
            updatedMembers = members.map(m => m.id === formState.id ? formState : m);
        } else {
            updatedMembers = [...members, { ...formState, id: LocalDataStore.generateId() }];
        }
        saveMembers(updatedMembers);
        resetForm();
    };

    const handleStartEdit = (member) => {
        setFormState(member);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        saveMembers(members.filter(m => m.id !== id));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Homegroup</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Members</h2>

            <form onSubmit={handleFormSubmit} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 mb-6">
                <h3 className="font-bold text-lg text-gray-700">{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
                <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Name" className="w-full p-2 border rounded-lg" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="tel" name="phone" value={formState.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 border rounded-lg" />
                    <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="Email Address" className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Sober Date</label>
                    <input type="date" name="soberDate" value={formState.soberDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Position</label>
                    <select name="position" value={formState.position} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
                        {trustedServantRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    {isEditing && <button type="button" onClick={resetForm} className="w-1/2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>}
                    <button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700">{isEditing ? 'Update Member' : 'Add Member'}</button>
                </div>
            </form>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? <Spinner /> : (members.length > 0 ? (
                    <ul className="space-y-3">
                        {members.map(m => (
                            <li key={m.id} className="p-3 border rounded-lg bg-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800">{m.name}</p>
                                        <p className="text-sm text-blue-600 font-medium">{m.position}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleStartEdit(m)} className="text-gray-400 hover:text-blue-500"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mt-2 space-y-1">
                                    {m.phone && <p><strong>Phone:</strong> {m.phone}</p>}
                                    {m.email && <p><strong>Email:</strong> {m.email}</p>}
                                    {m.soberDate && <p><strong>Sober Date:</strong> {new Date(m.soberDate + 'T00:00:00').toLocaleDateString()}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No group members added yet.</p>
                ))}
            </div>
        </div>
    );
};

export default GroupMembers;
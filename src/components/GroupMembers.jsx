import React, { useState, useEffect, useCallback } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, TrashIcon, EditIcon, PlusIcon } from '../utils/icons.jsx';

const STORAGE_KEY = LocalDataStore.KEYS.HOMEGROUP_MEMBERS;

// --- Confirmation Modal Component ---
const DeleteMemberModal = ({ memberName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600">
                Are you sure you want to delete the member: <span className="font-semibold">{memberName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Delete Member</button>
            </div>
        </div>
    </div>
);


const GroupMembers = ({ onBack }) => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formState, setFormState] = useState({
        id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member'
    });

    // --- State for Delete Confirmation ---
    const [memberToDelete, setMemberToDelete] = useState(null);

    const trustedServantRoles = [
        "Group Member", "Secretary", "Treasurer", "GSR (General Service Representative)",
        "Chairperson", "Coffee Maker", "Literature Person", "Greeter",
    ];

    useEffect(() => {
        const loadedMembers = LocalDataStore.load(STORAGE_KEY) || [];
        setMembers(loadedMembers);
        setIsLoading(false);
    }, []);

    const saveMembers = (updatedMembers) => {
        const sortedMembers = updatedMembers.sort((a, b) => a.name.localeCompare(b.name));
        setMembers(sortedMembers);
        LocalDataStore.save(STORAGE_KEY, sortedMembers);
    };

    const resetForm = () => {
        setFormState({ id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member' });
        setIsEditing(false);
        setShowAddForm(false);
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
        setShowAddForm(true);
        window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom where form is
    };

    const handleDelete = (member) => {
        setMemberToDelete(member);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            saveMembers(members.filter(m => m.id !== memberToDelete.id));
            setMemberToDelete(null);
        }
    };

    const cancelDelete = () => {
        setMemberToDelete(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            {/* --- Render Delete Confirmation Modal --- */}
            {memberToDelete && (
                <DeleteMemberModal
                    memberName={memberToDelete.name}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Homegroup</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Members</h2>

            {/* --- Members List (Moved to Top) --- */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-6">
                {isLoading ? <Spinner /> : (members.length > 0 ? (
                    <ul className="space-y-3">
                        {members.map(m => (
                            <li key={m.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">{m.name}</p>
                                        <p className="text-sm text-teal-700 font-medium">{m.position}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={() => handleStartEdit(m)} title="Edit Member" className="text-gray-500 hover:text-blue-600"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(m)} title="Delete Member" className="text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-700 mt-3 pt-3 border-t border-gray-200 space-y-1">
                                    {m.phone && <p><strong>Phone:</strong> <a href={`tel:${m.phone}`} className="text-blue-600 hover:underline">{m.phone}</a></p>}
                                    {m.email && <p><strong>Email:</strong> <a href={`mailto:${m.email}`} className="text-blue-600 hover:underline">{m.email}</a></p>}
                                    {m.soberDate && <p><strong>Sober Date:</strong> {new Date(m.soberDate + 'T00:00:00').toLocaleDateString()}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-6">No group members added yet. Click the button below to add one.</p>
                ))}
            </div>

            {/* --- "Add Member" Button and Form --- */}
            {!showAddForm ? (
                <button
                    onClick={() => { setShowAddForm(true); setIsEditing(false); setFormState({ id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member' }); }}
                    className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
                >
                    <PlusIcon className="w-5 h-5"/> Add New Member
                </button>
            ) : (
                <form onSubmit={handleFormSubmit} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-fade-in">
                    <h3 className="font-bold text-xl text-gray-800">{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
                    <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Name" className="w-full p-2 border rounded-lg" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="tel" name="phone" value={formState.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 border rounded-lg" />
                        <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="Email Address" className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Sober Date</label>
                        <input type="date" name="soberDate" value={formState.soberDate} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Position</label>
                        <select name="position" value={formState.position} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg">
                            {trustedServantRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={resetForm} className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700">{isEditing ? 'Update Member' : 'Save Member'}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default GroupMembers;
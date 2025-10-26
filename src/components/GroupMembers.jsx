import React, { useState, useEffect, useCallback } from 'react';
import DataStore from '../utils/dataStore.js'; // UPDATED: Import the unified DataStore
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, TrashIcon, EditIcon, PlusIcon } from '../utils/icons.jsx';

const STORAGE_KEY = DataStore.KEYS.HOMEGROUP_MEMBERS; // UPDATED: Use DataStore

// --- Confirmation Modal Component ---
const DeleteMemberModal = ({ memberName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-deep-charcoal">Confirm Deletion</h3>
            <p className="text-deep-charcoal/70">
                Are you sure you want to delete the member: <span className="font-semibold">{memberName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-hopeful-coral text-white font-semibold py-2 px-4 rounded-lg hover:brightness-95 transition-colors">Delete Member</button>
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

    // --- Data Persistence (UPDATED FOR DATASTORE) ---
    useEffect(() => {
        const loadMembers = async () => {
            setIsLoading(true);
            const loadedMembers = await DataStore.load(STORAGE_KEY) || []; // UPDATED: Use DataStore
            setMembers(loadedMembers.sort((a, b) => a.name.localeCompare(b.name)));
            setIsLoading(false);
        };
        loadMembers();
    }, []);

    const saveMembersToStore = useCallback(async (updatedMembers) => { // RENAMED for clarity
        const sortedMembers = updatedMembers.sort((a, b) => a.name.localeCompare(b.name));
        setMembers(sortedMembers);
        await DataStore.save(STORAGE_KEY, sortedMembers); // UPDATED: Use DataStore
    }, []);

    const resetForm = () => {
        setFormState({ id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member' });
        setIsEditing(false);
        setShowAddForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formState.name.trim()) return;

        let updatedMembers;
        if (isEditing) {
            updatedMembers = members.map(m => m.id === formState.id ? formState : m);
        } else {
            updatedMembers = [...members, { ...formState, id: DataStore.generateId() }]; // UPDATED: Use DataStore
        }
        await saveMembersToStore(updatedMembers);
        resetForm();
    };

    const handleStartEdit = (member) => {
        setFormState(member);
        setIsEditing(true);
        setShowAddForm(true);
        window.scrollTo(0, document.body.scrollHeight);
    };

    const handleDelete = (member) => {
        setMemberToDelete(member);
    };

    const confirmDelete = async () => {
        if (memberToDelete) {
            await saveMembersToStore(members.filter(m => m.id !== memberToDelete.id));
            setMemberToDelete(null);
        }
    };

    const cancelDelete = () => {
        setMemberToDelete(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            {memberToDelete && (
                <DeleteMemberModal
                    memberName={memberToDelete.name}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Homegroup</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Group Members</h2>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-6">
                {isLoading ? <Spinner /> : (members.length > 0 ? (
                    <ul className="space-y-3">
                        {members.map(m => (
                            <li key={m.id} className="p-4 border rounded-lg bg-pure-white/60 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-deep-charcoal text-lg">{m.name}</p>
                                        <p className="text-sm text-serene-teal font-medium">{m.position}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={() => handleStartEdit(m)} title="Edit Member" className="text-deep-charcoal/60 hover:text-blue-600"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(m)} title="Delete Member" className="text-deep-charcoal/60 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                                <div className="text-sm text-deep-charcoal/80 mt-3 pt-3 border-t border-light-stone/50 space-y-1">
                                    {m.phone && <p><strong>Phone:</strong> <a href={`tel:${m.phone}`} className="text-blue-600 hover:underline">{m.phone}</a></p>}
                                    {m.email && <p><strong>Email:</strong> <a href={`mailto:${m.email}`} className="text-blue-600 hover:underline">{m.email}</a></p>}
                                    {m.soberDate && <p><strong>Sober Date:</strong> {new Date(m.soberDate + 'T00:00:00').toLocaleDateString()}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-deep-charcoal/60 text-center py-6">No group members added yet. Click the button below to add one.</p>
                ))}
            </div>

            {!showAddForm ? (
                <button
                    onClick={() => { setShowAddForm(true); setIsEditing(false); setFormState({ id: null, name: '', phone: '', email: '', soberDate: '', position: 'Group Member' }); }}
                    className="w-full bg-serene-teal text-white font-bold py-3 px-4 rounded-lg hover:brightness-95 flex items-center justify-center gap-2"
                >
                    <PlusIcon className="w-5 h-5"/> Add New Member
                </button>
            ) : (
                <form onSubmit={handleFormSubmit} className="p-4 bg-pure-white/60 rounded-lg border border-light-stone/50 space-y-4 animate-fade-in">
                    <h3 className="font-bold text-xl text-deep-charcoal">{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
                    <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Name" className="w-full p-2 border rounded-lg" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="tel" name="phone" value={formState.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 border rounded-lg" />
                        <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="Email Address" className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-deep-charcoal/80">Sober Date</label>
                        <input type="date" name="soberDate" value={formState.soberDate} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-deep-charcoal/80">Position</label>
                        <select name="position" value={formState.position} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg">
                            {trustedServantRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={resetForm} className="w-full bg-light-stone/70 text-deep-charcoal font-bold py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="w-full bg-serene-teal text-white font-bold py-2 px-4 rounded-lg hover:brightness-95">{isEditing ? 'Update Member' : 'Save Member'}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default GroupMembers;
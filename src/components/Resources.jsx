import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataStore from '../utils/dataStore.js'; // UPDATED: Import the unified DataStore
import { MEETING_LINKS } from '../utils/data.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, ChevronDown, ChevronUp, TrashIcon, CheckIcon, StarIcon, ViewGridIcon, ViewListIcon, EditIcon, HomeIcon } from '../utils/icons.jsx';

// --- Main Component ---
export const MeetingManagement = ({ onNavigate, onBack }) => {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    
    // Form State & Editing State
    const [formState, setFormState] = useState({
        id: null,
        name: '',
        day: 'Sunday',
        time: '',
        address: '',
        isHomegroup: false,
    });
    const [isEditing, setIsEditing] = useState(false);

    // --- Data Persistence (UPDATED FOR DATASTORE) ---
    const loadMeetings = useCallback(async () => {
        setIsLoading(true);
        const storedMeetings = await DataStore.load(DataStore.KEYS.MEETINGS) || []; // UPDATED
        setMeetings(storedMeetings);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const saveMeetings = useCallback(async (updatedMeetings) => {
        setMeetings(updatedMeetings);
        await DataStore.save(DataStore.KEYS.MEETINGS, updatedMeetings); // UPDATED
    }, []);
    
    // --- Handlers (UPDATED FOR DATASTORE) ---
    const resetForm = () => {
        setFormState({ id: null, name: '', day: 'Sunday', time: '', address: '', isHomegroup: false });
        setIsEditing(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { name, time, isHomegroup } = formState;

        if (!name.trim() || !time) return;

        let updatedMeetings;
        let submittedMeetingId = formState.id;

        if (isEditing) {
            updatedMeetings = meetings.map(m => m.id === formState.id ? { ...formState } : m);
        } else {
            const newMeeting = { ...formState, id: DataStore.generateId() }; // UPDATED
            submittedMeetingId = newMeeting.id;
            updatedMeetings = [...meetings, newMeeting];
        }

        if (isHomegroup) {
            updatedMeetings = updatedMeetings.map(m =>
                m.id === submittedMeetingId
                    ? { ...m, isHomegroup: true }
                    : { ...m, isHomegroup: false }
            );
        }

        await saveMeetings(updatedMeetings);
        resetForm();
    };

    const handleStartEdit = (meeting) => {
        setFormState(meeting);
        setIsEditing(true);
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleDeleteMeeting = async (id) => {
        await saveMeetings(meetings.filter(m => m.id !== id));
    };

    const handleSetHomegroup = async (id) => {
        await saveMeetings(meetings.map(m => ({ ...m, isHomegroup: m.id === id })));
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Render Views ---
    const renderMeetingList = () => (
        <ul className="space-y-3">
            {meetings.sort((a,b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.time.localeCompare(b.time)).map(m => (
                <li key={m.id} className={`p-3 rounded-lg ${m.isHomegroup ? 'bg-hopeful-coral/20 border border-hopeful-coral/40' : 'bg-white border'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-deep-charcoal">{m.name}</p>
                            <p className="text-sm text-deep-charcoal/70">{m.day} at {m.time}</p>
                            {m.address && <p className="text-xs text-deep-charcoal/60">{m.address}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                             <button onClick={() => handleStartEdit(m)} title="Edit Meeting" className="text-deep-charcoal/50 hover:text-blue-500"><EditIcon className="w-5 h-5"/></button>
                             <button onClick={() => handleSetHomegroup(m.id)} title="Set as Homegroup">
                                <StarIcon className={`w-6 h-6 ${m.isHomegroup ? 'text-yellow-500 fill-current' : 'text-deep-charcoal/50 hover:text-yellow-500'}`} />
                             </button>
                             <button onClick={() => handleDeleteMeeting(m.id)} className="text-hopeful-coral hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                    {m.isHomegroup && (
                         <button onClick={() => onNavigate('homegroup')} className="mt-2 text-sm w-full bg-hopeful-coral text-deep-charcoal font-semibold py-1 px-3 rounded-lg hover:brightness-95 flex items-center justify-center gap-2">
                            <HomeIcon className="w-4 h-4"/> Homegroup Dashboard
                         </button>
                    )}
                </li>
            ))}
        </ul>
    );

    const renderCalendarView = () => (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {daysOfWeek.map(day => (
                <div key={day} className="border rounded-lg p-2 bg-pure-white/60 min-h-[100px]">
                    <p className="font-bold text-center text-sm mb-2">{day}</p>
                    <div className="space-y-2">
                        {meetings.filter(m => m.day === day).sort((a, b) => a.time.localeCompare(b.time)).map(m => (
                             <div key={m.id} className={`p-2 rounded-md text-xs ${m.isHomegroup ? 'bg-yellow-200' : 'bg-white shadow-sm'}`}>
                                <p className="font-semibold truncate">{m.name}</p>
                                <p>{m.time}</p>
                             </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Meeting Management</h2>
            
            <form onSubmit={handleFormSubmit} className="p-4 bg-pure-white/60 rounded-lg border border-light-stone/50 space-y-3 mb-6">
                <h3 className="font-bold text-lg text-deep-charcoal/80">{isEditing ? 'Edit Meeting' : 'Add a New Meeting'}</h3>
                <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Meeting Name (e.g., 'Sunrise Sobriety')" className="w-full p-2 border rounded-lg" required />
                <input type="text" name="address" value={formState.address} onChange={handleInputChange} placeholder="Address or Online Link" className="w-full p-2 border rounded-lg" />
                <div className="flex gap-2">
                    <select name="day" value={formState.day} onChange={handleInputChange} className="w-1/2 p-2 border rounded-lg">
                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <input type="time" name="time" value={formState.time} onChange={handleInputChange} className="w-1/2 p-2 border rounded-lg" required />
                </div>
                <div className="flex items-center gap-2">
                     <input type="checkbox" id="homegroup-check" name="isHomegroup" checked={formState.isHomegroup} onChange={handleInputChange} className="h-5 w-5 rounded border-light-stone text-serene-teal focus:ring-teal-500"/>
                     <label htmlFor="homegroup-check" className="text-sm font-medium text-deep-charcoal/80">Set as Homegroup</label>
                </div>
                <div className="flex gap-2">
                    {isEditing && <button type="button" onClick={resetForm} className="w-1/2 bg-light-stone/70 text-deep-charcoal font-bold py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>}
                    <button type="submit" className="w-full bg-serene-teal text-white font-bold py-2 px-4 rounded-lg hover:brightness-95">{isEditing ? 'Update Meeting' : 'Add Meeting'}</button>
                </div>
            </form>

            <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg text-deep-charcoal/80">My Meetings</h3>
                 <div className="flex items-center gap-2 p-1 bg-light-stone/50 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><ViewListIcon className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('calendar')} className={`p-1 rounded-md ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}><ViewGridIcon className="w-5 h-5"/></button>
                 </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? <Spinner /> : (meetings.length > 0 ? (
                    viewMode === 'list' ? renderMeetingList() : renderCalendarView()
                ) : (
                    <p className="text-deep-charcoal/60 text-center py-4">You haven't added any meetings yet.</p>
                ))}
            </div>

            <MeetingFinder />
        </div>
    );
};

export const Resources = () => ( 
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-deep-charcoal mb-2">S.O.S. Resources</h2>
        <p className="text-deep-charcoal/70 mb-6">You are not alone. Help is available.</p>
        <ul className="space-y-4"> 
            {[{ name: "SAMHSA National Helpline", number: "1-800-662-4357", description: "Confidential free help to find substance use treatment and information." }, 
              { name: "National Suicide Prevention Lifeline", number: "988", description: "24/7, free and confidential support for people in distress." }, 
              { name: "Alcoholics Anonymous (A.A.)", link: "https://www.aa.org", description: "Find local and online meetings and resources." }, 
              { name: "Narcotics Anonymous (N.A.)", link: "https://www.na.org", description: "Find local and online meetings and resources." }
            ].map(item => ( 
                <li key={item.name} className="p-4 bg-pure-white/60 rounded-lg shadow-sm">
                    <h3 className="font-bold text-serene-teal">{item.name}</h3>
                    <p className="text-deep-charcoal/70 my-1">{item.description}</p>
                    {item.number && <a href={`tel:${item.number}`} className="text-blue-600 font-semibold hover:underline">{item.number}</a>}
                    {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">Visit Website</a>}
                </li> 
            ))}
        </ul>
    </div> 
);

const MeetingFinder = () => {
    const [selectedFellowship, setSelectedFellowship] = React.useState('AA');
    const [isCollapsed, setIsCollapsed] = useState(true);
    const selectedData = MEETING_LINKS[selectedFellowship];

    return (
        <div className="border-t mt-6 pt-4">
             <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex justify-between items-center font-bold text-lg text-deep-charcoal/80"
            >
                Find New Meetings (External)
                {isCollapsed ? <ChevronDown /> : <ChevronUp />}
            </button>
            {!isCollapsed && (
                 <div className="mt-4 animate-fade-in">
                    <p className="text-deep-charcoal/70 mb-4 text-sm">Access official external resources to find local meetings in your area.</p>
                    <div className="space-y-4 mb-8">
                        <label className="block text-sm font-medium text-deep-charcoal/80">Select Fellowship:</label>
                        <select 
                            value={selectedFellowship}
                            onChange={(e) => setSelectedFellowship(e.target.value)}
                            className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        >
                            {Object.keys(MEETING_LINKS).map(key => (
                                <option key={key} value={key}>{MEETING_LINKS[key].name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedData && (
                        <div className="bg-serene-teal/10 p-4 rounded-lg border-l-4 border-serene-teal space-y-3">
                            <h3 className="text-lg font-bold text-serene-teal">{selectedData.name} Search</h3>
                            <p className="text-deep-charcoal/80 text-sm">{selectedData.instructions}</p>
                            <a 
                                href={selectedData.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full py-2 px-4 text-white font-semibold bg-serene-teal rounded-lg shadow-md hover:brightness-95"
                            >
                                Go to Official Finder
                            </a>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};
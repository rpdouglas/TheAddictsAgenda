import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { MEETING_LINKS } from '../utils/data.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, ChevronDown, ChevronUp, TrashIcon, CheckIcon, StarIcon, ViewGridIcon, ViewListIcon } from '../utils/icons.jsx';

// --- Main Component ---
export const MeetingManagement = ({ onBack }) => {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    
    // Form State
    const [meetingName, setMeetingName] = useState('');
    const [meetingDay, setMeetingDay] = useState('Sunday');
    const [meetingTime, setMeetingTime] = useState('');
    const [isHomegroup, setIsHomegroup] = useState(false);

    // --- Data Persistence ---
    const loadMeetings = useCallback(() => {
        const storedMeetings = LocalDataStore.load(LocalDataStore.KEYS.MEETINGS) || [];
        setMeetings(storedMeetings);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const saveMeetings = (updatedMeetings) => {
        setMeetings(updatedMeetings);
        LocalDataStore.save(LocalDataStore.KEYS.MEETINGS, updatedMeetings);
    };
    
    // --- Handlers ---
    const handleAddMeeting = (e) => {
        e.preventDefault();
        if (!meetingName.trim() || !meetingTime) return;

        const newMeeting = {
            id: LocalDataStore.generateId(),
            name: meetingName,
            day: meetingDay,
            time: meetingTime,
            isHomegroup: isHomegroup,
        };
        
        let updatedMeetings = [...meetings, newMeeting];

        if (isHomegroup) {
            updatedMeetings = updatedMeetings.map(m => 
                m.id === newMeeting.id ? m : { ...m, isHomegroup: false }
            );
        }

        saveMeetings(updatedMeetings);

        setMeetingName('');
        setMeetingDay('Sunday');
        setMeetingTime('');
        setIsHomegroup(false);
    };

    const handleDeleteMeeting = (id) => {
        saveMeetings(meetings.filter(m => m.id !== id));
    };

    const handleSetHomegroup = (id) => {
        saveMeetings(meetings.map(m => ({ ...m, isHomegroup: m.id === id })));
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // --- Render Views ---
    const renderMeetingList = () => (
        <ul className="space-y-3">
            {meetings.sort((a,b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.time.localeCompare(b.time)).map(m => (
                <li key={m.id} className={`p-3 rounded-lg flex items-center justify-between ${m.isHomegroup ? 'bg-yellow-100 border border-yellow-300' : 'bg-white border'}`}>
                    <div>
                        <p className="font-semibold text-gray-800">{m.name}</p>
                        <p className="text-sm text-gray-600">{m.day} at {m.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => handleSetHomegroup(m.id)} title="Set as Homegroup">
                            <StarIcon className={`w-6 h-6 ${m.isHomegroup ? 'text-yellow-500 fill-current' : 'text-gray-400 hover:text-yellow-500'}`} />
                         </button>
                         <button onClick={() => handleDeleteMeeting(m.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </li>
            ))}
        </ul>
    );

    const renderCalendarView = () => (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {daysOfWeek.map(day => (
                <div key={day} className="border rounded-lg p-2 bg-gray-50 min-h-[100px]">
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
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Meeting Management</h2>
            
            <form onSubmit={handleAddMeeting} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 mb-6">
                <h3 className="font-bold text-lg text-gray-700">Add a New Meeting</h3>
                <input type="text" value={meetingName} onChange={e => setMeetingName(e.target.value)} placeholder="Meeting Name (e.g., 'Sunrise Sobriety')" className="w-full p-2 border rounded-lg" required />
                <div className="flex gap-2">
                    <select value={meetingDay} onChange={e => setMeetingDay(e.target.value)} className="w-1/2 p-2 border rounded-lg">
                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)} className="w-1/2 p-2 border rounded-lg" required />
                </div>
                <div className="flex items-center gap-2">
                     <input type="checkbox" id="homegroup-check" checked={isHomegroup} onChange={e => setIsHomegroup(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                     <label htmlFor="homegroup-check" className="text-sm font-medium text-gray-700">Set as Homegroup</label>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700">Add Meeting</button>
            </form>

            <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg text-gray-700">My Meetings</h3>
                 <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><ViewListIcon className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('calendar')} className={`p-1 rounded-md ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}><ViewGridIcon className="w-5 h-5"/></button>
                 </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? <Spinner /> : (meetings.length > 0 ? (
                    viewMode === 'list' ? renderMeetingList() : renderCalendarView()
                ) : (
                    <p className="text-gray-500 text-center py-4">You haven't added any meetings yet.</p>
                ))}
            </div>

            <MeetingFinder />
        </div>
    );
};

export const Resources = () => ( 
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">S.O.S. Resources</h2>
        <p className="text-gray-600 mb-6">You are not alone. Help is available.</p>
        <ul className="space-y-4"> 
            {[{ name: "SAMHSA National Helpline", number: "1-800-662-4357", description: "Confidential free help to find substance use treatment and information." }, 
              { name: "National Suicide Prevention Lifeline", number: "988", description: "24/7, free and confidential support for people in distress." }, 
              { name: "Alcoholics Anonymous (A.A.)", link: "https://www.aa.org", description: "Find local and online meetings and resources." }, 
              { name: "Narcotics Anonymous (N.A.)", link: "https://www.na.org", description: "Find local and online meetings and resources." }
            ].map(item => ( 
                <li key={item.name} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <h3 className="font-bold text-teal-700">{item.name}</h3>
                    <p className="text-gray-600 my-1">{item.description}</p>
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
                className="w-full flex justify-between items-center font-bold text-lg text-gray-700"
            >
                Find New Meetings (External)
                {isCollapsed ? <ChevronDown /> : <ChevronUp />}
            </button>
            {!isCollapsed && (
                 <div className="mt-4 animate-fade-in">
                    <p className="text-gray-600 mb-4 text-sm">Access official external resources to find local meetings in your area.</p>
                    <div className="space-y-4 mb-8">
                        <label className="block text-sm font-medium text-gray-700">Select Fellowship:</label>
                        <select 
                            value={selectedFellowship}
                            onChange={(e) => setSelectedFellowship(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        >
                            {Object.keys(MEETING_LINKS).map(key => (
                                <option key={key} value={key}>{MEETING_LINKS[key].name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedData && (
                        <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 space-y-3">
                            <h3 className="text-lg font-bold text-teal-800">{selectedData.name} Search</h3>
                            <p className="text-gray-700 text-sm">{selectedData.instructions}</p>
                            <a 
                                href={selectedData.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full py-2 px-4 text-white font-semibold bg-teal-600 rounded-lg shadow-md hover:bg-teal-700"
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
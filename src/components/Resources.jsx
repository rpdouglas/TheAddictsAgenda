import React from 'react';
import { MEETING_LINKS } from '../utils/data.js';

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

export const MeetingFinder = () => {
    const [selectedFellowship, setSelectedFellowship] = React.useState('AA');

    const selectedData = MEETING_LINKS[selectedFellowship];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Meeting Finder</h2>
            <p className="text-gray-600 mb-6">Access official external resources to **find local meetings** in your area.</p>
            
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
                <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500 space-y-4">
                    <h3 className="text-xl font-bold text-teal-800">{selectedData.name} Search</h3>
                    <p className="text-gray-700">{selectedData.instructions}</p>
                    <a 
                        href={selectedData.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full py-3 px-4 text-white font-semibold bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                    >
                        Go to Official Finder
                    </a>
                </div>
            )}
            
            <div className="mt-8 text-sm text-gray-500 border-t pt-4">
                <p>Tip: When the external site opens, use their geolocation features or search fields to find meetings near you.</p>
            </div>
        </div>
    );
};

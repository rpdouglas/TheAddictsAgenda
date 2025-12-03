// src/components/UserGuide.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ChevronDown, ChevronUp, BookOpenIcon, DownloadIcon, ShieldIcon, ScaleIcon } from '../utils/icons.jsx';
import jsPDF from 'jspdf';

// --- Import Content Components ---
import GuideDashboard from './guide/GuideDashboard.jsx';
import GuideJournal from './guide/GuideJournal.jsx';
import GuideCoping from './guide/GuideCoping.jsx';
import GuideWorkbook from './guide/GuideWorkbook.jsx';
import GuideLiterature from './guide/GuideLiterature.jsx';
import GuideToDo from './guide/GuideToDo.jsx';
import GuideChallenge from './guide/GuideChallenge.jsx';
import GuideMeetings from './guide/GuideMeetings.jsx';
import GuideResources from './guide/GuideResources.jsx';
import GuideSettings from './guide/GuideSettings.jsx';
import GuideDataSecurity from './guide/GuideDataSecurity.jsx';
import GuidePrivacy from './guide/GuidePrivacy.jsx';

// --- Helper Component for Collapsible Sections ---
const CollapsibleSection = ({ id, title, children, isOpen, onToggle, sectionRef, icon }) => (
    <section ref={sectionRef} id={id} className="border-b border-gray-200 last:border-0 scroll-mt-20">
        <button
            onClick={() => onToggle(id)}
            className="w-full flex justify-between items-center py-6 text-left group focus:outline-none"
        >
            <div className="flex items-center gap-3">
                {icon && <div className="text-teal-600">{icon}</div>}
                <h2 className="text-2xl font-bold text-teal-700 group-hover:text-teal-800 transition-colors">
                    {title}
                </h2>
            </div>
            <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-teal-100 text-teal-700' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
        </button>
        
        {isOpen && (
            <div className="pb-8 animate-fade-in text-gray-700 leading-relaxed px-2">
                {children}
            </div>
        )}
    </section>
);

const UserGuide = ({ onBack, targetSection }) => {
    // --- Refs for Scrolling ---
    const dashboardRef = useRef(null);
    const journalRef = useRef(null);
    const copingRef = useRef(null);
    const workbookRef = useRef(null);
    const literatureRef = useRef(null);
    const goalsRef = useRef(null);
    const challengeRef = useRef(null);
    const meetingsRef = useRef(null);
    const resourcesRef = useRef(null);
    const settingsRef = useRef(null);
    const dataRef = useRef(null);
    const privacyRef = useRef(null);

    const sectionRefs = {
        'dashboard': dashboardRef,
        'journal': journalRef,
        'coping': copingRef,
        'workbook': workbookRef,
        'literature': literatureRef,
        'goals': goalsRef,
        'challenge': challengeRef,
        'meetings': meetingsRef,
        'resources': resourcesRef,
        'settings': settingsRef,
        'data': dataRef,
        'privacy': privacyRef,
    };

    // --- State for Expanded Sections ---
    const [expandedSections, setExpandedSections] = useState({
        'dashboard': false,
        'journal': false,
        'coping': false,
        'workbook': false,
        'literature': false,
        'goals': false,
        'challenge': false,
        'meetings': false,
        'resources': false,
        'settings': false,
        'data': false,
        'privacy': false,
    });

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const expandAndScrollTo = (id) => {
        setExpandedSections(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            if (sectionRefs[id] && sectionRefs[id].current) {
                sectionRefs[id].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    useEffect(() => {
        if (targetSection && sectionRefs[targetSection]) {
            expandAndScrollTo(targetSection);
        } else {
            setExpandedSections(prev => ({ ...prev, 'dashboard': true }));
            window.scrollTo(0, 0);
        }
    }, [targetSection]);

    // --- PDF Download Logic ---
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setProperties({
            title: 'My Recovery Toolkit - User Guide',
            subject: 'User Manual & Privacy Policy',
            author: 'My Recovery Toolkit'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxTextWidth = pageWidth - (margin * 2);
        let y = 20;

        const addText = (text, size = 12, style = 'normal', color = [0, 0, 0]) => {
            if (y > 280) { doc.addPage(); y = 20; }
            doc.setFontSize(size);
            doc.setFont('helvetica', style);
            doc.setTextColor(...color);
            
            const splitText = doc.splitTextToSize(text, maxTextWidth);
            doc.text(splitText, margin, y);
            y += (splitText.length * size * 0.4) + 6;
        };

        addText('My Recovery Toolkit', 24, 'bold', [13, 148, 136]); 
        addText('User Guide & Privacy Policy', 16, 'normal');
        addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, 'italic', [100, 100, 100]);
        y += 10;

        addText('Overview', 16, 'bold');
        addText('This document contains instructions for using the app, explaining how your data is handled, and our privacy commitment.');
        y += 10;

        addText('1. Data & Security', 14, 'bold');
        addText('Your data is stored locally on your device by default ("Local-First"). If you enable encryption, your data is scrambled using AES-256 encryption. Your PIN is the key. We do not store your PIN.');
        y += 10;

        addText('2. Privacy Policy', 14, 'bold');
        addText('We do not collect personal data. All journal entries, workbook answers, and inventory lists remain on your device unless you explicitly export them.');
        y += 10;

        addText('3. Medical Disclaimer', 14, 'bold');
        addText('My Recovery Toolkit is a self-help companion tool. It is NOT a substitute for professional medical advice, diagnosis, or treatment.');

        doc.save('My_Recovery_Toolkit_User_Guide.pdf');
    };

    // --- TOC Data ---
    const tocItems = [
        { id: 'dashboard', label: 'Dashboard & Sobriety' },
        { id: 'journal', label: 'Daily Journal' },
        { id: 'coping', label: 'Coping Tools' },
        { id: 'workbook', label: 'Recovery Workbook' },
        { id: 'literature', label: 'Literature Library' },
        { id: 'goals', label: 'To-Do List' },
        { id: 'challenge', label: '90-Day Challenge' },
        { id: 'meetings', label: 'Meeting Management' },
        { id: 'resources', label: 'Emergency Resources' },
        { id: 'settings', label: 'Settings' },
        { id: 'data', label: 'Data & Security' },
        { id: 'privacy', label: 'Privacy & Legal' },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col overflow-y-auto">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 flex-shrink-0 gap-4">
                <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to App</span>
                </button>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <h1 className="text-2xl font-bold text-gray-800 flex-grow sm:flex-grow-0">User Guide</h1>
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-teal-200 transition-colors"
                        title="Download as PDF"
                    >
                        <DownloadIcon className="w-4 h-4"/> <span>Download PDF</span>
                    </button>
                </div>
            </div>

            <p className="text-gray-600 mb-8">
                Welcome to <strong>My Recovery Toolkit</strong>. This guide covers all features designed to support your journey of self-discovery, structure, and sobriety.
            </p>

            {/* --- TABLE OF CONTENTS --- */}
            <nav className="mb-10 p-5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-deep-charcoal border-b border-gray-200 pb-2">
                    <BookOpenIcon className="w-5 h-5 text-teal-600"/>
                    <h2 className="font-bold text-lg">Table of Contents</h2>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {tocItems.map(item => (
                        <li key={item.id}>
                            <button 
                                onClick={() => expandAndScrollTo(item.id)}
                                className="text-left text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium transition-colors"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="space-y-2">
                <CollapsibleSection id="dashboard" title="Dashboard & Sobriety" isOpen={expandedSections['dashboard']} onToggle={toggleSection} sectionRef={dashboardRef}>
                    <GuideDashboard />
                </CollapsibleSection>

                <CollapsibleSection id="journal" title="Daily Journal" isOpen={expandedSections['journal']} onToggle={toggleSection} sectionRef={journalRef}>
                    <GuideJournal />
                </CollapsibleSection>

                <CollapsibleSection id="coping" title="Coping Tools" isOpen={expandedSections['coping']} onToggle={toggleSection} sectionRef={copingRef}>
                    <GuideCoping />
                </CollapsibleSection>

                <CollapsibleSection id="workbook" title="Recovery Workbook" isOpen={expandedSections['workbook']} onToggle={toggleSection} sectionRef={workbookRef}>
                    <GuideWorkbook />
                </CollapsibleSection>

                <CollapsibleSection id="literature" title="Literature Library" isOpen={expandedSections['literature']} onToggle={toggleSection} sectionRef={literatureRef}>
                    <GuideLiterature />
                </CollapsibleSection>

                <CollapsibleSection id="goals" title="To-Do List" isOpen={expandedSections['goals']} onToggle={toggleSection} sectionRef={goalsRef}>
                    <GuideToDo />
                </CollapsibleSection>

                <CollapsibleSection id="challenge" title="90-Day Challenge" isOpen={expandedSections['challenge']} onToggle={toggleSection} sectionRef={challengeRef}>
                    <GuideChallenge />
                </CollapsibleSection>
                
                <CollapsibleSection id="meetings" title="Meeting Management" isOpen={expandedSections['meetings']} onToggle={toggleSection} sectionRef={meetingsRef}>
                    <GuideMeetings />
                </CollapsibleSection>

                <CollapsibleSection id="resources" title="Emergency Resources" isOpen={expandedSections['resources']} onToggle={toggleSection} sectionRef={resourcesRef}>
                    <GuideResources />
                </CollapsibleSection>

                <CollapsibleSection id="settings" title="Settings" isOpen={expandedSections['settings']} onToggle={toggleSection} sectionRef={settingsRef}>
                    <GuideSettings />
                </CollapsibleSection>

                <CollapsibleSection id="data" title="Data & Security" isOpen={expandedSections['data']} onToggle={toggleSection} sectionRef={dataRef} icon={<ShieldIcon className="w-6 h-6" />}>
                    <GuideDataSecurity />
                </CollapsibleSection>

                <CollapsibleSection id="privacy" title="Privacy Policy & Legal" isOpen={expandedSections['privacy']} onToggle={toggleSection} sectionRef={privacyRef} icon={<ScaleIcon className="w-6 h-6" />}>
                    <GuidePrivacy />
                </CollapsibleSection>
            </div>
            
            <div className="mt-12 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                <p>My Recovery Toolkit User Guide</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default UserGuide;
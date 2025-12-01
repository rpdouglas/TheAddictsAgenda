// src/components/BreathingExercise.jsx

import React, { useState, useEffect, useRef } from 'react';
import './BreathingExercise.css';
import { ArrowLeftIcon } from '../utils/icons.jsx';


// --- Configuration for different breathing exercises ---
const exercises = {
  box: {
    name: 'Box Breathing',
    pattern: [
      { phase: 'in', duration: 4, text: 'Breathe In...' },
      { phase: 'hold', duration: 4, text: 'Hold...' },
      { phase: 'out', duration: 4, text: 'Breathe Out...' },
      { phase: 'hold', duration: 4, text: 'Hold...' },
    ],
  },
  '4-7-8': {
    name: '4-7-8 Breathing',
    pattern: [
      { phase: 'in', duration: 4, text: 'Breathe In...' },
      { phase: 'hold', duration: 7, text: 'Hold...' },
      { phase: 'out', duration: 8, text: 'Breathe Out...' },
    ],
  },
};

const BreathingExercise = ({ onBack, onJournal }) => {
  const [selectedExercise, setSelectedExercise] = useState('box');
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(exercises[selectedExercise].pattern[0].duration);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Use refs to avoid stale state in setInterval closure
  const intervalRef = useRef(null);
  const phaseIndexRef = useRef(phaseIndex);
  const selectedExerciseRef = useRef(selectedExercise);

  // Update refs when state changes
  useEffect(() => {
    phaseIndexRef.current = phaseIndex;
    selectedExerciseRef.current = selectedExercise;
  }, [phaseIndex, selectedExercise]);
  
  // --- Main timer logic ---
  useEffect(() => {
    if (isRunning) {
      const pattern = exercises[selectedExerciseRef.current].pattern;
      setCountdown(pattern[phaseIndexRef.current].duration);

      intervalRef.current = setInterval(() => {
        // Increment session duration
        setTotalSeconds(s => s + 1);

        setCountdown(prevCount => {
          if (prevCount <= 1) {
            // Haptic Feedback on Phase Change
            if (navigator.vibrate) {
                navigator.vibrate(50); // Short 50ms vibration
            }

            // Move to the next phase
            const nextPhaseIndex = (phaseIndexRef.current + 1) % pattern.length;
            setPhaseIndex(nextPhaseIndex);
            return exercises[selectedExerciseRef.current].pattern[nextPhaseIndex].duration;
          }
          return prevCount - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount or isRunning change
  }, [isRunning]);

  const resetExercise = () => {
      setIsRunning(false);
      setPhaseIndex(0);
      setCountdown(exercises[selectedExercise].pattern[0].duration);
      setTotalSeconds(0);
      setShowCompletion(false);
  }

  const handleStart = () => {
    setIsRunning(true);
    setShowCompletion(false);
    // If restarting after completion, ensure reset
    if (totalSeconds > 0 && !isRunning) {
        setTotalSeconds(0);
        setPhaseIndex(0);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowCompletion(true);
  };

  const handleSelectExercise = (key) => {
    setSelectedExercise(key);
    resetExercise();
  };

  const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (mins > 0) return `${mins}m ${secs}s`;
      return `${secs}s`;
  };

  const currentPattern = exercises[selectedExercise].pattern;
  const currentPhase = currentPattern[phaseIndex];
  const animationClass = currentPhase.phase === 'in' ? 'grow' : currentPhase.phase === 'out' ? 'shrink' : '';

  // --- Render Logic ---

  if (showCompletion) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col items-center justify-center">
             <div className="bg-green-50 p-8 rounded-full mb-6">
                <span className="text-4xl">🧘</span>
             </div>
             <h2 className="text-2xl font-bold text-teal-800 mb-2">Session Complete</h2>
             <p className="text-gray-600 mb-6 text-center">
                 You spent <strong>{formatDuration(totalSeconds)}</strong> practicing {exercises[selectedExercise].name}.
             </p>

             <div className="w-full max-w-xs space-y-3">
                 <button 
                    onClick={() => onJournal(exercises[selectedExercise].name, formatDuration(totalSeconds))}
                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg shadow hover:bg-teal-700 transition-colors"
                 >
                    Log to Journal
                 </button>
                 <button 
                    onClick={resetExercise}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                    Restart Exercise
                 </button>
                 <button 
                    onClick={onBack}
                    className="w-full text-gray-500 font-medium py-2 hover:text-gray-700"
                 >
                    Back to Tools
                 </button>
             </div>
        </div>
      );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
        <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
            <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Coping Tools</span>
        </button>
        <div className="breathing-container">
          <h2 className="breathing-title">Breathing Exercise</h2>
          <p className="breathing-subtitle">{exercises[selectedExercise].name}</p>

          <div className="exercise-selector">
            {Object.keys(exercises).map((key) => (
              <button
                key={key}
                className={`selector-btn ${selectedExercise === key ? 'active' : ''}`}
                onClick={() => handleSelectExercise(key)}
                disabled={isRunning}
              >
                {exercises[key].name}
              </button>
            ))}
          </div>

          <div className="visualizer-wrapper">
            <div
              className={`visualizer-circle ${animationClass}`}
              style={{ transitionDuration: `${currentPhase.duration}s` }}
            >
              <div className="visualizer-text">
                <span>{currentPhase.text}</span>
                <span className="visualizer-countdown">{countdown}</span>
              </div>
            </div>
          </div>

          <button onClick={isRunning ? handleStop : handleStart} className="control-btn">
            {isRunning ? 'Stop & Finish' : 'Start'}
          </button>
        </div>
    </div>
  );
};

export default BreathingExercise;
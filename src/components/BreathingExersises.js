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

const BreathingExercise = ({ onBack }) => {
  const [selectedExercise, setSelectedExercise] = useState('box');
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(exercises[selectedExercise].pattern[0].duration);

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
        setCountdown(prevCount => {
          if (prevCount <= 1) {
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
  }

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleSelectExercise = (key) => {
    setSelectedExercise(key);
    resetExercise();
  };

  const currentPattern = exercises[selectedExercise].pattern;
  const currentPhase = currentPattern[phaseIndex];
  const animationClass = currentPhase.phase === 'in' ? 'grow' : currentPhase.phase === 'out' ? 'shrink' : '';

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

          <button onClick={handleStartStop} className="control-btn">
            {isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
    </div>
  );
};

export default BreathingExercise;
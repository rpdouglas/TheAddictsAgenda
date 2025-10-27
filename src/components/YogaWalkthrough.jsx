import React, { useState } from 'react';
import '../YogaWalkthrough.css';
import { ArrowLeftIcon } from '../utils/icons.jsx';

// --- Data for the Yoga Poses ---
// UPDATED: Image paths are now absolute from the public directory.
const yogaPoses = [
  {
    name: 'Mountain Pose (Tadasana)',
    description: 'Stand with your feet together, ground down through your feet, and lengthen your spine. Keep your shoulders relaxed and arms by your sides. This is a foundational pose for balance and posture.',
    imgSrc: '/images/mountain-pose.png'
  },
  {
    name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
    description: 'Start on your hands and knees. Lift your hips up and back to form an inverted V-shape. Press firmly into your hands and heels. It helps to stretch the entire body.',
    imgSrc: '/images/downward-dog.png'
  },
  {
    name: 'Warrior II (Virabhadrasana II)',
    description: 'Step your feet wide apart. Turn your right foot out 90 degrees and your left foot in slightly. Bend your right knee over your right ankle and extend your arms parallel to the floor.',
    imgSrc: '/images/warrior-two.png'
  },
  {
    name: 'Triangle Pose (Trikonasana)',
    description: 'From Warrior II, straighten your front leg. Hinge at your hip to reach forward, then bring your front hand down to your shin or the floor. Extend the other arm towards the ceiling.',
    imgSrc: '/images/triangle-pose.png'
  },
  {
    name: 'Child\'s Pose (Balasana)',
    description: 'Kneel on the floor, sit back on your heels, and then fold forward, resting your forehead on the floor. This is a gentle resting pose that calms the mind and body.',
    imgSrc: '/images/childs-pose.png'
  }
];

// --- The React Component ---
const YogaWalkthrough = ({ onBack }) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);

  const handleNext = () => {
    setCurrentPoseIndex(prevIndex => Math.min(prevIndex + 1, yogaPoses.length - 1));
  };

  const handlePrevious = () => {
    setCurrentPoseIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const currentPose = yogaPoses[currentPoseIndex];
  const isAtStart = currentPoseIndex === 0;
  const isAtEnd = currentPoseIndex === yogaPoses.length - 1;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
        <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
            <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Coping Tools</span>
        </button>
        <div className="yoga-walkthrough-container">
          <h2>Basic Yoga Flow</h2>
          <div className="yoga-card">
            <img src={currentPose.imgSrc} alt={currentPose.name} className="yoga-image" />
            <div className="yoga-content">
              <h3>{`${currentPoseIndex + 1}. ${currentPose.name}`}</h3>
              <p>{currentPose.description}</p>
            </div>
          </div>
          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={isAtStart}>
              Previous
            </button>
            <button onClick={handleNext} disabled={isAtEnd}>
              Next
            </button>
          </div>
        </div>
    </div>
  );
};

export default YogaWalkthrough;
import React, { useState, useEffect } from 'react';
import './App.css'; 
import PlayerStatus from './PlayerStatus';
import LocationBoard from './LocationBoard';
import GameLog from './GameLog';

// --- GAME DATA STRUCTURES ---

const JOB_DATA = [
    { id: 1, title: 'Janitor', wage: 10, timeCost: 6, educationReq: 0, nextJobId: 2, title_recovery: 'Janitorial Role' },
    { id: 2, title: 'Fast Food Cook', wage: 15, timeCost: 6, educationReq: 5, nextJobId: 3, title_recovery: 'Service Position' },
    { id: 3, title: 'Butcher', wage: 30, timeCost: 8, educationReq: 20, nextJobId: 4, title_recovery: 'Skilled Work' },
    { id: 4, title: 'Machinist Assistant', wage: 45, timeCost: 8, educationReq: 35, nextJobId: 5, title_recovery: 'Technical Assistant' },
    { id: 5, title: 'Engineer', wage: 80, timeCost: 7, educationReq: 60, nextJobId: 6, title_recovery: 'Professional Specialist' },
    { id: 6, title: 'General Manager', wage: 120, timeCost: 6, educationReq: 85, nextJobId: null, title_recovery: 'Program Coordinator' },
];

const UNIVERSITY_COURSES = [
    { name: 'Foundational Skills', cost: 200, time: 10, educationGain: 20, level: 1 },
    { name: 'Communication/Coping', cost: 500, time: 15, educationGain: 30, level: 2 },
    { name: 'Self-Efficacy Training', cost: 1000, time: 20, educationGain: 50, level: 3 },
    { name: 'Advanced Career Readiness', cost: 2500, time: 25, educationGain: 70, level: 4 },
    { name: 'Personal Mastery', cost: 5000, time: 30, educationGain: 100, level: 5 },
];

const SHOP_ITEMS = [
    { id: 'fridge', name: 'Meal Prep Kit', cost: 300, wellbeing: 10, type: 'food_saver', desc_recovery: 'Allows for healthy, cost-effective eating.' },
    { id: 'computer', name: 'Creative Outlet', cost: 800, wellbeing: 15, type: 'passive_income', desc_recovery: 'Provides passive income through positive side-hustles.' },
    { id: 'hottub', name: 'Premium Self-Care Item', cost: 1500, wellbeing: 30, type: 'luxury', desc_recovery: 'Significant boost to comfort and relaxation.' },
    { id: 'car', name: 'Reliable Transport', cost: 5000, wellbeing: 50, type: 'luxury_travel', desc_recovery: 'Facilitates easy attendance at appointments/work.' },
];

const RANDOM_EVENTS = [
    { type: 'positive', description: 'A positive connection reinforced your sobriety.', money: 200, wellbeing: 10 },
    { type: 'positive', description: 'Received unexpected support for your recovery efforts.', money: 500, wellbeing: 0 },
    { type: 'positive', description: 'You successfully practiced a difficult coping skill!', money: 0, wellbeing: 15 },
    { type: 'positive', description: 'Stock dividend payout!', money: 100, wellbeing: 0 }, 
    { type: 'negative', description: 'You experienced unexpected stress and had to call a sponsor.', money: -150, wellbeing: -5 },
    { type: 'negative', description: 'An old habit flared up, costing you time and energy.', money: -50, wellbeing: 0 },
    { type: 'negative', description: 'An emergency bill arrived, stressing finances.', money: -250, wellbeing: -10 },
    { type: 'negative', description: 'Negative thought patterns disrupted your day.', money: -200, wellbeing: -5 }, 
    { type: 'neutral', description: 'A quiet, uneventful week of routine maintenance.', money: 0, wellbeing: 0 },
    { type: 'neutral', description: 'Spent the weekend on simple, healthy leisure.', money: 0, wellbeing: 1 },
    { type: 'neutral', description: 'You kept your commitments and upheld structure.', money: 0, wellbeing: 0 },
];

const APARTMENT_TIERS = [
    { id: 1, name: 'Temporary Living', cost: 0, rent: 100, wellbeingBonus: 0, timeCost: 5, details: 'Basic shared living. High rent risk.' },
    { id: 2, name: 'Stable Rental', cost: 5000, rent: 75, wellbeingBonus: 5, timeCost: 4, details: 'Your own space. Reduced rent risk.' },
    { id: 3, name: 'Permanent Residence', cost: 25000, rent: 0, wellbeingBonus: 10, timeCost: 3, details: 'Owned home. Zero rent and maximum stability.' },
];

const DIFFICULTY_LEVELS = {
    EASY: {
        name: 'Stabilization',
        playerStartMoney: 1500,
        playerStartJob: 1,
        goals: { wealth: 150000, career: 'Technical Role' }, 
        jonesAdvantage: 0, 
    },
    NORMAL: {
        name: 'Maintenance',
        playerStartMoney: 500,
        playerStartJob: 1,
        goals: { wealth: 250000, career: 'Leadership Role' },
        jonesAdvantage: 1, 
    },
    HARD: {
        name: 'Thriving',
        playerStartMoney: 100,
        playerStartJob: 1,
        playerStartDebt: 500, 
        goals: { wealth: 500000, career: 'Leadership Role' },
        jonesAdvantage: 2, 
    },
};

const getDefaultState = (levelKey) => {
    const level = DIFFICULTY_LEVELS[levelKey];
    const baseState = {
        week: 1,
        timeRemaining: 40, 
        money: level.playerStartMoney,
        wellbeing: 60, 
        education: 0, 
        currentJob: JOB_DATA[level.playerStartJob - 1], 
        rentDueIn: 4, 
        rentCost: APARTMENT_TIERS[0].rent, 
        livingSituation: APARTMENT_TIERS[0], 
        loanAmount: level.playerStartDebt || 0, 
        interestRate: 0.005, 
        inventory: [], 
        stockShares: 0, 
        stockValue: 10.00, 
        stressLevel: 0, 
        inCrisis: false, 
    };
    
    const jonesJobIndex = Math.min(JOB_DATA.length - 1, level.playerStartJob - 1 + level.jonesAdvantage);
    const jonesState = {
        ...baseState,
        money: baseState.money * 1.5, 
        wellbeing: 65, 
        currentJob: JOB_DATA[jonesJobIndex],
        livingSituation: APARTMENT_TIERS[0], 
    };

    return {
        player: { 
            ...baseState,
            log: [`Welcome to ${level.name} mode! Your goals are set for a path to recovery.`],
        },
        johnG: { 
            ...jonesState,
            log: [], 
        },
        goals: { 
            ...level.goals, 
            education: 100, 
            wellbeing: 100 
        },
        difficulty: levelKey,
    };
};

// --- START OF APP COMPONENT ---
function RecoverySimulatorGame({ onExit }) { 
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('recoveryFastLaneSave'); 
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState && parsedState.player && parsedState.goals) {
             if (parsedState.jones) {
                 parsedState.johnG = parsedState.jones;
                 delete parsedState.jones;
             }
             return parsedState;
        }
      } catch (e) {
        console.error("Error loading state from localStorage:", e);
      }
    }
    return null; 
  });

  // Effect 1: Auto-save the game state whenever it changes
  useEffect(() => {
    if (gameState) {
      const stateToSave = { ...gameState };
      if (stateToSave.jones) {
          stateToSave.johnG = stateToSave.jones;
          delete stateToSave.jones;
      }
      localStorage.setItem('recoveryFastLaneSave', JSON.stringify(stateToSave));
    }
  }, [gameState]);


  // --- AI LOGIC ---
  const runJohnGTurn = () => {
    let ai = gameState.johnG; 
    const gameGoals = gameState.goals;
    let logMessages = [`JOHN G'S TURN (Week ${ai.week}):`]; 
    ai.timeRemaining = 40; 
    let actionsTaken = 0;
    
    const getNextJob = (currentJobId) => JOB_DATA.find(j => j.id === currentJobId + 1);

    // AI Crisis Check
    const aiStress = Math.min(100, Math.max(0, 100 - ai.wellbeing + ai.loanAmount / 100 + ai.stressLevel));
    if (aiStress >= 100) {
        logMessages.push(`JOHN G ENTERED A **CRISIS**! All plans are on hold for recovery.`); 
        ai.wellbeing = 20; 
        ai.stressLevel = 0; 
        ai.inCrisis = true; 
    }
    
    if (ai.inCrisis) {
        logMessages.push(`John G spent the week focused entirely on **Stabilization**.`); 
        ai.wellbeing = Math.min(gameGoals.wellbeing, ai.wellbeing + 15); 
        ai.inCrisis = false;
        ai.timeRemaining = 0;
    }


    while (!ai.inCrisis && ai.timeRemaining > 10 && actionsTaken < 5) {
        actionsTaken++;
        let action = null;
        
        const nextJob = getNextJob(ai.currentJob.id);
        const nextEducationReq = nextJob ? nextJob.educationReq : gameGoals.education;
        const needsEducation = ai.education < nextEducationReq;

        // 1. CRITICAL: Self-Care/Rest if Wellbeing is Low
        if (ai.wellbeing < 50 && ai.timeRemaining >= ai.livingSituation.timeCost) {
            ai.timeRemaining -= ai.livingSituation.timeCost;
            ai.wellbeing = Math.min(gameGoals.wellbeing, ai.wellbeing + 8); 
            logMessages.push(`John G took **time for Self-Care/Meditation** due to low stability.`); 
            action = 'rest';
        } 
        
        // 2. Efficiency Purchase (Fridge)
        if (action === null && !ai.inventory.includes('fridge') && ai.money >= 300 && ai.timeRemaining >= 1) {
            const item = SHOP_ITEMS.find(i => i.id === 'fridge');
            ai.timeRemaining -= 1;
            ai.money -= item.cost;
            ai.inventory.push(item.id);
            logMessages.push(`John G invested in **Meal Prep Kit** for efficiency.`); 
            action = 'buy_fridge';
        }

        // 3. Apartment Upgrade Check (If enough money and not max tier)
        const nextAptTier = APARTMENT_TIERS.find(a => a.id === ai.livingSituation.id + 1);
        if (action === null && nextAptTier && ai.money >= nextAptTier.cost && ai.timeRemaining >= 1) {
            ai.timeRemaining -= 1;
            ai.money -= nextAptTier.cost;
            ai.livingSituation = nextAptTier;
            ai.rentCost = nextAptTier.rent;
            logMessages.push(`John G upgraded to **${nextAptTier.name}** for ${nextAptTier.cost}!`); 
            action = 'upgrade_apt';
        }
        
        // 4. Education/Skill Building
        if (action === null && needsEducation && ai.education < gameGoals.education) {
            const affordableCourses = UNIVERSITY_COURSES
                .filter(c => ai.money >= c.cost && ai.timeRemaining >= c.time)
                .sort((a, b) => b.educationGain - a.educationGain);
            
            if (affordableCourses.length > 0) {
                const course = affordableCourses[0];
                ai.timeRemaining -= course.time;
                ai.money -= course.cost;
                ai.education = Math.min(100, ai.education + course.educationGain);
                logMessages.push(`John G utilized **${course.name}** for skill-building.`); 
                action = 'study';
            }
        } 
        
        // 5. Promotion Check
        if (action === null && nextJob && ai.education >= nextJob.educationReq && ai.timeRemaining >= 2) {
            ai.timeRemaining -= 2;
            ai.currentJob = nextJob;
            logMessages.push(`John G gained a promotion to **${nextJob.title_recovery}**!`); 
            action = 'promote';
        }
        
        // 6. Work (Default action)
        if (action === null) {
            const job = ai.currentJob;
            if (ai.timeRemaining >= job.timeCost) {
                const moneyEarned = job.wage * job.timeCost;
                ai.timeRemaining -= job.timeCost;
                ai.money += moneyEarned;
                logMessages.push(`John G performed **Healthy Engagement** as a **${job.title_recovery}** and earned $${moneyEarned}.`); 
            } else {
                break; 
            }
        }
    } 

    let moneyChange = 0;
    let wellbeingChange = 0; 
    let stressIncrease = 0;

    // End-of-Turn maintenance
    const baseCostOfLiving = 100;
    const foodCostReduction = ai.inventory.includes('fridge') ? 50 : 0;
    const finalCostOfLiving = baseCostOfLiving - foodCostReduction;
    moneyChange -= finalCostOfLiving;
    
    ai.rentDueIn -= 1;
    if (ai.rentDueIn === 0) {
        if (ai.money + moneyChange >= ai.rentCost) {
            moneyChange -= ai.rentCost;
        } else {
            wellbeingChange -= 5;
            stressIncrease += 20; 
        }
        ai.rentDueIn = 4;
    }
    
    // Apply living situation bonus
    wellbeingChange += ai.livingSituation.wellbeingBonus;

    const eventIndex = Math.floor(Math.random() * RANDOM_EVENTS.length);
    const randomEvent = RANDOM_EVENTS[eventIndex];
    moneyChange += randomEvent.money;
    wellbeingChange += randomEvent.wellbeing; 
    logMessages.push(`John G's Unexpected Event: ${randomEvent.description}`); 
    if (randomEvent.wellbeing < 0) stressIncrease += 10; 

    ai.money += moneyChange;
    ai.wellbeing = Math.min(gameGoals.wellbeing, Math.max(0, ai.wellbeing + wellbeingChange - 2)); 
    ai.week++;
    ai.stressLevel = Math.min(100, ai.stressLevel + stressIncrease); 

    let winMessage = null;
    if (ai.money >= gameGoals.wealth && 
        ai.wellbeing >= gameGoals.wellbeing && 
        ai.education >= gameGoals.education &&
        ai.currentJob.title === gameGoals.career) {
            winMessage = `💔 JOHN G WINS! It took John G ${ai.week - 1} weeks! 💔`; 
    }
    
    setGameState(prev => ({ 
        ...prev, 
        johnG: {...ai}, 
        player: { 
            ...prev.player, 
            log: [...prev.player.log, '', ...logMessages, ''] 
        } 
    }));
    
    if (winMessage) {
        alert(winMessage);
        return true;
    }
    return false;
  };


  // --- PLAYER ACTIONS ---

  const handleAction = (handler) => (...args) => {
    setGameState(prev => {
        const player = prev.player;
        const result = handler(player, ...args);
        return {
            ...prev,
            player: result,
        };
    });
  };

  const createPlayerAction = (logic) => (item) => {
    setGameState(prev => {
        const player = prev.player;
        const gameGoals = prev.goals;

        if (player.inCrisis) {
            if (logic === 'other' && item.name === 'Rest') {} else {
                return { ...prev, player: { ...player, log: [...player.log, 'CRISIS MODE: You must focus on **Meditation/Rest** to stabilize!'] } };
            }
        }
        
        let newPlayerState = { ...player };
        let newLog = [...player.log];
        let isActionValid = true;

        const timeCost = item.time || 1; 
        if (newPlayerState.timeRemaining < timeCost) {
            return prev; 
        }
        
        if (logic === 'work') {
            const job = player.currentJob;
            const moneyEarned = job.wage * job.timeCost;
            newPlayerState.timeRemaining -= job.timeCost;
            newPlayerState.money += moneyEarned;
            newPlayerState.wellbeing = Math.max(0, player.wellbeing - 1); 
            newPlayerState.stressLevel = Math.min(100, player.stressLevel + 5); 
            newLog.push(`Performed **Healthy Engagement** as a **${job.title_recovery}** and earned **$${moneyEarned}**.`)
        } else if (logic === 'study') {
            const course = item;
            if (player.money < course.cost) {
                newLog.push(`ERROR: Not enough funds for **${course.name}** (Cost: $${course.cost})!`);
                isActionValid = false;
            } else {
                newPlayerState.timeRemaining -= course.time;
                newPlayerState.money -= course.cost;
                newPlayerState.education = Math.min(100, player.education + course.educationGain);
                newPlayerState.wellbeing = Math.min(gameGoals.wellbeing, player.wellbeing + 2); 
                newLog.push(`Engaged in **Skill Building** using **${course.name}**, gaining ${course.educationGain}% education.`);
            }
        } else if (logic === 'purchase') {
            const itemToBuy = item;
            if (player.money < itemToBuy.cost) {
                newLog.push(`ERROR: Not enough funds to buy **${itemToBuy.name}** (Cost: $${itemToBuy.cost})!`);
                isActionValid = false;
            } else if (player.inventory.includes(itemToBuy.id)) {
                newLog.push(`You already own **${itemToBuy.name}**!`);
                isActionValid = false;
            } else {
                newPlayerState.timeRemaining -= 1;
                newPlayerState.money -= itemToBuy.cost;
                newPlayerState.inventory = [...player.inventory, itemToBuy.id];
                newPlayerState.wellbeing = Math.min(gameGoals.wellbeing, player.wellbeing + itemToBuy.wellbeing); 
                newLog.push(`Invested in **${itemToBuy.name}** for **$${itemToBuy.cost}**. Wellbeing +${itemToBuy.wellbeing}.`);
            }
        }
        
        if (!isActionValid) return prev;

        return { ...prev, player: { ...newPlayerState, log: newLog } };
    });
  };

  const handleJobSearch = () => {
    const jobSearchTime = 2; 
    if (gameState.player.timeRemaining < jobSearchTime || gameState.player.inCrisis) return;

    setGameState(prev => {
        const player = prev.player;
        let newPlayerState = { ...player };
        let newLog = [...player.log];
        
        const currentJobIndex = JOB_DATA.findIndex(j => j.id === player.currentJob.id);
        const nextJob = JOB_DATA[currentJobIndex + 1];

        newLog.push(`Spent ${jobSearchTime} hours reviewing career path options.`);
        newPlayerState.timeRemaining -= jobSearchTime;
        newPlayerState.stressLevel = Math.min(100, player.stressLevel + 5); 
        
        if (nextJob) {
            if (player.education >= nextJob.educationReq) {
                newPlayerState.currentJob = nextJob;
                newLog.push(`SUCCESS! Promoted to **${nextJob.title_recovery}**! Wage: $${nextJob.wage}/hr.`);
            } else {
                newLog.push(`The **${nextJob.title_recovery}** role requires ${nextJob.educationReq}% skill building.`);
            }
        } else {
            newLog.push(`You are currently in the highest available role.`);
        }

        return { ...prev, player: { ...newPlayerState, log: newLog } };
    });
  };

  const handleShadyGig = () => {
      const timeCost = 15; 
      if (gameState.player.timeRemaining < timeCost || gameState.player.inCrisis) return;

      setGameState(prev => {
          const player = prev.player;
          let newPlayerState = { ...player };
          let newLog = [...player.log];
          
          const moneyEarned = 1500;
          const stressGained = 30; 
          const wellbeingLoss = 10; 

          newPlayerState.timeRemaining -= timeCost;
          newPlayerState.money += moneyEarned;
          newPlayerState.stressLevel = Math.min(100, player.stressLevel + stressGained);
          newPlayerState.wellbeing = Math.max(0, player.wellbeing - wellbeingLoss);
          
          newLog.push(`💰 Performed **Shady Side Gig** for **$${moneyEarned}**.`);
          newLog.push(`🚨 WARNING: Stress +${stressGained}, Wellbeing -${wellbeingLoss}. This creates high risk.`);

          return { ...prev, player: { ...newPlayerState, log: newLog } };
      });
  };
  
  const saveAndExit = () => {
    if (gameState) {
        localStorage.setItem('recoveryFastLaneSave', JSON.stringify(gameState));
    }
    onExit(); 
  };

  const endTurn = () => {
    const player = gameState.player;
    const gameGoals = gameState.goals;
    
    const stockPortfolioValue = player.stockShares * player.stockValue;
    const totalWealth = player.money + stockPortfolioValue;

    if (totalWealth >= gameGoals.wealth && 
        player.wellbeing >= gameGoals.wellbeing && 
        player.education >= gameGoals.education &&
        player.currentJob.title === gameGoals.career) {
            alert(`🎉 YOU WIN! It took you ${player.week} weeks to achieve your goals! 🎉`);
            localStorage.removeItem('recoveryFastLaneSave');
            setGameState(null);
            return;
    }
    
    setGameState(prev => {
        let player = prev.player;
        let playerMoneyChange = 0;
        let playerWellbeingChange = 0; 
        let logMessages = [];
        let loanPrincipalIncrease = 0;
        let stressIncrease = 0;
        let inCrisisNextTurn = false;
        
        // 1. **CRISIS CHECK:**
        const currentStress = Math.min(100, Math.max(0, 100 - player.wellbeing + player.loanAmount / 100 + player.stressLevel));

        if (currentStress >= 100 && !player.inCrisis) {
            logMessages.push('🚨 **CRISIS ALERT!** Your stress overwhelmed your stability.');
            playerWellbeingChange -= 30; 
            playerMoneyChange -= 200; 
            inCrisisNextTurn = true;
        }

        // 2. STOCK MARKET
        const newStockValue = updateStockValue(player.stockValue);
        const stockChange = (newStockValue - player.stockValue).toFixed(2);
        logMessages.push(`Investment Update: Price changed by **$${stockChange}** (New Price: $${newStockValue.toFixed(2)}).`);

        // 3. RANDOM EVENT
        const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        playerMoneyChange += randomEvent.money;
        playerWellbeingChange += randomEvent.wellbeing; 
        logMessages.push(`Weekly Event: ${randomEvent.description}`);
        if (randomEvent.wellbeing < 0) stressIncrease += 10; 

        // 4. MAINTENANCE
        if (player.inventory.includes('computer')) playerMoneyChange += 50;
        const costOfLiving = player.inventory.includes('fridge') ? 50 : 100;
        playerMoneyChange -= costOfLiving;
        logMessages.push(`Weekly cost of living: **-$${costOfLiving}**.`);

        // 5. LIVING SITUATION AND LOAN LOGIC
        const nextRentDueIn = player.rentDueIn - 1;
        
        if (nextRentDueIn === 0 && player.livingSituation.rent > 0) { 
            if (player.money + playerMoneyChange >= player.rentCost) {
                playerMoneyChange -= player.rentCost;
                logMessages.push(`Rent Paid: **-$${player.rentCost}**.`);
            } else {
                logMessages.push(`ALERT! Financial stress due to unpaid rent. Wellbeing -5.`);
                playerWellbeingChange -= 5;
                stressIncrease += 20;
            }
        }
        
        if (player.loanAmount > 0) {
            const interestPaid = Math.ceil(player.loanAmount * player.interestRate);
            playerMoneyChange -= interestPaid;
            if (player.money + playerMoneyChange < 0) {
                const shortage = (player.money + playerMoneyChange) * -1;
                loanPrincipalIncrease = shortage;
                playerMoneyChange += shortage; 
            }
            logMessages.push(`Paid **$${Math.ceil(player.loanAmount * player.interestRate)}** in high-risk interest.`);
        }
        
        // Apply Living Situation Wellbeing Bonus
        playerWellbeingChange += player.livingSituation.wellbeingBonus;

        playerWellbeingChange -= 2; // Base Wellbeing Drain

        // 6. CRISIS TURN RESOLUTION
        let newStressLevel = player.stressLevel + stressIncrease;
        let newTimeRemaining = 40;
        let newInCrisis = inCrisisNextTurn;

        if (player.inCrisis) {
            logMessages.push('**STABILIZING:** This week was dedicated to crisis management. Actions were limited.');
            playerWellbeingChange = Math.max(0, playerWellbeingChange + 15); 
            newStressLevel = 0; 
            newTimeRemaining = 0;
            newInCrisis = false; 
        }
        
        const updatedPlayer = {
            ...player,
            week: player.week + 1,
            timeRemaining: newTimeRemaining,
            money: player.money + playerMoneyChange,
            wellbeing: Math.min(prev.goals.wellbeing, Math.max(0, player.wellbeing + playerWellbeingChange)), 
            loanAmount: player.loanAmount + loanPrincipalIncrease, 
            rentDueIn: nextRentDueIn === 0 ? 4 : nextRentDueIn, 
            stockValue: newStockValue,
            stressLevel: Math.min(100, newStressLevel),
            inCrisis: newInCrisis, 
            log: [
                ...player.log, 
                '--- YOUR WEEKLY REVIEW ---',
                ...logMessages,
                `--- Week ${player.week + 1} Starts ---`,
            ],
        };
        
        const updatedGameState = { ...prev, player: updatedPlayer };

        const johnGWon = runJohnGTurn(); 
        if (johnGWon) {
            localStorage.removeItem('recoveryFastLaneSave');
            setGameState(null);
            return updatedGameState;
        }

        return updatedGameState;
    });
  };

  // --- DIFFICULTY SELECTOR COMPONENT (UNCHANGED) ---

  const DifficultySelector = () => {
    const hasSave = localStorage.getItem('recoveryFastLaneSave') !== null;
    
    const loadGame = () => {
        const savedState = localStorage.getItem('recoveryFastLaneSave');
        if (savedState) {
            setGameState(JSON.parse(savedState));
        }
    };
    
    const startNewGame = (levelKey) => {
        localStorage.removeItem('recoveryFastLaneSave');
        setGameState(getDefaultState(levelKey));
    };

    return (
        <div className="difficulty-selector">
            <h2>🧠 Life Management Simulation</h2>
            {hasSave && (
                <button 
                    onClick={loadGame}
                    className="diff-button diff-load"
                    style={{marginBottom: '20px', backgroundColor: '#007bff'}}
                >
                    **LOAD SAVED GAME**
                </button>
            )}
            
            <h3>Select Level:</h3>
            <div className="difficulty-buttons">
            {Object.keys(DIFFICULTY_LEVELS).map(key => {
                const level = DIFFICULTY_LEVELS[key];
                return (
                <button 
                    key={key} 
                    onClick={() => startNewGame(key)}
                    className={`diff-button diff-${key.toLowerCase()}`}
                >
                    <h3>**${level.name}**</h3>
                    <p>Target Stability: 100%</p>
                    <p className="diff-start-info">
                        Start Cash: **$${level.playerStartMoney}** {level.playerStartDebt ? `(Debt: $${level.playerStartDebt})` : ''}
                    </p>
                </button>
                );
            })}
            </div>
        </div>
    );
  };

  if (!gameState) {
    return (
      <div className="App welcome-screen">
        <header className="game-header"><h1>The Recovery Journey</h1></header>
        <DifficultySelector />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="game-header">
        <h1>🧠 Recovery Simulator ({DIFFICULTY_LEVELS[gameState.difficulty].name})</h1>
        <button onClick={saveAndExit} className="btn-exit">
            💾 Save & Exit Tool
        </button>
      </header>
      
      <div className="game-layout">
        <PlayerStatus 
            status={gameState.player} 
            opponentStatus={gameState.johnG} 
            goals={gameState.goals} 
            shopItems={SHOP_ITEMS} 
        />
        
        <LocationBoard 
          gameState={gameState.player} 
          handleWork={createPlayerAction('work')}
          handleStudy={(course) => createPlayerAction('study')(course)}
          handleJobSearch={handleJobSearch}
          handlePurchase={(item) => createPlayerAction('purchase')(item)}
          handlePurchaseApartment={handleAction(handlePurchaseApartmentLogic)} 
          handleOtherAction={handleAction(handleOtherActionLogic, 'Rest')}
          handleTakeLoan={handleAction(handleTakeLoanLogic)}
          handleRepayLoan={handleAction(handleRepayLoanLogic)}
          handleSellItem={handleAction(handleSellItemLogic)}
          handleInvest={handleAction(handleInvestLogic)}
          handleCashOut={handleAction(handleCashOutLogic)}
          handleShadyGig={handleShadyGig} 
          handleMeetingAttendance={handleAction(handleMeetingAttendanceLogic)} 
          endTurn={endTurn}
          courses={UNIVERSITY_COURSES} 
          shopItems={SHOP_ITEMS}      
          apartmentTiers={APARTMENT_TIERS} 
        />
        
        <GameLog log={gameState.player.log} />
      </div>
      
      <footer className="game-footer">
        <p>Goal: First to reach all targets!</p>
      </footer>
    </div>
  );
}

// --- Player Action Handlers (Helper functions - must be defined outside the component) ---

const handleTakeLoanLogic = (player, amount) => {
    const timeCost = 1;
    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money + amount,
        loanAmount: player.loanAmount + amount,
        stressLevel: Math.min(100, player.stressLevel + 10), 
        log: [...player.log, `Took out **High-Risk Stress** for **$${amount}**. Current debt: $${player.loanAmount + amount}.`],
    };
};

const handleRepayLoanLogic = (player, amount) => {
    const timeCost = 1;
    const repayableAmount = Math.min(amount, player.loanAmount, player.money);
    
    if (repayableAmount <= 0) {
        return {
            ...player,
            log: [...player.log, `ERROR: Cannot repay. Check funds or loan amount.`],
        };
    }

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money - repayableAmount,
        loanAmount: player.loanAmount - repayableAmount,
        stressLevel: Math.max(0, player.stressLevel - 10), 
        log: [...player.log, `Repaid **$${repayableAmount}** of the High-Risk Stress. Remaining debt: $${player.loanAmount - repayableAmount}.`],
    };
};

const handleSellItemLogic = (player, itemId) => {
    const timeCost = 1;
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    
    if (!item || !player.inventory.includes(itemId)) return player; 

    const sellPrice = Math.floor(item.cost / 2); 
    const inventoryUpdate = player.inventory.filter(id => id !== itemId);

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money + sellPrice,
        inventory: inventoryUpdate,
        wellbeing: Math.max(0, player.wellbeing - item.wellbeing), 
        stressLevel: Math.min(100, player.stressLevel + 15), 
        log: [...player.log, `Sold **${item.name}** for **$${sellPrice}**. Wellbeing -${item.wellbeing} (Loss of Stability).`],
    };
};

const handleOtherActionLogic = (player, timeCost, moneyChange, wellbeingChange, logMessage, name) => { 
    if (player.money < -moneyChange) { 
        return {
            ...player,
            log: [...player.log, `ERROR: Not enough cash for this purchase!`],
        };
    }

    let stressChange = 0;
    if (name === 'Rest') {
        stressChange = -15; 
        wellbeingChange = 8; 
        timeCost = player.livingSituation.timeCost; 
    } else if (name === 'Quick Fix') {
        stressChange = 5; 
        wellbeingChange = 5;
        timeCost = 1;
    }

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money + moneyChange,
        wellbeing: player.wellbeing + wellbeingChange, 
        stressLevel: Math.max(0, player.stressLevel + stressChange),
        log: [...player.log, logMessage],
    };
};

const handleInvestLogic = (player, amount) => {
    const timeCost = 1;
    if (player.money < amount) return player; 

    const sharesBought = Math.floor(amount / player.stockValue);
    const cost = sharesBought * player.stockValue;

    if (sharesBought === 0) return player; 

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money - cost,
        stockShares: player.stockShares + sharesBought,
        stressLevel: Math.min(100, player.stressLevel + 10), 
        log: [...player.log, `Invested $${cost.toFixed(2)}. Bought **${sharesBought}** shares of high-risk assets.`],
    };
};

const handleCashOutLogic = (player, sharesToSell) => {
    const timeCost = 1;
    if (player.stockShares === 0 || sharesToSell > player.stockShares) return player;
    
    const revenue = sharesToSell * player.stockValue;

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money + revenue,
        stockShares: player.stockShares - sharesToSell,
        stressLevel: Math.max(0, player.stressLevel - 5), 
        log: [...player.log, `Cashed out **${sharesToSell}** shares for **$${revenue.toFixed(2)}**.`],
    };
};

const handlePurchaseApartmentLogic = (player, tier) => {
    const timeCost = 1;

    if (player.money < tier.cost) {
        return { ...player, log: [...player.log, `ERROR: Not enough funds ($${tier.cost}) to secure ${tier.name}!`] };
    }
    
    const wellbeingGain = tier.wellbeingBonus - player.livingSituation.wellbeingBonus;

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        money: player.money - tier.cost,
        livingSituation: tier,
        rentCost: tier.rent,
        wellbeing: Math.min(player.goals.wellbeing, player.wellbeing + wellbeingGain * 2), 
        log: [...player.log, `Upgraded living situation to **${tier.name}** for **$${tier.cost}**. Rent is now $${tier.rent}/4 weeks.`],
    };
};

const handleMeetingAttendanceLogic = (player) => {
    const timeCost = 3; 
    const stressReduction = 20; 
    const wellbeingBoost = 5;

    return {
        ...player,
        timeRemaining: player.timeRemaining - timeCost,
        wellbeing: Math.min(player.goals.wellbeing, player.wellbeing + wellbeingBoost),
        stressLevel: Math.max(0, player.stressLevel - stressReduction),
        log: [...player.log, `Attended a **12-Step Meeting**. Stress -${stressReduction} and Wellbeing +${wellbeingBoost}.`],
    };
};

const updateStockValue = (currentValue) => { 
    const change = (Math.random() * 0.10) - 0.05; 
    let newValue = currentValue * (1 + change);
    newValue = Math.max(1.00, newValue); 
    return newValue;
};

export default RecoverySimulatorGame;
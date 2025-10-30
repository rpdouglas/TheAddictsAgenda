import React, { useState } from 'react';

const LocationBoard = ({
  gameState,
  handleWork,
  handleStudy,
  handleJobSearch,
  handlePurchase,
  handlePurchaseApartment,
  handleOtherAction,
  handleTakeLoan,
  handleRepayLoan,
  handleSellItem,
  handleInvest,
  handleCashOut,
  handleShadyGig,
  handleMeetingAttendance,
  endTurn,
  courses,
  shopItems,
  apartmentTiers,
}) => {
  const [activeLocation, setActiveLocation] = useState(null);
  const [loanAmount, setLoanAmount] = useState(100);
  const [repayAmount, setRepayAmount] = useState(100);
  const [investAmount, setInvestAmount] = useState(100);
  const [cashOutShares, setCashOutShares] = useState(1);

  const { timeRemaining } = gameState;

  const renderMainBoard = () => (
    <div className="location-board">
      <button onClick={() => setActiveLocation('work')} className="btn-action btn-primary">🏢 Work</button>
      <button onClick={() => setActiveLocation('university')} className="btn-action btn-study">🎓 School</button>
      <button onClick={() => setActiveLocation('shop')} className="btn-action btn-buy">🛍️ Shopping</button>
      <button onClick={() => setActiveLocation('apartment')} className="btn-action btn-primary">🏠 Living Situation</button>
      <button onClick={() => setActiveLocation('financials')} className="btn-action btn-primary">💰 Financials</button>
      <button onClick={() => setActiveLocation('risky')} className="btn-action btn-sell">🎲 Risky Area</button>
      <button onClick={() => setActiveLocation('selfCare')} className="btn-action btn-buy">❤️ Self-Care & Support</button>
    </div>
  );

  const renderLocationContent = () => {
    if (activeLocation === 'work') {
      return (
        <div>
          <h3>🏢 At Work</h3>
          <p className="location-details">Engage in healthy work to earn money and build your career path.</p>
          <button onClick={handleWork} disabled={timeRemaining < gameState.currentJob.timeCost} className="btn-action btn-primary">
            Work Your Job ({gameState.currentJob.timeCost} hrs)
          </button>
          <button onClick={handleJobSearch} disabled={timeRemaining < 2} className="btn-action btn-study">
            Search for Better Job (2 hrs)
          </button>
        </div>
      );
    }

    if (activeLocation === 'university') {
      return (
        <div>
          <h3>🎓 At University</h3>
          <p className="location-details">Invest in yourself by taking courses to improve your skills and qualifications.</p>
          {courses.map(course => (
            <button
              key={course.name}
              onClick={() => handleStudy(course)}
              disabled={timeRemaining < course.time || gameState.money < course.cost}
              className="btn-action btn-study"
            >
              {course.name} (${course.cost}, {course.time} hrs)
            </button>
          ))}
        </div>
      );
    }

    if (activeLocation === 'shop') {
        return (
            <div>
                <h3>🛍️ At the Shop</h3>
                <p className="location-details">Purchase items to improve your wellbeing and efficiency.</p>
                {shopItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handlePurchase(item)}
                        disabled={timeRemaining < 1 || gameState.money < item.cost || gameState.inventory.includes(item.id)}
                        className="btn-action btn-buy"
                    >
                        Buy {item.name} (${item.cost}, 1 hr)
                    </button>
                ))}
            </div>
        );
    }

    if (activeLocation === 'apartment') {
        return (
            <div>
                <h3>🏠 Living Situation</h3>
                <p className="location-details">Upgrade your home to improve stability and reduce stress.</p>
                {apartmentTiers.filter(tier => tier.id > gameState.livingSituation.id).map(tier => (
                     <button
                        key={tier.id}
                        onClick={() => handlePurchaseApartment(tier)}
                        disabled={timeRemaining < 1 || gameState.money < tier.cost}
                        className="btn-action btn-primary"
                    >
                        Secure {tier.name} (${tier.cost})
                    </button>
                ))}
            </div>
        );
    }

    if (activeLocation === 'financials') {
        return (
            <div>
                <h3>💰 Financials</h3>
                <p className="location-details">Manage your money, take or repay high-risk loans, and invest.</p>
                <div>
                    <input type="number" value={loanAmount} onChange={e => setLoanAmount(parseInt(e.target.value, 10))} />
                    <button onClick={() => handleTakeLoan(loanAmount)} disabled={timeRemaining < 1} className="btn-action btn-sell">
                        Take Loan (1 hr)
                    </button>
                </div>
                <div>
                    <input type="number" value={repayAmount} onChange={e => setRepayAmount(parseInt(e.target.value, 10))} />
                    <button onClick={() => handleRepayLoan(repayAmount)} disabled={timeRemaining < 1 || gameState.money < repayAmount || gameState.loanAmount <= 0} className="btn-action btn-buy">
                        Repay Loan (1 hr)
                    </button>
                </div>
                 <div>
                    <input type="number" value={investAmount} onChange={e => setInvestAmount(parseInt(e.target.value, 10))} />
                    <button onClick={() => handleInvest(investAmount)} disabled={timeRemaining < 1 || gameState.money < investAmount} className="btn-action btn-study">
                        Invest (1 hr)
                    </button>
                </div>
                <div>
                    <input type="number" value={cashOutShares} onChange={e => setCashOutShares(parseInt(e.target.value, 10))} />
                    <button onClick={() => handleCashOut(cashOutShares)} disabled={timeRemaining < 1 || gameState.stockShares < cashOutShares} className="btn-action btn-primary">
                        Cash Out (1 hr)
                    </button>
                </div>
            </div>
        );
    }
    
    if (activeLocation === 'risky') {
        return (
            <div>
                <h3>🎲 Risky Area</h3>
                <p className="location-details">High-risk, high-reward actions. Can provide quick cash at a high stress cost.</p>
                <button onClick={handleShadyGig} disabled={timeRemaining < 15} className="btn-action btn-sell">
                    Shady Side Gig (15 hrs)
                </button>
            </div>
        );
    }

    if (activeLocation === 'selfCare') {
        return (
            <div>
                <h3>❤️ Self-Care & Support</h3>
                <p className="location-details">Focus on your wellbeing, attend support meetings, and meditate.</p>
                <button onClick={handleMeetingAttendance} disabled={timeRemaining < 3} className="btn-action btn-buy">
                    Attend 12-Step Meeting (3 hrs)
                </button>
                <button onClick={() => handleOtherAction(gameState.livingSituation.timeCost, 0, 8, `Rested for ${gameState.livingSituation.timeCost} hours.`, 'Rest')} disabled={timeRemaining < gameState.livingSituation.timeCost} className="btn-action btn-primary">
                    Rest / Meditate ({gameState.livingSituation.timeCost} hrs)
                </button>
            </div>
        );
    }


    return null;
  };

  return (
    <div className="panel location-board-panel">
      <h3 className="panel-title">Weekly Planner</h3>
      <p className="time-remaining">Time Remaining: {timeRemaining} hours</p>

      {activeLocation ? (
        <div>
          {renderLocationContent()}
          <button onClick={() => setActiveLocation(null)} className="btn-action" style={{backgroundColor: '#6c757d', marginTop: '20px'}}>Back to Planner</button>
        </div>
      ) : (
        renderMainBoard()
      )}

      <div className="end-turn-section">
        <button onClick={endTurn} disabled={timeRemaining <= 0} className="end-turn-button btn-primary">End Week</button>
      </div>
    </div>
  );
};

export default LocationBoard;
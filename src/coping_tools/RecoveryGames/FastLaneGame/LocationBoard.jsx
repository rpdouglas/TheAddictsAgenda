import React from 'react';

const LocationBoard = ({ gameState, handleWork, handleStudy, handleJobSearch, handlePurchase, handlePurchaseApartment, handleSellItem, handleInvest, handleCashOut, handleOtherAction, handleShadyGig, handleMeetingAttendance, endTurn, courses, shopItems, apartmentTiers }) => {
    
    const { timeRemaining, money, currentJob, livingSituation, loanAmount, inventory, stockValue, stockShares, inCrisis } = gameState;
    
    const playerInventory = shopItems.filter(item => inventory.includes(item.id));
    
    const nextApartment = apartmentTiers.find(a => a.id === livingSituation.id + 1);

    const locations = [
        { 
            name: 'Career Path Review', 
            icon: '🏢',
            time: 2, 
            buttonText: 'Review Next Role / Goal', 
            handler: handleJobSearch,
            details: 'Review qualifications for better, higher-paying roles.',
        },
        { 
            name: currentJob.title_recovery, 
            icon: '💼',
            time: currentJob.timeCost, 
            buttonText: `Perform Healthy Engagement ($${currentJob.wage}/hr)`, 
            handler: handleWork,
            details: 'Earning through productive, structured time.',
        },
    ];
    
    const dynamicActionTiles = [
        // --- 12-STEP MEETING TILE (NEW) ---
        <div key="meeting" className="location-tile tile-university">
            <h3>🤝 12-Step Meeting</h3>
            <p className="location-details">Connect with support. Zero financial cost.</p>
            <button 
                onClick={handleMeetingAttendance}
                disabled={timeRemaining < 3 || inCrisis}
                className="btn-action btn-study"
                style={{backgroundColor: '#10b981'}} 
            >
                Attend Meeting (3 hrs)
            </button>
            <p className="item-info">**HIGH Stress Reduction**</p>
        </div>,
        
        // --- Self-Care Space (Rest) TILE ---
        <div key="rest" className="location-tile">
            <h3>🧘 Self-Care Space</h3>
            <p className="location-details">Time needed to stabilize and recharge.</p>
            <button 
                onClick={() => handleOtherAction(livingSituation.timeCost, 0, 8, `Spent time on **Mindfulness** and recharging.`, 'Rest')}
                disabled={timeRemaining < livingSituation.timeCost || inCrisis}
                className="btn-action btn-study"
            >
                Meditation / Rest ({livingSituation.timeCost} hrs)
            </button>
        </div>
    ];
    

  return (
    <div className="location-board panel">
      <h2 className="panel-title">Your Weekly Choices (Rent Due in **{gameState.rentDueIn}** Weeks)</h2>
      <p className="time-remaining">⏰ Time Remaining: **{timeRemaining}** hours</p>

      {/* --- Career Path Review & Ethical Choice Tile --- */}
      <div className="location-tile tile-university" style={{gridRow: 'span 2'}}> 
          <h3>🏢 Employment / Choices</h3>
          
          <div style={{marginBottom: '10px'}}>
            <h4 style={{fontSize: '1em', color: '#1d4ed8'}}>Stable Path:</h4>
            {locations.map((loc) => (
                <div key={loc.name} style={{marginBottom: '10px'}}>
                    <button 
                        onClick={loc.handler}
                        disabled={timeRemaining < loc.time || inCrisis}
                        className="btn-action"
                        style={{backgroundColor: '#007bff'}}
                    >
                        {loc.buttonText} ({loc.time} hrs)
                    </button>
                    <p className="item-info" style={{marginTop: '5px'}}>{loc.details}</p>
                </div>
            ))}
          </div>

          <div style={{borderTop: '1px dashed #ccc', paddingTop: '15px'}}>
            <h4 style={{fontSize: '1em', color: '#dc2626'}}>High-Risk Choice:</h4>
             <button 
                onClick={handleShadyGig}
                disabled={timeRemaining < 15 || inCrisis}
                className="btn-action btn-sell"
            >
                Take Shady Side Gig (15 hrs)
            </button>
            <p className="item-info">**+ $1500 Cash, but HUGE stress & stability loss.**</p>
          </div>
      </div>


      {/* Housing Authority Tile */}
      <div className="location-tile tile-bank">
          <h3>🏠 Housing Authority</h3>
          <p className="location-details">Current: **{livingSituation.name}**. Rest Time: {livingSituation.timeCost} hrs. Wellbeing Bonus: +{livingSituation.wellbeingBonus}/week.</p>

          {nextApartment ? (
              <div className="course-item">
                  <button 
                      onClick={() => handlePurchaseApartment(nextApartment)}
                      disabled={timeRemaining < 1 || money < nextApartment.cost || inCrisis}
                      className="btn-action btn-buy"
                  >
                      Secure **{nextApartment.name}**
                  </button>
                  <p className="item-info">
                      Cost: **${nextApartment.cost.toLocaleString()}** | New Rent: ${nextApartment.rent}/4 weeks
                  </p>
              </div>
          ) : (
              <p className="empty-state">You own the **Permanent Residence**! Zero rent financial stress.</p>
          )}
      </div>

      {/* Skill Building/University Tile */}
      <div className="location-tile tile-university">
          <h3>🧠 Skill Building (Therapy/Groups)</h3>
          <p className="location-details">Invest in yourself for long-term stability and role advancement.</p>
          
          {courses.map((course, index) => (
              <div key={index} className="course-item">
                  <button 
                      onClick={() => handleStudy(course)}
                      disabled={timeRemaining < course.time || money < course.cost || inCrisis}
                      className="btn-action btn-study"
                  >
                      {course.name} 
                  </button>
                  <p className="item-info">
                      Gain: {course.educationGain}% | Time: {course.time} hrs | Cost: **${course.cost}**
                  </p>
              </div>
          ))}
      </div>
      
      {/* Stock Market Tile */}
      <div className="location-tile tile-stock-market">
          <h3>🎲 High-Risk Assets</h3>
          <p className="location-details">High-risk, high-reward investing. Time Cost: 1 hour.</p>
          <p className="stock-price">
              Current Asset Value: **${stockValue.toFixed(2)}**/share
          </p>
          
          <button 
              onClick={() => handleInvest(500)}
              disabled={timeRemaining < 1 || money < 500 || inCrisis}
              className="btn-action btn-buy"
          >
              Acquire $500 in Assets
          </button>
          
          <button 
              onClick={() => handleCashOut(stockShares)}
              disabled={timeRemaining < 1 || stockShares === 0 || inCrisis}
              className="btn-action btn-sell"
          >
              Liquidate All Assets ({stockShares})
          </button>
          
          {stockShares > 0 && 
              <p className="item-info">
                  You hold: **{stockShares}** shares.
              </p>
          }
      </div>


      {/* Pawn Shop Tile */}
      <div className="location-tile tile-pawn-shop">
          <h3>📉 Desperation Sale</h3>
          <p className="location-details">Convert supportive items to cash (50% loss). Time Cost: 1 hour.</p>
          
          {playerInventory.length > 0 ? (
              playerInventory.map((item) => (
                  <div key={item.id} className="pawn-item">
                      <button 
                          onClick={() => handleSellItem(item.id)}
                          disabled={timeRemaining < 1 || inCrisis}
                          className="btn-action btn-sell"
                      >
                          Sell {item.name} 
                      </button>
                      <p className="item-info">
                          Cash Back: **${Math.floor(item.cost / 2)}** | Wellbeing Loss: -{item.wellbeing}
                      </p>
                  </div>
              ))
          ) : (
              <p className="empty-state">No supportive items to liquidate.</p>
          )}
      </div>
      
      {/* Supportive Item Store */}
      <div className="location-tile tile-shop">
          <h3>🛍️ Supportive Item Store</h3>
          <p className="location-details">Buy possessions that stabilize your wellbeing. Time Cost: 1 hour.</p>
          
          {shopItems.map((item, index) => (
              <div key={index} className="shop-item">
                  <button 
                      onClick={() => handlePurchase(item)}
                      disabled={timeRemaining < 1 || money < item.cost || inventory.includes(item.id) || inCrisis}
                      className={`btn-action ${inventory.includes(item.id) ? 'btn-disabled' : 'btn-buy'}`}
                  >
                      {inventory.includes(item.id) ? 'OWNED' : `Invest in ${item.name}`}
                  </button>
                  <p className="item-info">
                      Cost: **${item.cost}** | Wellbeing: +{item.wellbeing}
                  </p>
              </div>
          ))}
      </div>

      {/* Financial Stress Center (Bank) */}
      <div className="location-tile tile-bank">
          <h3>🏦 Financial Stress Center</h3>
          <p className="location-details">Manage/acquire high-interest debt. Time Cost: 1 hour.</p>
          
          <button 
              onClick={() => handleTakeLoan(1000)}
              disabled={timeRemaining < 1 || inCrisis}
              className="btn-action btn-sell"
          >
              Acquire $1000 in Stress
          </button>
          
          <button 
              onClick={() => handleRepayLoan(500)}
              disabled={timeRemaining < 1 || loanAmount === 0 || money < 500 || inCrisis}
              className="btn-action btn-buy"
          >
              Reduce Stress by $500
          </button>
          
          {loanAmount > 0 && 
              <p className="item-info text-danger">
                  High-Risk Stress: **${loanAmount.toFixed(2)}** (0.5% weekly interest)
              </p>
          }
      </div>


      {/* Dynamic Actions: Quick Fix and Rest */}
      {dynamicActionTiles}


      {/* --- End Turn Action --- */}
      <div className="end-turn-section">
        <button className="end-turn-button btn-primary" onClick={endTurn}>
          ⏩ Complete Week {gameState.week}
        </button>
        
        <p className="turn-tip">**Time must be spent efficiently!** You have 40 hours per week.</p>
      </div>
    </div>
  );
};

export default LocationBoard;
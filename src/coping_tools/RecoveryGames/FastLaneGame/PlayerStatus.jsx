import React from 'react';

const PlayerStatus = ({ status, opponentStatus, goals, shopItems }) => { 
  const { week, money, wellbeing, education, currentJob, loanAmount, inventory, stockShares, stockValue, stressLevel, inCrisis, livingSituation, rentDueIn } = status; 
  
  const stockPortfolioValue = stockShares * stockValue;
  const wealthForGoal = money + stockPortfolioValue;

  const johnGWealth = opponentStatus.money + (opponentStatus.stockShares * opponentStatus.stockValue);
  const johnGStress = Math.min(100, Math.max(0, 100 - opponentStatus.wellbeing + opponentStatus.loanAmount / 100 + opponentStatus.stressLevel));

  const getGoalProgress = (current, target) => 
    Math.min(100, Math.round((current / target) * 100));
    
  const itemNames = inventory.map(id => shopItems.find(item => item.id === id)?.name || id);

  const playerStress = Math.min(100, Math.max(0, 100 - wellbeing + loanAmount / 100 + stressLevel));
  const playerCrisisWarning = playerStress > 75 ? 'text-danger' : (playerStress > 50 ? 'text-warning' : '');

  return (
    <div className="player-status-panel panel">
      
      <h3 className="panel-title">Player Status (Week {week})</h3>
      
      <div className="side-by-side-container">
          {/* --- PLAYER STATS COLUMN --- */}
          <div className="player-column">
              <h4>YOU {inCrisis && <span className="text-danger" style={{marginLeft: '10px'}}>(CRISIS TURN)</span>}</h4>
              <p>🏠 Home: **{livingSituation.name}**</p>
              <p>💰 Funds: **${money.toFixed(2)}**</p>
              <p>📈 Shares: **{stockShares}** (${stockPortfolioValue.toFixed(2)})</p>
              <p className={loanAmount > 0 ? 'text-danger' : ''}>
                  💸 High-Risk Stress: **${loanAmount.toFixed(2)}**
              </p>
              <p>💼 Role: **{currentJob.title_recovery}**</p>
          </div>
          
          {/* --- JOHN G STATS COLUMN --- */}
          <div className="jones-column">
              <h4 className="text-danger">JOHN G {opponentStatus.inCrisis && <span className="text-danger" style={{marginLeft: '10px'}}>(CRISIS TURN)</span>}</h4>
              <p>🏠 Home: **{opponentStatus.livingSituation.name}**</p>
              <p>💰 Funds: **${opponentStatus.money.toFixed(2)}**</p>
              <p>📈 Shares: **{opponentStatus.stockShares}** (${(opponentStatus.stockShares * opponentStatus.stockValue).toFixed(2)})</p>
              <p>💸 High-Risk Stress: **${opponentStatus.loanAmount.toFixed(2)}**</p>
              <p>💼 Role: **{opponentStatus.currentJob.title_recovery}**</p>
          </div>
      </div>
      
      {/* --- STRESS METER --- */}
      <h4 className={`panel-subtitle ${playerCrisisWarning}`} style={{marginTop: '10px'}}>
        🚨 Current Stress Level: **{playerStress}%**
      </h4>
      <div className="goal">
        <div className="progress-bar-shell">
          <div className="progress-bar" style={{ width: `${playerStress}%`, backgroundColor: '#ef4444' }}>
            {playerStress}% (YOU)
          </div>
          <div className="progress-bar jones-progress" style={{ width: `${johnGStress}%`, backgroundColor: '#3b82f6', top: '20px' }}>
            {johnGStress}% (JOHN G)
          </div>
        </div>
      </div>

      <h4 className="panel-subtitle">Goal Progress (Target: {goals.career}, ${goals.wealth.toLocaleString()})</h4>
      
      {/* --- GOAL PROGRESS BARS (UNCHANGED) --- */}
      <div className="goal">
        <p>💵 Financial Stability ({goals.wealth.toLocaleString()})</p>
        <div className="progress-bar-shell">
            <div className="progress-bar" style={{ width: `${getGoalProgress(wealthForGoal, goals.wealth)}%` }}>
                You: {getGoalProgress(wealthForGoal, goals.wealth)}%
            </div>
            <div className="progress-bar jones-progress" style={{ width: `${getGoalProgress(johnGWealth, goals.wealth)}%`, backgroundColor: '#ef4444' }}>
                John G: {getGoalProgress(johnGWealth, goals.wealth)}%
            </div>
        </div>
      </div>
      
      <div className="goal">
        <p>😊 Wellbeing Score ({goals.wellbeing} points)</p>
        <div className="progress-bar-shell">
          <div className="progress-bar" style={{ width: `${getGoalProgress(wellbeing, goals.wellbeing)}%` }}>
            You: {getGoalProgress(wellbeing, goals.wellbeing)}%
          </div>
          <div className="progress-bar jones-progress" style={{ width: `${getGoalProgress(opponentStatus.wellbeing, goals.wellbeing)}%`, backgroundColor: '#ef4444' }}>
            John G: {getGoalProgress(opponentStatus.wellbeing, goals.wellbeing)}%
          </div>
        </div>
      </div>
      
      <div className="goal">
        <p>🎓 Skill Building ({goals.education}%)</p>
        <div className="progress-bar-shell">
          <div className="progress-bar" style={{ width: `${education}%` }}>
            You: {education}%
          </div>
          <div className="progress-bar jones-progress" style={{ width: `${opponentStatus.education}%` }}>
            John G: {opponentStatus.education}%
          </div>
        </div>
      </div>
      
      <h4 className="panel-subtitle">📦 Inventory (Supports Structure)</h4>
      <div className="inventory-list">
          {itemNames.length > 0 ? (
              <ul>
                  {itemNames.map((name, index) => (
                      <li key={index}>✨ {name}</li>
                  ))}
              </ul>
          ) : (
              <p className="empty-state">No supportive items purchased yet.</p>
          )}
      </div>

    </div>
  );
};

export default PlayerStatus;
import React, { useRef, useEffect } from 'react';

const GameLog = ({ log }) => {
  const logEndRef = useRef(null);

  // Effect to auto-scroll to the bottom when a new log entry is added
  useEffect(() => {
    // Uses optional chaining for safety
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="game-log panel">
      <h3 className="panel-title">Game Log</h3>
      <div className="log-content">
        {log.map((entry, index) => (
          // Using dangerouslySetInnerHTML to allow bolded text (e.g., **$500**) styled via App.css
          <p key={index} dangerouslySetInnerHTML={{ __html: entry }} />
        ))}
        {/* Invisible element to scroll into view */}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default GameLog;
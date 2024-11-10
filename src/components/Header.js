// src/components/Header.js
import React from 'react';

function Header({ toggleDarkMode, darkMode, toggleUnits, units, location, setLocation, searchLocation }) {
  return (
    <header className="header">
      <div className="units">
        <button onClick={toggleUnits} className={units === 'imperial' ? 'active' : ''}>
          °{units === 'imperial' ? 'F' : 'C'}
        </button>
      </div>

      <div className="search">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </header>
  );
}

export default Header;

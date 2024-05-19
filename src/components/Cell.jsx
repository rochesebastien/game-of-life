import React from 'react';

function Cell({ isAlive, toggleCellState }) {
  const cellStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: isAlive ? 'black' : 'white',
    border: '1px solid #ccc',
    display: 'inline-block'
  };

  return <div style={cellStyle} onClick={toggleCellState}></div>;
}

export default Cell;
import React from 'react';

function Cell({ isAlive, toggleCellState }) {
  const cellStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: isAlive ? 'white' : 'black',
    border: '1px solid #171718',
    display: 'inline-block'
  };

  return <div style={cellStyle} onClick={toggleCellState}></div>;
}

export default Cell;
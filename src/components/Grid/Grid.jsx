import React, { useState, useEffect } from 'react';
import Cell from '../Cell';
import './Grid.css';
function Grid({ rows, cols, grid, setGrid, running, speed }) {

    const toggleCellState = (row, col) => {
        const newGrid = grid.map((rowArr, rowIndex) =>
            rowArr.map((cell, colIndex) => {
                if (rowIndex === row && colIndex === col) {
                    return !cell;
                }
                return cell;
            })
        );
        setGrid(newGrid);
    };


    const nextGeneration = () => {
        const newGrid = grid.map((rowArr, rowIndex) =>
            rowArr.map((cell, colIndex) => {
                const neighbors = [
                    [rowIndex - 1, colIndex - 1],
                    [rowIndex - 1, colIndex],
                    [rowIndex - 1, colIndex + 1],
                    [rowIndex, colIndex - 1],
                    [rowIndex, colIndex + 1],
                    [rowIndex + 1, colIndex - 1],
                    [rowIndex + 1, colIndex],
                    [rowIndex + 1, colIndex + 1]
                ];

                const aliveNeighbors = neighbors.reduce((acc, [x, y]) => {
                    if (x >= 0 && x < rows && y >= 0 && y < cols && grid[x][y]) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);

                if (cell) {
                    return aliveNeighbors === 2 || aliveNeighbors === 3;
                }
                return aliveNeighbors === 3;
            })
        );

        setGrid(newGrid);
    };

    useEffect(() => {
        if (running) {
            const interval = setInterval(() => {
                nextGeneration();
            }, speed);
            return () => clearInterval(interval);
;
        }
    }, [running, grid]);

    return (
        <div className="grid">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            isAlive={cell}
                            toggleCellState={() => toggleCellState(rowIndex, colIndex)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Grid;
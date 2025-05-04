import { useSelector } from 'react-redux';
import './SGFVisualizer.css';
import React, { useState, useEffect } from 'react';

const SGFVisualizer = () => {
    const [testBoard, setTestBoard] = useState([]);
    const moveSubset = useSelector((state) => state.testBoardTraversal.moveSubset);
    const boardSize = 9; // Standard Go board size
    const SGFVisualizerGrid = Array.from({ length: 8 }, () => Array(8).fill(0));

    useEffect(() => {
        const loadedTestBoard = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(null)
        );
        if(moveSubset!=undefined){
            moveSubset.forEach((move) => { // Parse SGF moves and update the board
                if (move.coords) {
                    const x = move.coords.charCodeAt(0) - 'a'.charCodeAt(0);
                    const y = move.coords.charCodeAt(1) - 'a'.charCodeAt(0);
                    loadedTestBoard[y][x] = move.color === 'B' ? 'black' : 'white';
                }
            });
            setTestBoard(loadedTestBoard);
        }
    }, [moveSubset]);

    return (
        <div id='SGFVisualizer'>
            <div id='SGFVisualizerGrid' style={{
                position: 'absolute', zIndex: 1, margin: '17px 0px 0px 15px',
                display: 'grid', gridTemplateColumns: `repeat(${boardSize - 1}, 30px)`
            }}>
                {
                    SGFVisualizerGrid.map((row, y) =>
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    border: '1px solid black',
                                    backgroundColor: 'rgb(220, 179, 92)',
                                }}
                            ></div>
                        ))
                    )
                }
            </div>
            <div id='SGFVisualizerPlacements' style={{
                position: 'absolute', zIndex: 3,
                display: 'grid', gridTemplateColumns: `repeat(${boardSize}, 30px)`
            }}>
                {
                    testBoard.map((row, y) =>
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    border: '1px solid ' + (cell === 'black' || cell === 'white' ? 'black' : 'transparent'),
                                    borderRadius: '16px',
                                    backgroundColor: cell === 'black' ? 'black' : cell === 'white' ? 'white' : 'transparent',
                                }}
                            ></div>
                        ))
                    )
                }
            </div>
        </div >
    );
};

export default SGFVisualizer;
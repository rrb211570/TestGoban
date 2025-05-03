import { setMoveSubset } from "../../store/reducers/testBoardTraversal";
import { testGobanStore } from "../../store/store";
import parseSGFMoves from "../../helpers/parseSGF";
import React, { useState } from "react";
import { setCurrentMoveIndex } from "../../store/reducers/testBoardTraversal";
import { useSelector } from "react-redux";

function GameTraversal() {
    const [breakingMove, setBreakingMove] = useState('');
    const index = useSelector((state) => state.testBoardTraversal.currentMoveIndex);
    const moveSet = useSelector((state) => state.testBoardTraversal.moveSet);

    const handlePreviousMove = () => {
        if (index > 0) {
            testGobanStore.dispatch(setCurrentMoveIndex({
                currentMoveIndex: index - 1
            }));
            testGobanStore.dispatch(setMoveSubset({
                moveSubset: parseSGFMoves(moveSet.slice(0, index - 1)
                    .map(move => `;${move.color}[${move.coords}]`)
                    .join(''))
            }));
        }
        // subtract latest move from Goban
    };

    const handleNextMove = () => {
        if (index < moveSet.length) {
            testGobanStore.dispatch(setCurrentMoveIndex({
                currentMoveIndex: index + 1
            }));
            testGobanStore.dispatch(setMoveSubset({
                moveSubset: parseSGFMoves(moveSet.slice(0, index + 1)
                    .map(move => `;${move.color}[${move.coords}]`)
                    .join(''))
            }));
            // place latest move on Goban
            let x = moveSet[index].coords.charCodeAt(0) - 'a'.charCodeAt(0);
            let y = moveSet[index].coords.charCodeAt(1) - 'a'.charCodeAt(0);
            console.log(x + ' ' + y);
            const mouseOverEvent = new MouseEvent('mouseover', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            document.querySelector('#clickSquare_' + y + '_' + x).dispatchEvent(mouseOverEvent);
            document.querySelector('#clickSquare_' + y + '_' + x).click();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
            <p id='BreakingMove' style={{ border: '1px solid black', borderRadius: '2px' }}>Breaking move: {breakingMove} </p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
                <button onClick={handlePreviousMove}>{"<"}</button>
                <p> -- {testGobanStore.getState().testBoardTraversal.currentMoveIndex} -- </p>
                <button onClick={handleNextMove}>{">"}</button>
            </div>
        </div>
    );
}

export default GameTraversal;
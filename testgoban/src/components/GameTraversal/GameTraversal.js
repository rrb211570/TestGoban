import { setMoveSubset } from "../../store/reducers/testBoardTraversal";
import { testGobanStore } from "../../store/store";
import parseSGFMoves from "../../helpers/parseSGF";
import React, { useState } from "react";
import { setCurrentMoveIndex } from "../../store/reducers/testBoardTraversal";
import { useSelector } from "react-redux";
import { gobanStore } from "../Goban/store/store";
import { undo, redo } from "../Goban/store/reducers/gamePlaySlice";
import { fireEvent } from "@testing-library/react";

function GameTraversal() {
    const [breakingMove, setBreakingMove] = useState('');
    const index = useSelector((state) => state.testBoardTraversal.currentMoveIndex);
    const moveSet = useSelector((state) => state.testBoardTraversal.moveSet);

    const handlePreviousMove = () => { // undo move
        if (index > 0) {
            testGobanStore.dispatch(setCurrentMoveIndex({
                currentMoveIndex: index - 1
            }));
            testGobanStore.dispatch(setMoveSubset({
                moveSubset: parseSGFMoves(moveSet.slice(0, index - 1)
                    .map(move => `;${move.color}[${move.coords}]`)
                    .join(''))
            }));
            // get deadStones if any
            let deadStones = gobanStore.getState().gamePlay.history[gobanStore.getState().gamePlay.historyIndex].deadStones;
            for(let deadStone of deadStones) {
                fireEvent.mouseOver(document.querySelector('#clickSquare_' + deadStone));
            }
            gobanStore.dispatch(undo({ coords: moveSet[index - 1].coords }));
            let latestStoneID = (moveSet[index - 1].coords.charCodeAt(1) - 'a'.charCodeAt(0))
                + '_' + (moveSet[index - 1].coords.charCodeAt(0) - 'a'.charCodeAt(0));
            // subtract latest move from Goban
            console.log(latestStoneID);
            fireEvent.mouseOver(document.querySelector('#clickSquare_' + latestStoneID));
            fireEvent.mouseLeave(document.querySelector('#clickSquare_' + latestStoneID));
        }
    };

    const handleNextMove = () => { // assumes new move, not redoing prior move
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
            let latestStoneID = (moveSet[index].coords.charCodeAt(1) - 'a'.charCodeAt(0))
                + '_' + (moveSet[index].coords.charCodeAt(0) - 'a'.charCodeAt(0));
            fireEvent.mouseOver(document.querySelector('#clickSquare_' + latestStoneID));
            document.querySelector('#clickSquare_' + latestStoneID).click();
            fireEvent.mouseLeave(document.querySelector('#clickSquare_' + latestStoneID));
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
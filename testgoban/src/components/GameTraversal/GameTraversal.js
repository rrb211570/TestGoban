

function GameTraversal({currentMoveIndex, setCurrentMoveIndex, loadedSGFMoves, setTestBoard}) {
    const [breakingMove, setBreakingMove] = useState('');

    const handlePreviousMove = () => {
        if (currentMoveIndex > 0) {
            setCurrentMoveIndex(currentMoveIndex - 1);
            updateTestBoard(parseSGFMoves(loadedSGFMoves.slice(0, currentMoveIndex - 1).map(move => `;${move.color}[${move.coords}]`).join('')));
        }
        // subtract latest move from Goban
    };

    const handleNextMove = () => {
        if (currentMoveIndex < loadedSGFMoves.length) {
            setCurrentMoveIndex(currentMoveIndex + 1);
            updateTestBoard(parseSGFMoves(loadedSGFMoves.slice(0, currentMoveIndex + 1).map(move => `;${move.color}[${move.coords}]`).join('')));
            // place latest move on Goban
            let x = loadedSGFMoves[currentMoveIndex].coords.charCodeAt(0) - 'a'.charCodeAt(0);
            let y = loadedSGFMoves[currentMoveIndex].coords.charCodeAt(1) - 'a'.charCodeAt(0);
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

    const updateTestBoard = (moves) => {
        console.log(moves);
        const testBoard = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(null)
        );
        if (moves != '') {
            moves.forEach((move) => {
                if (move.coords) {
                    const x = move.coords.charCodeAt(0) - 'a'.charCodeAt(0);
                    const y = move.coords.charCodeAt(1) - 'a'.charCodeAt(0);
                    testBoard[y][x] = move.color === 'B' ? 'black' : 'white';
                }
            });
        }
        setTestBoard(testBoard);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
            <p id='BreakingMove' style={{ border: '1px solid black', borderRadius: '2px' }}>Breaking move: {breakingMove} </p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
                <button onClick={handlePreviousMove}>{"<"}</button>
                <p> -- {currentMoveIndex} -- </p>
                <button onClick={handleNextMove}>{">"}</button>
            </div>
        </div>
    );
}

export default GameTraversal;
import './Goban.css';
import { useEffect, useState } from 'react';
import placeable from '../../data/gameInteraction/placement/placement.js';
import { swapTurn, addPlacedStone, deletePlacedStone } from '../../store/reducers/gamePlaySlice.js'
import { store } from '../../store/store.js';
// import turn, playerColor, boardLength from store

function Goban({ playground }) {
    const [clickSquares, setClickSquares] = useState([<div id='filler' key='1'></div>]);
    const [overlayElements, setOverlayElements] = useState([]);
    const [currentTurn, setCurrentTurn] = useState(true) // initialize with playerColor==turn (server-side session state)

    useEffect(() => {
        let boardLength = store.getState().gamePlay.boardLength;
        console.log(boardLength);

        let clickSquares = [];
        for (let i = 0; i < boardLength; ++i) {
            let clickRow = [];
            for (let j = 0; j < boardLength; ++j) {
                clickRow.push(<div id={'clickSquare_' + i + '_' + j} key={'clickSquare_' + i + '_' + j} onMouseOver={showStone} onClick={placeStone} onMouseLeave={hideStone}
                    style={{ position: 'absolute', height: '29px', width: '29px', marginLeft: -13.5 + 29 * j + 'px', marginTop: -13.5 + 29 * i + 'px' }}>
                    <svg display={'none'} style={{ opacity: '0.7', height: '29px', width: '29px' }}><use id={'hiddenStone_' + j + '_' + i} href="#plain-black-14.5-3" /></svg>
                </div>)
            }
            clickSquares.push(clickRow);
        }
        console.log(clickSquares);
        setClickSquares(clickSquares);
        // Update overlay whenever the state changes
        const unsubscribe = store.subscribe(() => { updateOverlay() });
        return () => { unsubscribe() };
    }, []);

    const updateOverlay = () => {
        const stoneGroups = store.getState().gamePlay.stoneGroups;
        const adjMap = store.getState().gamePlay.adjMap;

        let overlay = [];

        // Add stone group numbers in neon pink
        for (let [groupNumber, stones] of stoneGroups.getStoneGroupEntries()) {
            stones.forEach((stone) => {
                const [x, y] = stone.split('_').map(Number);
                overlay.push(
                    <p
                        key={`stoneGroup_${stone}`}
                        style={{
                            position: 'absolute',
                            margin: '0px',
                            left: 29 * y - 3.5 + 'px',
                            top: 29 * x - 11 + 'px',
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            pointerEvents: 'none',
                        }}
                    >
                        {groupNumber}
                    </p>
                );
            });
        }

        // Add adjacency markers as black "X"
        for (let adj of adjMap.getAdjKeys()) {
            const [x, y] = adj.split('_').map(Number);
            overlay.push(
                <div
                    key={`adjacency_${adj}`}
                    style={{
                        position: 'absolute',
                        left: 29 * y - 4 + 'px',
                        top: 29 * x - 6 + 'px',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        pointerEvents: 'none',
                    }}
                >
                    X
                </div>
            );
        }
        setOverlayElements(overlay);
    };

    const showStone = (e) => {
        let turn = store.getState().gamePlay.turn;
        let clickSquareID = e.currentTarget.id;
        let indices = /^.*(\d+).*(\d+)$/.exec(clickSquareID).slice(1, 3).join('_');
        if (!stoneExists(indices)) {
            if (turn == 'white') document.querySelector('#' + clickSquareID + ' use').setAttribute('href', '#plain-white-14.5-2');
            else document.querySelector('#' + clickSquareID + ' use').setAttribute('href', '#plain-black-14.5-3');
            document.querySelector('#' + e.currentTarget.id + ' svg').style.display = 'block';
        }
    }

    let hideStone = (e) => {
        let clickSquareID = e.currentTarget.id;
        let indices = /^.*(\d+).*(\d+)$/.exec(clickSquareID).slice(1, 3).join('_');
        if (!stoneExists(indices)) {
            document.querySelector('#' + e.currentTarget.id + ' svg').style.display = 'none';
        }
    }

    const placeStone = (e) => {
        let rootIndices = /^.*(\d+).*(\d+)$/.exec(e.currentTarget.id).slice(1, 3).join('_');
        if (!currentTurn && !playground) return;
        if (!stoneExists(rootIndices)) {
            alignColors(rootIndices);
            store.dispatch(addPlacedStone({ indices: rootIndices })); // very important for placeable()'s logic - We remove afterwards if not placeable
            if (placeable(rootIndices)) {
                document.querySelector('#clickSquare_' + rootIndices + ' svg').display = 'block';
                document.querySelector('#clickSquare_' + rootIndices + ' svg').style.opacity = '1';
                store.dispatch(swapTurn());
                console.log('placed');
                // update loadedSGFContent, send to server along with this placed move
            } else {
                console.log(rootIndices);
                store.dispatch(deletePlacedStone({ indices: rootIndices }));
                document.querySelector('#clickSquare_' + rootIndices + ' svg').style.display = 'none';
                document.querySelector('#clickSquare_' + rootIndices + ' svg').style.opacity = '0.7';
                console.log('not placeable');
            }
            console.log({
                stoneGroups: new Map(Array.from(store.getState().gamePlay.stoneGroups.getStoneGroupEntries())),
                adjMap: new Map(Array.from(store.getState().gamePlay.adjMap.getAdjEntries())),
                placedStones: store.getState().gamePlay.placedStones
            });
        }
    }

    let alignColors = (rootIndices) => {
        if (store.getState().gamePlay.turn == 'white') document.querySelector('#clickSquare_' + rootIndices + ' use').setAttribute('href', '#plain-white-14.5-2');
        else document.querySelector('#clickSquare_' + rootIndices + ' use').setAttribute('href', '#plain-black-14.5-3');
    }

    let stoneExists = (indices) => {
        return store.getState().gamePlay.placedStones.includes(indices);
    }

    return (
        <div id='Goban'>
            <svg width="319" height="319" style={{ padding: '5px 5px 0 0' }}>
                <defs>
                    <radialGradient id="shadow-black" r="1.0">
                        <stop offset="0" stopColor="black" stopOpacity="1.0"></stop>
                        <stop offset="30%" stopColor="black" stopOpacity="1.0"></stop>
                        <stop offset="31%" stopColor="#333333" stopOpacity="0.6"></stop>
                        <stop offset="34%" stopColor="#333333" stopOpacity="0.50"></stop>
                        <stop offset="40%" stopColor="#333333" stopOpacity="0.5"></stop>
                        <stop offset="50%" stopColor="#333333" stopOpacity="0.0"></stop>
                    </radialGradient>
                    <radialGradient id="shadow-white" r="1.0">
                        <stop offset="0" stopColor="white" stopOpacity="1.0"></stop>
                        <stop offset="30%" stopColor="white" stopOpacity="1.0"></stop>
                        <stop offset="31%" stopColor="#333333" stopOpacity="0.6"></stop>
                        <stop offset="34%" stopColor="#333333" stopOpacity="0.50"></stop>
                        <stop offset="40%" stopColor="#333333" stopOpacity="0.5"></stop>
                        <stop offset="50%" stopColor="#333333" stopOpacity="0.0"></stop>
                    </radialGradient>
                    <g id="plain-white-14.5-2" className="stone">
                        <circle stroke="hsl(8, 7%, 20%)" strokeWidth="0.7px" cx="14.5" cy="14.5" r="14.1375" shapeRendering="geometricPrecision" fill="url(#plain-white-14.5-2-gradient)"></circle>
                        <defs>
                            <linearGradient x1="0.40" y1="0.10" x2="0.90" y2="0.90" id="plain-white-14.5-2-gradient">
                                <stop offset="0%" stopColor="hsl(8, 7%, 95%)"></stop>
                                <stop offset="90%" stopColor="hsl(226, 7%, 75%)"></stop>
                            </linearGradient>
                        </defs>
                    </g>
                    <g id="plain-black-14.5-3" className="stone">
                        <circle stroke="hsl(8, 7%, 20%)" strokeWidth="0.7px" cx="14.5" cy="14.5" r="14.1375" shapeRendering="geometricPrecision" fill="url(#plain-black-14.5-3-gradient)"></circle>
                        <defs>
                            <linearGradient x1="0.40" y1="0.10" x2="0.70" y2="0.70" id="plain-black-14.5-3-gradient">
                                <stop offset="0%" stopColor="hsl(8, 7%, 27%)"></stop><stop offset="100%" stopColor="hsl(8, 7%, 12%)"></stop>
                            </linearGradient>
                        </defs>
                    </g>
                </defs>
                <g>
                    <path d="M 43.5 43.5 L 43.5 275.5 M 72.5 43.5 L 72.5 275.5 M 101.5 43.5 L 101.5 275.5 M 130.5 43.5 L 130.5 275.5 M 159.5 43.5 L 159.5 275.5 M 188.5 43.5 L 188.5 275.5 M 217.5 43.5 L 217.5 275.5 M 246.5 43.5 L 246.5 275.5 M 275.5 43.5 L 275.5 275.5 M 43.5 43.5 L 275.5 43.5 M 43.5 72.5 L 275.5 72.5 M 43.5 101.5 L 275.5 101.5 M 43.5 130.5 L 275.5 130.5 M 43.5 159.5 L 275.5 159.5 M 43.5 188.5 L 275.5 188.5 M 43.5 217.5 L 275.5 217.5 M 43.5 246.5 L 275.5 246.5 M 43.5 275.5 L 275.5 275.5 " stroke="#000000" strokeWidth="1px" strokeLinecap="square"></path>
                    <circle cx="101.5" cy="101.5" r="2.2px" fill="#000000"></circle>
                    <circle cx="101.5" cy="217.5" r="2.2px" fill="#000000"></circle>
                    <circle cx="159.5" cy="159.5" r="2.2px" fill="#000000"></circle>
                    <circle cx="217.5" cy="101.5" r="2.2px" fill="#000000"></circle>
                    <circle cx="217.5" cy="217.5" r="2.2px" fill="#000000"></circle>
                </g>
                <g className="coordinate-labels">
                    <text x="44" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">A</text>
                    <text x="73" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">B</text>
                    <text x="102" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">C</text>
                    <text x="131" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">D</text>
                    <text x="160" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">E</text>
                    <text x="189" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">F</text>
                    <text x="218" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">G</text>
                    <text x="247" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">H</text>
                    <text x="276" y="19" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">J</text>
                    <text x="44" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">A</text>
                    <text x="73" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">B</text>
                    <text x="102" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">C</text>
                    <text x="131" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">D</text>
                    <text x="160" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">E</text>
                    <text x="189" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">F</text>
                    <text x="218" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">G</text>
                    <text x="247" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">H</text>
                    <text x="276" y="309" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">J</text>
                    <text x="15" y="48" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">9</text>
                    <text x="15" y="77" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">8</text>
                    <text x="15" y="106" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">7</text>
                    <text x="15" y="135" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">6</text>
                    <text x="15" y="164" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">5</text>
                    <text x="15" y="193" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">4</text>
                    <text x="15" y="222" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">3</text>
                    <text x="15" y="251" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">2</text>
                    <text x="15" y="280" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">1</text>
                    <text x="305" y="48" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">9</text>
                    <text x="305" y="77" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">8</text>
                    <text x="305" y="106" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">7</text>
                    <text x="305" y="135" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">6</text>
                    <text x="305" y="164" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">5</text>
                    <text x="305" y="193" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">4</text>
                    <text x="305" y="222" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">3</text>
                    <text x="305" y="251" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">2</text>
                    <text x="305" y="280" fontSize="15px" fontWeight="bold" fill="rgba(0, 0, 0, 0.75)">1</text>
                </g>
                <g className="shadow-layer"></g>
                <g className="grid"></g>
            </svg>
            <div id='GobanClickLayer' width="280" height="280">
                {clickSquares}
            </div>
            <div id="GobanOverlay">
                {overlayElements}
            </div>
        </div>
    );
}

export default Goban;
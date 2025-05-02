import './AlphaGo.css';
import AWS from 'aws-sdk';
import NavBar from './components/NavBar/NavBar.js';
import { Provider as TestGobanProvider } from 'react-redux';
import { Provider as GobanProvider } from 'react-redux';
import { testGobanStore } from './store/store';
import { gobanStore } from './components/Goban/store/store.js';
import Goban from './components/Goban/components/Goban/Goban.js';
import { useEffect, useState } from 'react';
import SGFVisualizer from './components/SGFVisualizer/SGFVisualizer.js';
import parseSGFMoves from './helpers/parseSGF.js';
import GameTraversal from './components/GameTraversal/GameTraversal.js';
import TestTraversal from './components/TestTraversal/TestTraversal.js';
// import turn, boardLength from store

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const boardSize = 9; // Standard Go board size

function TestGoban() {
  const [testCases, setTestCases] = useState([]);
  const [testBoard, setTestBoard] = useState([]);
  const [loadedSGFMoves, setLoadedSGFMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState('') // initialize with index from server-side session state

  useEffect(() => {
    // Process all SGF files, populate test results, load first failure into visualizer
    const fetchDB_SGFContents = async () => {
      try {
        const data = await dynamodb.scan({ TableName: 'SGFContents' }).promise();
        const items = data.Items;

        if (items.length >= 2) {
          let moves = parseSGFMoves(items[0].Content);
          console.log(items[0].Content);
          console.log(moves);
          console.log(items);
          setTestCases(items); // Populate testCases with SGF objects
          setLoadedSGFMoves(moves);
          initializeTestBoard(moves);
          // - iterate through tests: when Goban and testSGF diverge, note the failed test, breaking move, and index of timeTravel
          // - initialize testGoban and Goban to the first failed test and index of divergence
        } else console.error('Not enough items in the DynamoDB table to set testBoard.');
      } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
      }
    };
    fetchDB_SGFContents();
  }, [])

  const initializeTestBoard = (moves) => {
    const initialTestBoard = Array.from({ length: boardSize }, () =>
      Array(boardSize).fill(null)
    );
    moves.forEach((move) => { // Parse SGF moves and update the board
      if (move.coords) {
        const x = move.coords.charCodeAt(0) - 'a'.charCodeAt(0);
        const y = move.coords.charCodeAt(1) - 'a'.charCodeAt(0);
        initialTestBoard[y][x] = move.color === 'B' ? 'black' : 'white';
      }
    });
    setCurrentMoveIndex(moves.length);
    setTestBoard(initialTestBoard);
  }

  return (
    <div className="TestGoban">
      <TestGobanProvider store={testGobanStore}>
        <div>
          <NavBar></NavBar>
          <div id='Boards' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
            <GobanProvider store={gobanStore}>
              <div>
                <Goban playground={true}></Goban>
              </div>
            </GobanProvider>
            <SGFVisualizer testBoard={testBoard}></SGFVisualizer>
          </div>
          <GameTraversal currentMoveIndex={currentMoveIndex}></GameTraversal>
          <TestTraversal></TestTraversal>
        </div>
      </TestGobanProvider>
    </div>
  );
}

export default TestGoban;

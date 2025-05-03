import './TestGoban.css';
import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

import { Provider as TestGobanProvider } from 'react-redux';
import { Provider as GobanProvider } from 'react-redux';
import { testGobanStore } from './store/store';
import { gobanStore } from './components/Goban/store/store.js';
import Goban from './components/Goban/Goban.js';
import { setTestCases, setMoveSet } from './store/reducers/testBoardTraversal.js';

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
  const [meh, setMeh] = useState('');

  useEffect(() => {
    // Process all SGF files, populate test results, load first failure into visualizer
    const fetchDB_SGFContents = async () => {
      try {
        const data = await dynamodb.scan({ TableName: 'SGFContents' }).promise();
        const items = data.Items;

        if (items.length >= 2) {
          console.log(items);
          let moveSet = parseSGFMoves(items[0].Content);
          console.log(moveSet);
          testGobanStore.dispatch(setTestCases({ testCases: items })); // Populate testCases with SGF objects
          testGobanStore.dispatch(setMoveSet({ moveSet: moveSet })); // Populate testBoard with SGF moves
          // - iterate through tests: when Goban and testSGF diverge, note the failed test, breaking move, and index of timeTravel
          // - initialize testGoban and Goban to the first failed test and index of divergence
        } else console.error('Not enough items in the DynamoDB table to set testBoard.');
      } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
      }
    };
    fetchDB_SGFContents();
  }, [])

  return (
    <div className="TestGoban">
      <TestGobanProvider store={testGobanStore}>
        <div>
          <div id='Boards' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
            <GobanProvider store={gobanStore}>
              <div>
                <Goban playground={true}></Goban>
              </div>
            </GobanProvider>
            <SGFVisualizer></SGFVisualizer>
          </div>
          <GameTraversal></GameTraversal>
          <TestTraversal></TestTraversal>
        </div>

      </TestGobanProvider>
    </div>
  );
}

export default TestGoban;

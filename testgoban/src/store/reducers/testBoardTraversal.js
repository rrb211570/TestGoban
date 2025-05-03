import { createSlice } from '@reduxjs/toolkit';

export const testBoardTraversalSlice = createSlice({
    name: 'testBoardTraversal',
    initialState: {
        testCases: [],
        moveSet: [],
        moveSubset: [],
        currentMoveIndex: 0,
    },
    reducers: {
        setTestCases(state, action) {
            state.testCases = action.payload.testCases;
            state.moveSet = state.moveSet;
            state.moveSubset = state.moveSubset;
            state.currentMoveIndex = state.currentMoveIndex;
        },
        setMoveSet(state, action) {
            console.log(action);
            console.log(action.payload.moveSet);
            state.testCases = state.testCases;
            state.moveSet = action.payload.moveSet;
            state.moveSubset = action.payload.moveSubset;
            state.currentMoveIndex = state.currentMoveIndex;
        },
        setMoveSubset(state, action) {
            state.testCases = state.testCases;
            state.moveSet = state.moveSet;
            state.moveSubset = action.payload.moveSubset;
            state.currentMoveIndex = state.currentMoveIndex;
        },
        setCurrentMoveIndex(state, action) {
            state.testCases = state.testCases;
            state.moveSet = state.moveSet;
            state.moveSubset = state.moveSubset;
            state.currentMoveIndex = action.payload.currentMoveIndex;
        }
    }
});

export const { setTestCases, setMoveSet, setMoveSubset, setCurrentMoveIndex } = testBoardTraversalSlice.actions;
export const getTestCases = state => state.testBoardTraversal.testCases;
export const getMoveSet = state => state.testBoardTraversal.moveSet;
export const getMoveSubset = state => state.testBoardTraversal.moveSubset;
export const getCurrentMoveIndex = state => state.testBoardTraversal.currentMoveIndex;

export default testBoardTraversalSlice.reducer;
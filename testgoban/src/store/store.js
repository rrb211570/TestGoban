
import { configureStore } from '@reduxjs/toolkit'
import testBoardTraversalReducer from './reducers/testBoardTraversal.js'

const testGobanStore = configureStore({
    reducer: {
        testBoardTraversal: testBoardTraversalReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                //ignoredActions: ['history/newHistoryState'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.adjMap','payload.stoneGroups'],
                // Ignore these paths in the state
                ignoredPaths: ['gamePlay.adjMap','gamePlay.stoneGroups'],
            },
        })
})

export { testGobanStore };
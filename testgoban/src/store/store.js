
import { configureStore } from '@reduxjs/toolkit'
import gamePlayReducer from './reducers/gamePlaySlice.js'

const store = configureStore({
    reducer: {
        gamePlay: gamePlayReducer
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

export { store };
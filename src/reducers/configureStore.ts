import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import isLoadingReducer from './isLoading/isLoading';
import notesReducer from './notes/notes';

const rootReducer = combineReducers({
  isLoadingReducer,
  notesReducer,
});

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    loggerMiddleware,
  ),
);

export type storeTypes = ReturnType<typeof rootReducer>;

export default store;

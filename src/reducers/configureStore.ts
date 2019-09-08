import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import isLoadingReducer from './isLoading/isLoading';

const rootReducer = combineReducers({
  isLoadingReducer,
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

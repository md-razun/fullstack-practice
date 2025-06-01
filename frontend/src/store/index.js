import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;

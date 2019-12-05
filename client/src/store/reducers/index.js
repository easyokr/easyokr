import { combineReducers } from 'redux';
import token from './token';
import stage from './stage';

const reducers = combineReducers({
    token, stage
});

export default reducers
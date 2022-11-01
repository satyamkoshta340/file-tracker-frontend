import { createStore, combineReducers } from "redux";
// import { configureStore } from  "@reduxjs/toolkit";

import userReducer from './user';

const reducer = combineReducers({
    userStore: userReducer,
});

const store = createStore( reducer );
export default store;
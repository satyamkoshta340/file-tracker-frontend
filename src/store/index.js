import { configureStore } from  "@reduxjs/toolkit";

import userReducer from './user';
import filesReducer from './files';

export default configureStore( {
    reducer: {
        user: userReducer,
        files: filesReducer
    }
} );
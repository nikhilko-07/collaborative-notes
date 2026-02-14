import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authReducer";
import noteReducer from "./noteReducer";
import activityFeedReducer from "./activityReducer";
import collaboratorReducer from "./collaboratorReducer";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        notes: noteReducer,
        activityFeed: activityFeedReducer,
        collaborators: collaboratorReducer,

    }
});
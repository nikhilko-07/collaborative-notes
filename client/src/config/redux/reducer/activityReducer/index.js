import {createSlice} from "@reduxjs/toolkit";
import {fetchActivityByNote, fetchActivityFeed} from "../../action/activityAction";

const activitySlice = createSlice({
    name: 'activity',
    initialState: {
        byNoteId: {},
        loading: false,
        error: null,
        items: [],
    },
    reducers: {
        // optional: clear on logout etc.
        clearActivity: (state) => {
            state.byNoteId = {};
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityByNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityByNote.fulfilled, (state, action) => {
                state.loading = false;
                const { noteId, activity } = action.payload;
                state.byNoteId[noteId] = activity;
            })
            .addCase(fetchActivityByNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchActivityFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchActivityFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
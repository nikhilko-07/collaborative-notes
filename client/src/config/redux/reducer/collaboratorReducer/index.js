import { createSlice } from '@reduxjs/toolkit';
import {addCollaborator, fetchCollaborators, removeCollaborator} from "../../action/collaboratorAction";


const collaboratorSlice = createSlice({
    name: 'collaborators',
    initialState: {
        byNoteId: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollaborators.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCollaborators.fulfilled, (state, action) => {
                state.loading = false;
                const { noteId, collaborators } = action.payload;
                state.byNoteId[noteId] = collaborators;
            })
            .addCase(fetchCollaborators.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCollaborator.pending, (state) => {
                state.error = null;
            })
            .addCase(addCollaborator.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(removeCollaborator.pending, (state) => {
                state.error = null;
            })
            .addCase(removeCollaborator.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default collaboratorSlice.reducer;

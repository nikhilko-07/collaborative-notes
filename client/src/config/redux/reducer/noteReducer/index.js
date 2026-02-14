import { createSlice } from '@reduxjs/toolkit';
import {
    createNote,
    deleteNote,
    fetchNoteById,
    fetchNotes,
    searchNotes,
    shareNote,
} from '../../action/noteAction';

const initialState = {
    notes: [],
    currentNote: null,
    status: 'idle',
    error: null,
    shareError: null,
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setCurrentNoteFromSocket: (state, action) => {
            const { noteId, title, content, version, lastModified } = action.payload;

            if (state.currentNote && state.currentNote.id === noteId) {
                state.currentNote = {
                    ...state.currentNote,
                    title,
                    content,
                    version,
                    lastModified,
                };
            }

            const idx = state.notes.findIndex((n) => n.id === noteId);
            if (idx !== -1) {
                state.notes[idx] = {
                    ...state.notes[idx],
                    title,
                    content,
                    version,
                    lastModified,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchNoteById.fulfilled, (state, action) => {
                state.currentNote = action.payload;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.notes.unshift(action.payload);
            })
            .addCase(searchNotes.fulfilled, (state, action) => {
                state.notes = action.payload;
            })
            .addCase(deleteNote.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const id = action.payload;
                state.notes = state.notes.filter((n) => n.id !== id);
                if (state.currentNote && state.currentNote.id === id) {
                    state.currentNote = null;
                }
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(shareNote.pending, (state) => {
                state.shareError = null;
            })
            .addCase(shareNote.fulfilled, (state, action) => {
                const { noteId, publicShareId } = action.payload;

                if (state.currentNote && state.currentNote.id === noteId) {
                    state.currentNote.publicShareId = publicShareId;
                }

                const idx = state.notes.findIndex((n) => n.id === noteId);
                if (idx !== -1) {
                    state.notes[idx].publicShareId = publicShareId;
                }
            })
            .addCase(shareNote.rejected, (state, action) => {
                state.shareError = action.payload;
            });
    },
});

export const { setCurrentNoteFromSocket } = notesSlice.actions;
export default notesSlice.reducer;

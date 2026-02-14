import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../index";


export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async (_, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.get('/notes',{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch notes');
        }
    }
);

export const fetchNoteById = createAsyncThunk(
    'notes/fetchNoteById',
    async (id, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.get(`/notes/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch note');
        }
    }
);

export const createNote = createAsyncThunk(
    'notes/createNote',
    async ({ title, content }, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.post('/notes', { title, content },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to create note');
        }
    }
);

export const searchNotes = createAsyncThunk(
    'notes/searchNotes',
    async (q, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.get(`/notes/search?q=${encodeURIComponent(q)}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || 'Search failed');
        }
    }
);



export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (noteId, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, '') : null;

            await clientServer.delete(`/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return noteId;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.error || 'Failed to delete note'
            );
        }
    }
);




export const shareNote = createAsyncThunk(
    'notes/shareNote',
    async (noteId, { rejectWithValue }) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.post(`/notes/${noteId}/share`,{},{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || 'Failed to share note'
            );
        }
    }
);
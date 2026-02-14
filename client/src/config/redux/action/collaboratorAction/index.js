import {createAsyncThunk} from "@reduxjs/toolkit";
import clientServer from "../../index";


export const fetchCollaborators = createAsyncThunk(
    'collaborators/fetchByNote',
    async (noteId, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, '') : null;

            const res = await clientServer.get(`/notes/${noteId}/collaborators`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return { noteId, collaborators: res.data };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.error || 'Failed to load collaborators'
            );
        }
    }
);

export const addCollaborator = createAsyncThunk(
    'collaborators/add',
    async ({ noteId, email, role }, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, '') : null;

            // email -> userId
            const userRes = await clientServer.get(
                `/auth/by-email?email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const userId = userRes.data.id;

            await clientServer.post(
                `/notes/${noteId}/collaborators`,
                { userId, role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // list reload
            thunkAPI.dispatch(fetchCollaborators(noteId));
            return true;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.error || 'Failed to add collaborator'
            );
        }
    }
);

export const removeCollaborator = createAsyncThunk(
    'collaborators/remove',
    async ({ noteId, userId }, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, '') : null;

            await clientServer.delete(`/notes/${noteId}/collaborators/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            thunkAPI.dispatch(fetchCollaborators(noteId));
            return true;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.error || 'Failed to remove collaborator'
            );
        }
    }
);
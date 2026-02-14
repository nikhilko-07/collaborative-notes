import clientServer from "../../index";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const fetchActivityByNote = createAsyncThunk(
    'activity/fetchByNote',
    async (noteId, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.get(`/notes/${noteId}/activity`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return { noteId, activity: res.data };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.error || 'Failed to load activity'
            );
        }
    }
);

export const fetchActivityFeed = createAsyncThunk(
    'activityFeed/fetch',
    async (_, thunkAPI) => {
        try {
            const raw = localStorage.getItem('token');
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const res = await clientServer.get('/activity',{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.error || 'Failed to load activity feed'
            );
        }
    }
);
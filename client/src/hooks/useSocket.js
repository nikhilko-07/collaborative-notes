// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentNoteFromSocket } from '../config/redux/reducer/noteReducer';

export const useSocket = (noteId) => {
    const socketRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!noteId || !user) return;

        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:9000', {
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.emit('join-note', { noteId, userId: user.id });

        socket.on('content-updated', (payload) => {
            // { noteId, title, content, version, lastModified }
            dispatch(setCurrentNoteFromSocket(payload));
        });

        socket.on('error', (err) => {
            console.error('Socket error', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [noteId, user, dispatch]);

    const emitUpdate = (data) => {
        if (!socketRef.current || !user) return;

        socketRef.current.emit('note-update', {
            noteId,
            title: data.title,
            content: data.content,
            // version optional kara dete, backend khud manage kar raha
            version: data.version ?? 0,
            userId: user.id,
        });
    };

    return { emitUpdate };
};

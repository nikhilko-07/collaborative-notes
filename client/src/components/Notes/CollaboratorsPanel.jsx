import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
} from '../../config/redux/action/collaboratorAction';

const CollaboratorsPanel = ({ noteId }) => {
    const dispatch = useDispatch();
    const { byNoteId = {}, loading = false, error = null } =
        useSelector((s) => s.collaborators || {});

    const collaborators = byNoteId[noteId] || [];

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('EDITOR');

    useEffect(() => {
        if (noteId) {
            dispatch(fetchCollaborators(noteId));
        }
    }, [noteId, dispatch]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        dispatch(addCollaborator({ noteId, email, role }));
        setEmail('');
    };

    const handleRemove = (userId) => {
        dispatch(removeCollaborator({ noteId, userId }));
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Heading */}
            <h2 className="text-lg font-semibold">
                Collaborators
            </h2>

            {/* Loading + Error */}
            {loading && (
                <p className="text-sm text-gray-500">
                    Loading collaborators...
                </p>
            )}

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* List */}
            <div className="flex flex-col gap-2">

                {collaborators.map((c) => (
                    <div
                        key={c.id}
                        className="
                            flex items-center justify-between
                            bg-white
                            border
                            rounded-lg
                            px-3 py-2
                            hover:shadow-sm
                            transition
                        "
                    >
                        <span className="text-sm font-medium text-gray-700">
                            {c.user?.email}
                        </span>

                        <div className="flex items-center gap-2">

                            {/* Role badge */}
                            <span
                                className={`
                                    text-xs font-semibold px-2 py-1 rounded-full
                                    ${c.role === 'EDITOR'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-200 text-gray-700'}
                                `}
                            >
                                {c.role}
                            </span>

                            {/* Remove button */}
                            <button
                                onClick={() => handleRemove(c.userId)}
                                className="
                                    text-xs
                                    bg-red-50
                                    text-red-600
                                    px-2 py-1
                                    rounded-md
                                    hover:bg-red-100
                                    transition
                                "
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {collaborators.length === 0 && !loading && !error && (
                    <p className="text-sm text-gray-500">
                        No collaborators yet.
                    </p>
                )}
            </div>

            {/* Add Form */}
            <form
                onSubmit={handleAdd}
                className="flex flex-col gap-2 pt-2 border-t"
            >

                <input
                    type="email"
                    placeholder="Collaborator email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                        border
                        rounded-lg
                        px-3 py-2
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                    "
                />

                <div className="flex gap-2">

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="
                            border
                            rounded-lg
                            px-2
                            text-sm
                            focus:ring-2
                            focus:ring-indigo-500
                        "
                    >
                        <option value="EDITOR">Editor</option>
                        <option value="VIEWER">Viewer</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            flex-1
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            rounded-lg
                            text-sm
                            font-medium
                            py-2
                            transition
                        "
                    >
                        Add Collaborator
                    </button>

                </div>
            </form>
        </div>
    );
};

export default CollaboratorsPanel;
